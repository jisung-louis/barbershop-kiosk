const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', (req, res) => {
  const { designer_id, service_id, appointment_time, customer_name } = req.body;
  db.query(
    'INSERT INTO appointments (designer_id, service_id, appointment_time, customer_name) VALUES (?, ?, ?, ?)',
    [designer_id, service_id, appointment_time, customer_name],
    (error, results) => {
      if (error) throw error;
      res.json({ id: results.insertId });
    }
  );
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM appointments WHERE id = ?', [id], (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});

module.exports = router;