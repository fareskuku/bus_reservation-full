function showAuthModal(mode) {
    const modal = document.getElementById('authModal');
    if (!modal) return;

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (mode === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }

    modal.style.display = 'flex';
}

function hideAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal('login');
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal('register');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authManager.logout();
        });
    }

    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal('register');
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal('login');
        });
    }

    const loginFormElement = document.getElementById('loginFormElement');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }

            try {
                const result = await authManager.login(email, password);
                hideAuthModal();
                showToast('Login successful! Welcome back!', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                showToast(error.message || 'Login failed. Please try again.', 'error');
            }
        });
    }

    const registerFormElement = document.getElementById('registerFormElement');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('registerFullName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const phone = document.getElementById('registerPhone').value;

            if (!fullName || !email || !password || !phone) {
                showToast('Please fill in all fields', 'error');
                return;
            }

            if (password.length < 6) {
                showToast('Password must be at least 6 characters long', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            const submitBtn = registerFormElement.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Registering...';
            submitBtn.disabled = true;

            try {
                const userData = { fullName, email, password, phone };
                const result = await authManager.register(userData);
                hideAuthModal();
                showToast('Registration successful! Welcome to Addis Metro!', 'success');
                registerFormElement.reset();
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } catch (error) {
                showToast(error.message || 'Registration failed. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    const closeButtons = document.querySelectorAll('.modal .modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});