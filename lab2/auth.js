document.addEventListener('DOMContentLoaded', () => {
    
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');


    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();


            const user = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                gender: document.getElementById('gender').value,
                dob: document.getElementById('dob').value
            };


            localStorage.setItem('currentUser', JSON.stringify(user));
            
            alert('Реєстрація успішна! Тепер ви можете увійти.');
            window.location.href = 'index.html'; 
        });
    }


    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const inputEmail = document.getElementById('email').value;

            
            const savedUser = JSON.parse(localStorage.getItem('currentUser'));

            if (savedUser && savedUser.email === inputEmail) {
                window.location.href = 'app.html'; 
            } else {
                alert('Користувача з таким Email не знайдено! Спробуйте зареєструватися.');
            }
        });
    }


    const profileEmail = document.getElementById('profile-email');
    if (profileEmail) {
        const savedUser = JSON.parse(localStorage.getItem('currentUser'));

        if (savedUser) {

            document.getElementById('profile-full-name').textContent = savedUser.name;
            document.getElementById('profile-email').textContent = savedUser.email;
            document.getElementById('profile-gender').textContent = savedUser.gender === 'male' ? 'Чоловіча' : 'Жіноча';
            document.getElementById('profile-dob').textContent = savedUser.dob;
    

            const names = savedUser.name.split(' ');
            const initials = names.map(n => n[0]).join('').toUpperCase();
            document.getElementById('profile-initials').textContent = initials;
        } else {

            window.location.href = 'index.html';
        }
    }

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout){
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

});