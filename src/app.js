const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const db = require('./config/db'); // 경로 수정

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// 로그인 라우트
app.post('/login', (req, res) => {
    const { phone } = req.body;
    const query = 'SELECT * FROM customers WHERE phone = ?';
    
    db.query(query, [phone], (error, results) => {
      if (error) {
        console.error('DB 조회 오류:', error);
        res.status(500).send('Internal Server Error');
      } else if (results.length > 0) {
        const customer = results[0];
        res.json({ success: true, customerName: customer.name, customerId: customer.id, customerPhone: customer.phone });
      } else {
        res.json({ success: false, message: '전화번호가 일치하지 않습니다.' });
      }
    });
  });

// 회원가입 라우트
app.post('/signup', (req, res) => {
  const { name, phone } = req.body;
  const query = 'INSERT INTO customers (name, phone) VALUES (?, ?)';

  db.query(query, [name, phone], (error, results) => {
    if (error) {
      console.error('DB 삽입 오류:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.json({ success: true });
    }
  });
});

// 고객 ID 조회 라우트
app.get('/get-customer-id', (req, res) => {
    const { phone } = req.query;
    const query = 'SELECT id FROM customers WHERE phone = ?';
  
    db.query(query, [phone], (error, results) => {
      if (error) {
        console.error('DB 조회 오류:', error);
        res.status(500).send('Internal Server Error');
      } else if (results.length > 0) {
        res.json({ success: true, customerId: results[0].id });
      } else {
        res.json({ success: false, message: '전화번호가 일치하지 않습니다.' });
      }
    });
  });
  

// 고객 데이터 저장 라우트
app.post('/save-customer-data', (req, res) => {
    const { customerId, customerName, customerPhone, designer, consultation, services, additionalServices, totalPrice, receipt } = req.body;
  
    /*console.log('요청 데이터:', req.body);*/ //저장 요청이 제대로 전송됐는지 확인하는 콘솔 로그
  
    const servicesIds = services.map(service => service.id).join(',');
    const additionalServicesStr = additionalServices.join(',');
  
    const insertQuery = `
        INSERT INTO appointments (customer_id, designer_id, service_ids, additional_services, total_price, receipt, consultation)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
  
      db.query(insertQuery, [customerId, designer.id, servicesIds, additionalServicesStr, totalPrice, receipt, consultation], (error, results) => {
        if (error) {
          console.error('DB 삽입 오류:', error);
          return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
  
        // 삽입된 데이터 확인을 위해 조회
        db.query('SELECT * FROM appointments WHERE id = ?', [results.insertId], (error, results) => {
          if (error) {
            console.error('DB 조회 오류:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
          }
          console.log(`========= ${customerName}(${customerPhone})(ID:${customerId})님이 Kiosk에서 결제를 마쳤습니다! =========\n========= 다음은 appoinment 테이블에 방금 저장된 정보입니다. =========`);
          console.log('저장된 고객 데이터:', results[0]);
          console.log('======================================================')
          res.json({ success: true, customerData: results[0] });
        });
      });
  });
        
        // 라우트 파일들
        const customersRouter = require('./routes/customers');
        const servicesRouter = require('./routes/services');
        const designersRouter = require('./routes/designers');
        
        app.use('/customers', customersRouter);
        app.use('/services', servicesRouter);
        app.use('/designers', designersRouter);
        
        app.listen(port, '0.0.0.0', () => {
        console.log(`Server running at http://localhost:${port}/`);
        });