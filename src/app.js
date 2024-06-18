const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const db = require('./config/db');

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

  let servId;
  if (services == null) {
    servId = "6";
  } else {
    servId = (Array.isArray(services) ? services : []).map(service => service.id).join(',');
  }
  const servicesIds = servId;
  const additionalServicesStr = (Array.isArray(additionalServices) ? additionalServices : []).join(',');

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

// appointments 라우트 추가
app.get('/appointments', (req, res) => {
  const query = `
    SELECT 
      appointments.id,
      customers.name AS customer_name,
      designers.name AS designer_name,
      appointments.service_ids,
      appointments.additional_services,
      appointments.total_price,
      appointments.receipt,
      appointments.consultation
    FROM appointments
    JOIN customers ON appointments.customer_id = customers.id
    JOIN designers ON appointments.designer_id = designers.id
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('DB 조회 오류:', error);
      return res.status(500).send('Internal Server Error');
    }

    const serviceQueries = results.map(appointment => {
      const serviceIds = appointment.service_ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)); // NaN 값 필터링
      const serviceQuery = 'SELECT name FROM services WHERE id IN (?)';
      return new Promise((resolve, reject) => {
        db.query(serviceQuery, [serviceIds], (error, serviceResults) => {
          if (error) {
            return reject(error);
          }
          appointment.service_names = serviceResults.map(service => service.name).join(', ');
          resolve();
        });
      });
    });

    Promise.all(serviceQueries)
      .then(() => {
        res.json(results);
      })
      .catch(error => {
        console.error('Service name 조회 오류:', error);
        res.status(500).send('Internal Server Error');
      });
  });
});

// 삭제 라우트 추가
app.delete('/delete-appointment/:id', (req, res) => {
  const { id } = req.params;
  const deleteQuery = 'DELETE FROM appointments WHERE id = ?';
  const resetIdQuery1 = 'SET @count = 0';
  const resetIdQuery2 = 'UPDATE appointments SET id = @count:=@count+1';
  const resetAutoIncrementQuery = 'ALTER TABLE appointments AUTO_INCREMENT = 1';

  db.query(deleteQuery, [id], (error, results) => {
    if (error) {
      console.error('DB 삭제 오류:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    db.query(resetIdQuery1, (error, results) => {
      if (error) {
        console.error('ID 재정렬 오류 (step 1):', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      db.query(resetIdQuery2, (error, results) => {
        if (error) {
          console.error('ID 재정렬 오류 (step 2):', error);
          return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        db.query(resetAutoIncrementQuery, (error, results) => {
          if (error) {
            console.error('AUTO_INCREMENT 재설정 오류:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
          }
          res.json({ success: true });
        });
      });
    });
  });
});

// customers 라우트 추가
app.get('/customers', (req, res) => {
  const query = 'SELECT * FROM customers';
  
  db.query(query, (error, results) => {
    if (error) {
      console.error('DB 조회 오류:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

// designers 라우트 추가
app.get('/designers', (req, res) => {
  const query = 'SELECT * FROM designers';
  
  db.query(query, (error, results) => {
    if (error) {
      console.error('DB 조회 오류:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

// services 라우트 추가
app.get('/services', (req, res) => {
  const query = 'SELECT * FROM services';
  
  db.query(query, (error, results) => {
    if (error) {
      console.error('DB 조회 오류:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
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