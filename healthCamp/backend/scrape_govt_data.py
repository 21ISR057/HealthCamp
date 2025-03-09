import requests
import fitz  # PyMuPDF
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")  
firebase_admin.initialize_app(cred)
db = firestore.client()

# PDF URL
pdf_url = "https://www.nhm.tn.gov.in/sites/default/files/documents/erode.pdf"

# Download the PDF
pdf_path = "erode.pdf"
response = requests.get(pdf_url)
with open(pdf_path, "wb") as file:
    file.write(response.content)

print("✅ PDF downloaded successfully!")

# Open the PDF
doc = fitz.open(pdf_path)

# List to store structured data
data_list = []

# Extract text from each page
for page in doc:
    text = page.get_text("text")  
    lines = text.split("\n")  # Split text line by line

    # Loop through lines and extract structured data
    for i in range(len(lines) - 7):  # Adjust based on number of columns in each row
        try:
            data = {
                "Days": lines[i].strip(),
                "FN_AN": lines[i + 1].strip(),
                "Camp_site": lines[i + 2].strip(),
                "Name_of_Villages": lines[i + 3].strip(),
                "Distance_to_be_covered": lines[i + 4].strip(),
                "Population_to_be_covered": lines[i + 5].strip(),
                "Area_staff_involved": lines[i + 6].strip(),
            }
            
            # Ensure data is correctly formatted before adding
            if all(data.values()):  
                data_list.append(data)
        except IndexError:
            print("⚠️ Skipping incomplete row")

print("✅ Text extraction complete!")

# Store each row as a separate document in Firebase Firestore
collection_ref = db.collection("govtdata")

for data in data_list:
    doc_ref = collection_ref.add(data)  # Adds a new document for each row
    print(f"✅ Stored row in Firebase with ID: {doc_ref[1].id}")

print("🎉 All rows successfully stored in Firebase!")
