const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost', // 로컬 MySQL 서버의 호스트
  user: 'root',      // MySQL 설치 시 설정한 사용자 이름 (기본값은 'root')
  password: '1234', // MySQL 설치 시 설정한 비밀번호
  database: 'barbershop'  // 사용하고자 하는 데이터베이스 이름
});

db.connect((err) => {
  if (err) {
    console.error('DB 연결 오류:', err);
  } else {
    console.log('DB에 연결되었습니다.');
  }
});

module.exports = db;