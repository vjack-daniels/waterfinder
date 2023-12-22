document.addEventListener('DOMContentLoaded', function() {
    // URLs to your Django backend endpoints for JWT authentication
    const loginUrl = 'http://localhost:8000/api/login/';
    const registerUrl = 'http://localhost:8000/api/register/';

    // Function to handle user registration
    function registerUser(username, password, email) {
        fetch(registerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password,
                "email": email
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.detail) {
                alert(data.detail);
            } else {
                alert('User registered successfully!');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to register user');
        });
    }

    // Function to handle user login
    function loginUser(username, password) {
        fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.access) {
                // Save JWT to localStorage or any other secure storage you're using
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                window.location.href = 'map.html'
                alert('User logged in successfully!');
            } else {
                alert('Failed to log in');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to log in');
        });
    }

    // Event listener for the registration button
    document.getElementById('registerButton').addEventListener('click', function() {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const email = document.getElementById('register-email').value;

        registerUser(username, password, email);
    });

    // Event listener for the login button
    document.getElementById('loginButton').addEventListener('click', function() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        loginUser(username, password);
    });
});
