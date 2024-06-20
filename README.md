# 바버샵 키오스크 프로젝트

## 개요

바버샵 키오스크 프로젝트는 바버샵의 결제 및 서비스를 관리하는 Node.js 기반 웹 애플리케이션입니다. 
성결대학교 소프트웨어공학 팀 15의 팀플 구현물입니다.
본 애플리케이션은 고객이 로그인하고, 디자이너를 선택하고, 서비스를 선택하고, 결제를 할 수 있게 합니다.
데이터베이스는 MySQL을 사용합니다.

## 사용 기술

- Node.js
- Express.js
- MySQL
- AWS RDS
- HTML/CSS
- JavaScript

## 실행 방법

1. **레포지토리 클론:**

   ```sh
   git clone https://github.com/jisung-louis/barbershop-kiosk.git
   cd barbershop-kiosk
   ```

2. **의존성 설치**

    ```sh
    npm install
    ```

3. **DB 설정**
config/db에서 mysql password를 본인의 password로 변경합니다.


     ```javascript
     const mysql = require('mysql2');

     const connection = mysql.createConnection({
     host: 'localhost', // 로컬 MySQL 서버의 호스트
     user: 'root',      // MySQL 사용자 이름
     password: 'your_password', // MySQL 비밀번호
     database: 'barbershop'  // 데이터베이스 이름
     });
     ```
     
4. **DB 초기화**

   ```sh
   npm run setup-db
   ```

5. **실행**
   ```sh
   npm start
   ```

6. **로컬호스트 접속**  

http://localhost:3000

## 만든이

성결대학교 소프트웨어공학 팀13  

팀장 - 정서영  
팀원 - 전지성, 김성범, 조동현, 강해원  


© 2024 Team13. all rights reserved.




