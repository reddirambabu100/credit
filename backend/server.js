// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors()); // Allow requests from different domains
app.use(bodyParser.json()); // Parse incoming JSON data

// Synchronous payment function
function processPaymentSync(data) {
  if (data.cardNumber === "1234123412341234" && data.cvv === "123" && data.expiryDate === "12/34" && data.cardHolderName === "Ram") {
    return { success: true, message: "Payment successful (Sync)" }; // Corrected typo here
  }
  return { success: false, message: "Sync payment failed: Invalid card details" };
}

// Asynchronous payment function (using Promise)
function processPaymentAsync(data) {
  return new Promise((resolve, reject) => {
    // Simulate a 2-second delay using setTimeout
    setTimeout(() => {
      if (data.cardNumber === "5678567856785678" && data.cvv === "567" && data.expiryDate === "12/34" && data.cardHolderName === "Venkat") {
        resolve({ success: true, message: "Payment successful (Async)" });
      } else {
        reject(new Error("Async payment failed: Invalid card details"));
      }
    }, 2000); // 2 seconds delay
  });
}

// Route for synchronous payment
app.post("/api/pay-sync", (req, res) => {
  const result = processPaymentSync(req.body); // Process the payment
  res.status(200).json(result); // Send response back
});

// Route for asynchronous payment
app.post("/api/pay-async", (req, res) => {
  processPaymentAsync(req.body)
    .then(result => {
      res.status(200).json(result); // Send success response
    })
    .catch(err => {
      res.status(500).json({ success: false, message: err.message }); // Error handling
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
