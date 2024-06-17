document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('signup-btn').addEventListener('click', function () {
    document.getElementById('signup-modal').style.display = 'block';
  });

  document.getElementsByClassName('close')[0].addEventListener('click', function () {
    document.getElementById('signup-modal').style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target == document.getElementById('signup-modal')) {
      document.getElementById('signup-modal').style.display = 'none';
    }
  });

  document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const phone = document.getElementById('login-phone').value;
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone_last4: phone })
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        localStorage.setItem('customerId', result.customerId); // 고객 ID 저장
        localStorage.setItem('customerName', result.name); // 사용자 이름 저장
        window.location.href = '/select-designer.html'; // 로그인 성공 시 디자이너 선택 화면으로 이동
      } else {
        alert('Login failed: ' + result.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });

  document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const phone = document.getElementById('signup-phone').value;
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, phone_last4: phone })
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        alert('Sign up successful');
        document.getElementById('signup-modal').style.display = 'none';
      } else {
        alert('Sign up failed: ' + result.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  fetch('/services')
    .then(response => response.json())
    .then(services => {
      const list = document.getElementById('service-list');
      services.forEach(service => {
        const button = document.createElement('button');
        button.classList.add('service-btn');
        button.innerHTML = `
          <div>
            <h2>${service.name}</h2>
            <p>${parseInt(service.price)}원</p>
          </div>
        `;
        button.addEventListener('click', function () {
          if (selectedServices.includes(service)) {
            selectedServices = selectedServices.filter(s => s !== service);
            button.classList.remove('selected');
          } else {
            selectedServices.push(service);
            button.classList.add('selected');
          }
          console.log('Selected services:', selectedServices); // Debugging log
        });
        list.appendChild(button);
      });
    });

  document.querySelectorAll('.add-service-btn').forEach(button => {
    button.addEventListener('click', function () {
      const service = this.getAttribute('data-service');
      if (selectedAdditionalServices.includes(service)) {
        selectedAdditionalServices = selectedAdditionalServices.filter(s => s !== service);
        button.classList.remove('selected');
      } else {
        selectedAdditionalServices.push(service);
        button.classList.add('selected');
      }
      console.log('Selected additional services:', selectedAdditionalServices); // Debugging log
    });
  });

  document.getElementById('next-btn').addEventListener('click', function () {
    if (selectedServices.length === 0) {
      alert('시술을 선택하세요.');
      return;
    }
    // 선택된 시술과 부가 서비스 저장
    localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
    localStorage.setItem('selectedAdditionalServices', JSON.stringify(selectedAdditionalServices));
    // 시술 선택 후 다음 화면으로 이동
    window.location.href = '/checkout.html';
  });
});