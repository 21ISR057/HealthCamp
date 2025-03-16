import requests
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials, firestore
import pdfplumber  # Library to extract text from PDFs
import re  # Regular expressions for parsing text

# Base URL of the website
BASE_URL = "https://www.nhm.tn.gov.in"

# Step 1: Scrape the Data from the Website
def scrape_website(url):
    # Send a GET request to the webpage
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the table containing the district data
    table = soup.find('table')

    # Initialize a dictionary to store the data
    district_data = {}

    # Iterate through the table rows
    for row in table.find_all('tr')[1:]:  # Skip the header row
        columns = row.find_all('td')
        if len(columns) < 3:  # Ensure there are at least 3 columns
            continue

        # Extract district name
        district_name = columns[1].text.strip()

        # Extract the "View Document" link
        view_document_tag = columns[2].find('a')  # Find the <a> tag in the third column
        if view_document_tag and 'href' in view_document_tag.attrs:
            view_document_link = view_document_tag['href']

            # Convert relative URL to absolute URL
            if view_document_link.startswith('/'):
                view_document_link = BASE_URL + view_document_link

            # Download the PDF and extract its content
            print(f"Downloading PDF for district: {district_name}")
            pdf_content = extract_pdf_content(view_document_link)
            if pdf_content:
                # Parse the PDF content to extract the required fields
                parsed_data = parse_pdf_content(pdf_content)
                if parsed_data:
                    district_data[district_name] = parsed_data
                else:
                    print(f"Failed to parse PDF content for district: {district_name}")
            else:
                print(f"Failed to extract content from PDF for district: {district_name}")
        else:
            print(f"No 'View Document' link found for district: {district_name}")

    return district_data

# Step 2: Extract PDF Content
def extract_pdf_content(pdf_url):
    try:
        # Download the PDF file
        response = requests.get(pdf_url)
        with open("temp.pdf", "wb") as f:
            f.write(response.content)

        # Extract text from the PDF
        with pdfplumber.open("temp.pdf") as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text()  # Extract text from each page

        return text
    except Exception as e:
        print(f"Error extracting PDF content: {e}")
        return None

# Step 3: Parse PDF Content
def parse_pdf_content(pdf_content):
    try:
        # Split the PDF content into lines
        lines = pdf_content.split('\n')

        # Initialize a list to store the parsed data
        parsed_data = []

        # Iterate through the lines and extract the required fields
        for line in lines:
            # Use regex to extract the fields
            match = re.match(
                r"(\d+\w+\s+\w+)\s+(FN|AN)\s+(.+?)\s+(.+?)\s+(\d+\.?\d*\s*\w*)\s+(\d+)\s+(.+)",
                line
            )
            if match:
                camp_day, fn_an, camp_site, village_name, distance, population, area_staff = match.groups()
                parsed_data.append({
                    "CAMP DAY": camp_day.strip(),
                    "FN / AN": fn_an.strip(),
                    "Camp Site": camp_site.strip(),
                    "Name of the Village to be covered": village_name.strip(),
                    "Distance of the Villages covered from the Camp site": distance.strip(),
                    "Population to be covered": population.strip(),
                    "Area Staff to be involved": area_staff.strip(),
                })

        return parsed_data
    except Exception as e:
        print(f"Error parsing PDF content: {e}")
        return None

# Step 4: Store the Data in Firebase
def store_in_firebase(district_data):
    # Initialize Firebase Admin SDK
    cred = credentials.Certificate('serviceAccountKey.json')  # Replace with your Firebase credentials file path
    firebase_admin.initialize_app(cred)

    # Initialize Firestore
    db = firestore.client()

    # Reference to the govtdata collection
    govtdata_ref = db.collection('govtdata')

    # Store the scraped data in Firebase
    for district, data in district_data.items():
        # Add the data to the govtdata collection with district name as document ID
        govtdata_ref.document(district).set({
            "camps": data
        })

    print("Data successfully stored in Firebase!")

# Main Function
def main():
    # URL of the webpage
    url = "https://www.nhm.tn.gov.in/en/hospital-on-wheels-hows-programme-ftp"

    # Scrape the data
    district_data = scrape_website(url)

    # Store the data in Firebase
    store_in_firebase(district_data)

# Run the program
if __name__ == "__main__":
    main()