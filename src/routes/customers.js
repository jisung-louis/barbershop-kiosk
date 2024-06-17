const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 고객 데이터 저장
router.post('/save-customer-data', (req, res) => {
  const { designer, consultation, services, additionalServices, totalPrice, receipt } = req.body;
  const customerId = req.session.customerId; // Assuming customer ID is stored in session

  const query = `
    INSERT INTO customers (customer_id, designer, consultation, services, additional_services, total_price, receipt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const servicesString = services ? JSON.stringify(services) : null;
  const additionalServicesString = additionalServices ? JSON.stringify(additionalServices) : null;

  db.query(query, [customerId, designer.name, consultation, servicesString, additionalServicesString, totalPrice, receipt], (error, results) => {
    if (error) {
      console.error('DB 저장 오류:', error);
      res.status(500).json({ success: false });
    } else {
      db.query('SELECT * FROM customers WHERE customer_id = ?', [customerId], (err, rows) => {
        if (err) {
          console.error('DB 조회 오류:', err);
          res.status(500).json({ success: false });
        } else {
          console.log('고객 데이터:', rows);
          res.json({ success: true, customerData: rows });
        }
      });
    }
  });
});

module.exports = router;