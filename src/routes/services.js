const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 기존 서비스 목록 반환 라우트
router.get('/', (req, res) => {
  db.query('SELECT * FROM services', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// 부가 서비스 목록 반환 라우트 추가
router.get('/additional-services', (req, res) => {
  const additionalServices = ['스몰토크', '간식']; // 추가적인 서비스 정의
  res.json(additionalServices);
});

module.exports = router;