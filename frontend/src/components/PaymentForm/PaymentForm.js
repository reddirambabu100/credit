import React, { useState } from "react";
import "./PaymentForm.css";

const PaymentForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState(""); 
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentType, setPaymentType] = useState("sync");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); 

    const endpoint = paymentType === "sync" ? "http://localhost:5000/api/pay-sync" : "http://localhost:5000/api/pay-async";
    const startTime = Date.now() ;
    console.log(startTime) ; 
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardNumber, cardHolderName, expiryDate, cvv }),
    };

    try {
      const response = await fetch(endpoint, options);
      const data = await response.json();

      const endTime = Date.now();
      console.log(`⏱ Response time: ${(endTime - startTime) / 1000}s`);

      setMessage(data.message);
    } catch (err) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h1>Credit Card Payment</h1>
      <form onSubmit={handleSubmit}>
        {/* Cardholder Name */}
        <div className="input-group">
          <label htmlFor="cardHolderName">Cardholder Name</label>
          <input
            type="text"
            id="cardHolderName" 
            placeholder="Enter Cardholder Name"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            required
          />
        </div>

        {/* Card Number */}
        <div className="input-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            placeholder="Enter Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>

        {/* Expiry Date and CVV */}
        <div className="input-group-inline">
          <div>
            <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
            <input
              type="text"
              id="expiryDate"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Payment Type */}
        <div className="input-group">
          <label htmlFor="paymentType">Payment Type</label>
          <select
            id="paymentType"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <option value="sync">Synchronous</option>
            <option value="async">Asynchronous</option>
          </select>
        </div>

        {/* Pay Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PaymentForm;
