const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM designers', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

module.exports = router;