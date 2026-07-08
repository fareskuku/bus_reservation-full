class AuthManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.isAuthenticated = !!this.token;
        this.role = this.user?.role || localStorage.getItem('role') || 'customer';
        console.log('Auth state:', { isAuthenticated: this.isAuthenticated, user: this.user, role: this.role });
    }

    setAuth(token, user) {
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        this.role = user.role || 'customer';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', this.role);
        this.updateUI();
        console.log('Auth set:', { token, user, role: this.role });
    }

    clearAuth() {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        this.role = 'customer';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        this.updateUI();
        console.log('Auth cleared');
    }

    getToken() { return this.token; }
    getUser() { return this.user; }
    getRole() { return this.role; }

    isAdmin() { return this.role === 'admin'; }
    isManager() { return this.role === 'manager'; }
    isCustomer() { return this.role === 'customer'; }

    updateUI() {
        const authNav = document.querySelector('.auth-nav');
        const userNav = document.querySelector('.user-nav');
        const adminNav = document.querySelector('.admin-nav');
        const dashboardBtn = document.getElementById('dashboardBtn');
        const adminDashboardBtn = document.getElementById('adminDashboardBtn');

        if (this.isAuthenticated) {
            if (authNav) authNav.style.display = 'none';
            if (userNav) userNav.style.display = 'flex';
            
            if (this.isAdmin()) {
                if (adminNav) adminNav.style.display = 'flex';
                if (adminDashboardBtn) adminDashboardBtn.style.display = 'inline';
            } else {
                if (adminNav) adminNav.style.display = 'none';
                if (adminDashboardBtn) adminDashboardBtn.style.display = 'none';
            }
            
            if (dashboardBtn) dashboardBtn.style.display = 'inline';
        } else {
            if (authNav) authNav.style.display = 'flex';
            if (userNav) userNav.style.display = 'none';
            if (adminNav) adminNav.style.display = 'none';
            if (adminDashboardBtn) adminDashboardBtn.style.display = 'none';
        }

        this.updateDashboardContent();
    }

    updateDashboardContent() {
        const publicContent = document.getElementById('publicContent');
        const userDashboard = document.getElementById('userDashboard');
        const adminDashboard = document.getElementById('adminDashboard');

        if (this.isAdmin()) {
            if (publicContent) publicContent.style.display = 'none';
            if (userDashboard) userDashboard.style.display = 'none';
            if (adminDashboard) adminDashboard.style.display = 'block';
            if (window.loadAdminDashboard) window.loadAdminDashboard();
        } else if (this.isAuthenticated) {
            if (publicContent) publicContent.style.display = 'none';
            if (userDashboard) userDashboard.style.display = 'block';
            if (adminDashboard) adminDashboard.style.display = 'none';
            if (window.loadUserDashboard) window.loadUserDashboard();
        } else {
            if (publicContent) publicContent.style.display = 'block';
            if (userDashboard) userDashboard.style.display = 'none';
            if (adminDashboard) adminDashboard.style.display = 'none';
        }
    }

    async login(email, password) {
        try {
            const response = await api.auth.login({ email, password });
            this.setAuth(response.token, response.user);
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            console.log('📝 Registering user:', userData);
            const response = await api.auth.register(userData);
            this.setAuth(response.token, response.user);
            return response;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }

    logout() {
        this.clearAuth();
        window.location.reload();
    }
}

const authManager = new AuthManager();