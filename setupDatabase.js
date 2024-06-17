const mysql = require('mysql2');
const dbConfig = require('./src/config/db'); // 경로 수정

const connection = mysql.createConnection({
  host: 'mydbinstance.c1gca26esclg.ap-northeast-2.rds.amazonaws.com', // 여기에 실제 RDS 엔드포인트를 입력하세요
  user: 'admin',     // 여기에 실제 사용자 이름을 입력하세요
  password: '12341234', // 여기에 실제 비밀번호를 입력하세요
  database: 'barbershop'  // 여기에 실제 데이터베이스 이름을 입력하세요
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }

  console.log('Connected to database.');

  // Drop tables if they exist
  connection.query('DROP TABLE IF EXISTS appointments;', (err, result) => {
    if (err) {
      console.error('Error dropping appointments table:', err.stack);
      return connection.end();
    }
    console.log('Appointments table dropped.');

    connection.query('DROP TABLE IF EXISTS services;', (err, result) => {
      if (err) {
        console.error('Error dropping services table:', err.stack);
        return connection.end();
      }
      console.log('Services table dropped.');

      connection.query('DROP TABLE IF EXISTS designers;', (err, result) => {
        if (err) {
          console.error('Error dropping designers table:', err.stack);
          return connection.end();
        }
        console.log('Designers table dropped.');

        connection.query('DROP TABLE IF EXISTS customers;', (err, result) => {
          if (err) {
            console.error('Error dropping customers table:', err.stack);
            return connection.end();
          }
          console.log('Customers table dropped.');

          // Create customers table
          connection.query(`
            CREATE TABLE IF NOT EXISTS customers (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              phone VARCHAR(255),
              UNIQUE KEY unique_phone (phone)
            );`, (err, result) => {
            if (err) {
              console.error('Error creating customers table:', err.stack);
              return connection.end();
            }
            console.log('Customers table created.');

            // Create designers table
            connection.query(`
              CREATE TABLE IF NOT EXISTS designers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                position VARCHAR(255) NOT NULL,
                photo VARCHAR(255) NOT NULL
              );`, (err, result) => {
              if (err) {
                console.error('Error creating designers table:', err.stack);
                return connection.end();
              }
              console.log('Designers table created.');

              // Create services table
              connection.query(`
                CREATE TABLE IF NOT EXISTS services (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  name VARCHAR(255) NOT NULL,
                  price DECIMAL(10, 2) NOT NULL
                );`, (err, result) => {
                if (err) {
                  console.error('Error creating services table:', err.stack);
                  return connection.end();
                }
                console.log('Services table created.');

                // Create appointments table
                connection.query(`
                  CREATE TABLE IF NOT EXISTS appointments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    customer_name VARCHAR(255) NOT NULL,
                    designer_id INT NOT NULL,
                    service_ids VARCHAR(255),
                    additional_services VARCHAR(255),
                    total_price DECIMAL(10, 2),
                    receipt BOOLEAN,
                    consultation BOOLEAN,
                    FOREIGN KEY (designer_id) REFERENCES designers(id)
                  );`, (err, result) => {
                  if (err) {
                    console.error('Error creating appointments table:', err.stack);
                    return connection.end();
                  }
                  console.log('Appointments table created.');

                  // Insert default designers
                  connection.query(`
                    INSERT INTO designers (name, position, photo) VALUES
                    ('짱구', '원장', 'photo1.jpg'),
                    ('철수', '부원장', 'photo2.jpg'),
                    ('유리', '수석 디자이너', 'photo3.jpg'),
                    ('맹구', '디자이너', 'photo4.jpg'),
                    ('훈이', '디자이너', 'photo5.jpg')
                    ON DUPLICATE KEY UPDATE name=VALUES(name), position=VALUES(position), photo=VALUES(photo);`, (err, result) => {
                    if (err) {
                      console.error('Error inserting default designers:', err.stack);
                      return connection.end();
                    }
                    console.log('Default designers inserted.');

                    // Insert default services
                    connection.query(`
                      INSERT INTO services (name, price) VALUES
                      ('커트', 20000),
                      ('펌', 50000),
                      ('염색', 80000),
                      ('샴푸', 10000),
                      ('클리닉', 50000)
                      ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price);`, (err, result) => {
                      if (err) {
                        console.error('Error inserting default services:', err.stack);
                        return connection.end();
                      }
                      console.log('Default services inserted.');

                      // Close the connection
                      connection.end((err) => {
                        if (err) {
                          console.error('Error closing connection:', err.stack);
                        }
                        console.log('Database setup completed.');
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});