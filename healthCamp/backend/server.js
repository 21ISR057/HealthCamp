const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const admin = require("firebase-admin");
const cors = require("cors");

// Firebase Admin SDK Setup
const serviceAccount = require("./firebase-admin-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://healthcamp-8cef2.firebaseio.com",
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

const scrapeData = async () => {
  try {
    const url = "https://www.nhm.tn.gov.in/en/hospital-on-wheels-hows-programme-ftp";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    let scrapedInfo = [];

    $(".some-class").each((index, element) => {
      scrapedInfo.push({
        title: $(element).find("h2").text(),
        description: $(element).find("p").text(),
      });
    });

    // Store in Firebase
    const docRef = db.collection("scrapedData").doc("howData");
    await docRef.set({ data: scrapedInfo });

    return scrapedInfo;
  } catch (error) {
    console.error("Error scraping:", error);
    return [];
  }
};

app.get("/scrape", async (req, res) => {
  const data = await scrapeData();
  res.json({ success: true, data });
});

app.listen(5000, () => console.log("Server running on port 5000"));
