const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const db = require('./config/db'); // 경로 수정

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // 개발 환경에서는 false, 프로덕션에서는 true로 설정
}));

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
        req.session.customerId = results[0].id;
        req.session.customerName = results[0].name;
        req.session.customerPhone = results[0].phone; // 전화번호 저장
        res.json({ success: true });
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
    const { phone, designer, consultation, services, additionalServices, totalPrice, receipt } = req.body;
  
    console.log('요청 데이터:', req.body);
  
    const servicesIds = services.map(service => service.id).join(',');
    const additionalServicesStr = additionalServices.join(',');
  
    // 고객이 있는지 확인합니다.
    const getCustomerQuery = 'SELECT * FROM customers WHERE phone = ?';
  
    db.query(getCustomerQuery, [phone], (error, results) => {
      if (error) {
        console.error('DB 조회 오류:', error);
        return res.status(500).send('Internal Server Error');
      }
  
      console.log('DB 조회 결과:', results);
  
      /*if (results.length === 0) {
        return res.status(404).json({ success: false, message: '고객을 찾을 수 없습니다.' });
      }*/
  
      /*const customerPhone = results[0].phone;
  
      console.log('고객 전화번호:', customerPhone);*/
  
      // 고객 데이터 저장
      const insertQuery = `
        INSERT INTO appointments (customer_name, designer_id, service_ids, additional_services, total_price, receipt, consultation)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
  
      db.query(insertQuery, [phone, designer.id, servicesIds, additionalServicesStr, totalPrice, receipt, consultation], (error, results) => {
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
  
          console.log('저장된 고객 데이터:', results[0]);
          res.json({ success: true, customerData: results[0] });
        });
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
        
        app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
        });