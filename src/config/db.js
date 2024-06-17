const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'mydbinstance.c1gca26esclg.ap-northeast-2.rds.amazonaws.com', // 여기에 실제 RDS 엔드포인트를 입력하세요
  user: 'admin',     // 여기에 실제 사용자 이름을 입력하세요
  password: '12341234', // 여기에 실제 비밀번호를 입력하세요
  database: 'barbershop'  // 여기에 실제 데이터베이스 이름을 입력하세요
});

db.connect((err) => {
  if (err) {
    console.error('DB 연결 오류:', err);
  } else {
    console.log('DB에 연결되었습니다.');
  }
});

module.exports = db;