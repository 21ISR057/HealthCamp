import os
import tempfile
import requests
import fitz  # PyMuPDF
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import re

# ✅ Load Firebase credentials from environment variable
firebase_key_json = os.getenv("FIREBASE_CREDENTIALS")

if firebase_key_json:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as temp_file:
        temp_file.write(firebase_key_json.encode())
        temp_file_path = temp_file.name

    if not firebase_admin._apps:
        cred = credentials.Certificate(temp_file_path)
        firebase_admin.initialize_app(cred)
else:
    raise FileNotFoundError("❌ Firebase credentials not set in environment variables!")

# ✅ Connect to Firestore
db = firestore.client()

# ✅ Function to get the 1st, 2nd, 3rd, and 4th occurrence of a given weekday in a specific year and month
def get_weekday_occurrences(year, month):
    first_day = datetime(year, month, 1)
    weekday_dates = {}
    
    for i in range(31):  # Covers the entire month
        current_date = first_day + timedelta(days=i)
        if current_date.month != month:
            break  # Stop when next month starts
        
        weekday_name = current_date.strftime("%A")
        if weekday_name not in weekday_dates:
            weekday_dates[weekday_name] = []
        
        weekday_dates[weekday_name].append(current_date.strftime("%d-%m-%Y"))

    return weekday_dates

# ✅ Get all 1st, 2nd, 3rd, and 4th occurrences for January 2025
weekday_occurrences = get_weekday_occurrences(2025, 1)

# ✅ Dictionary of Districts & Corresponding PDFs
pdf_urls = {
    "erode": "https://www.nhm.tn.gov.in/sites/default/files/documents/erode.pdf",
    "coimbatore": "https://www.nhm.tn.gov.in/sites/default/files/documents/coimbatore.pdf",
    "palani": "https://www.nhm.tn.gov.in/sites/default/files/documents/palani.pdf"
}

# ✅ Process each district
for district, pdf_url in pdf_urls.items():
    pdf_filename = pdf_url.split("/")[-1]  # Extract filename
    response = requests.get(pdf_url)

    if response.status_code == 200:
        with open(pdf_filename, "wb") as file:
            file.write(response.content)
        print(f"✅ {pdf_filename} downloaded successfully!")

        # ✅ Open the PDF
        doc = fitz.open(pdf_filename)
        data_list = []
        count = 0  # ✅ Limit to first 10 records

        # ✅ Extract text from each page
        for page in doc:
            if count >= 10:
                break  # ✅ Stop after 10 records
            
            text = page.get_text("text")
            lines = [line.strip() for line in text.split("\n") if line.strip()]  # Remove blank lines
            
            # ✅ Extract structured data using regex filtering
            pattern = r"(\d{1,2}\s?[A-Za-z]+)\s+(FN|AN)\s+(.+?)\s+(.+?)\s+(\d+(\.\d+)?)\s+(\d+)\s+(.+)"
            matches = re.findall(pattern, text)

            for match in matches:
                if count >= 10:
                    break  # ✅ Stop after 10 records
                
                try:
                    day_str, session_type, camp_site, village, distance, _, population, staff = match
                    
                    # ✅ Extract the numeric occurrence (1st, 2nd, etc.) and the day name (Monday, Tuesday, etc.)
                    match_parts = re.match(r"(\d{1,2})(st|nd|rd|th)\s(\w+)", day_str)
                    if match_parts:
                        week_number, _, weekday = match_parts.groups()
                        week_number = int(week_number)
                        weekday = weekday.capitalize()  # Ensure format matches dictionary keys

                        # ✅ Get the corresponding date for that week
                        if weekday in weekday_occurrences and 1 <= week_number <= len(weekday_occurrences[weekday]):
                            camp_date = weekday_occurrences[weekday][week_number - 1]
                        else:
                            camp_date = "Unknown"
                    else:
                        camp_date = "Unknown"

                    # ✅ Compute session time
                    session_time = "9:00 AM - 12:00 PM" if "FN" in session_type else "1:00 PM - 9:00 PM"
                    
                    data = {
                        "Camp_Day": f"{day_str} ({camp_date})",
                        "Session_Time": session_time,
                        "Camp_Site": camp_site,
                        "Name_of_Villages": village,
                        "Distance_to_be_covered": float(distance),  # ✅ Ensures distance is stored as a float
                        "Population_to_be_covered": int(population),  # ✅ Ensures population is stored as an integer
                        "Area_staff_involved": staff,
                        "Source_PDF": pdf_url
                    }
                    
                    data_list.append(data)
                    count += 1  # ✅ Increment count
                except ValueError:
                    print(f"⚠️ Skipping incorrect row format in {pdf_filename}")

        print(f"✅ Extracted first 10 records from {pdf_filename}!")

        # ✅ Store data in Firestore under `govtdata -> district -> PDFs`
        district_ref = db.collection("govtdata").document(district)  # Parent document
        pdf_collection_ref = district_ref.collection("PDFs")  # Subcollection for PDFs

        for data in data_list:
            doc_ref = pdf_collection_ref.add(data)  # ✅ Store as new document
            print(f"✅ Stored row in {district} → PDFs with ID: {doc_ref[1].id}")

print("🎉 First 10 records from each PDF successfully stored in Firebase!")
