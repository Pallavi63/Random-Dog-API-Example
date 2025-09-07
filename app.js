// app.js
const express = require("express");
const https = require("https");

const app = express();
const PORT = 3000;
const API_URL = "https://dog.ceo/api/breeds/image/random";

/* ================================
   1. Using Callbacks
================================ */
function fetchWithCallback(url, callback) {
  https
    .get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          callback(null, JSON.parse(data));
        } catch (err) {
          callback(err, null);
        }
      });
    })
    .on("error", (err) => callback(err, null));
}

/* ================================
   2. Using Promises
================================ */
function fetchWithPromise(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", (err) => reject(err));
  });
}

/* ================================
   3. Using Async/Await
================================ */
async function fetchWithAsync(url) {
  return await fetchWithPromise(url);
}

/* ================================
   Express Route
================================ */
app.get("/", (req, res) => {
  // Callbacks
  fetchWithCallback(API_URL, (err, data1) => {
    if (err) return res.status(500).send("Error with callback");

    // Promises
    fetchWithPromise(API_URL)
      .then((data2) => {
        // Async/Await
        (async () => {
          try {
            const data3 = await fetchWithAsync(API_URL);

            // Send results (showing dog images)
            res.send(`
              <h1>🐶 Random Dog Images</h1>
              
              <h2>Callback Result:</h2>
              <img src="${data1.message}" width="300"/>
              
              <h2>Promise Result:</h2>
              <img src="${data2.message}" width="300"/>
              
              <h2>Async/Await Result:</h2>
              <img src="${data3.message}" width="300"/>
            `);
          } catch (err) {
            res.status(500).send("Error with async/await");
          }
        })();
      })
      .catch(() => res.status(500).send("Error with promise"));
  });
});

/* ================================
   Start Server
================================ */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});