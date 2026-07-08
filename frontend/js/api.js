const API_BASE_URL = 'http://localhost:5000/api';

class API {
    constructor() {
        this.baseURL = API_BASE_URL;
        console.log('🔗 API Base URL:', this.baseURL);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        console.log(`📨 ${options.method || 'GET'} ${url}`);
        
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            console.log('📬 Response:', data);
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            return data;
        } catch (error) {
            console.error('❌ API Error:', error);
            throw error;
        }
    }

    auth = {
        register: (userData) => {
            console.log('📝 Registering user:', userData.email);
            return this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
        },
        login: (credentials) => {
            console.log('🔐 Logging in:', credentials.email);
            return this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });
        },
        getProfile: () => this.request('/auth/me')
    };

    buses = {
        getAll: () => this.request('/buses'),
        getById: (id) => this.request(`/buses/${id}`),
        getSeats: (id) => this.request(`/buses/${id}/seats`),
        create: (data) => this.request('/buses', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => this.request(`/buses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => this.request(`/buses/${id}`, {
            method: 'DELETE'
        })
    };

    routes = {
        getAll: (filters = {}) => {
            const query = new URLSearchParams(filters).toString();
            return this.request(`/routes${query ? '?' + query : ''}`);
        },
        getById: (id) => this.request(`/routes/${id}`),
        getSeats: (id) => this.request(`/routes/${id}/seats`),
        create: (data) => this.request('/routes', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => this.request(`/routes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => this.request(`/routes/${id}`, {
            method: 'DELETE'
        })
    };

    bookings = {
        getAll: () => this.request('/bookings'),
        getById: (id) => this.request(`/bookings/${id}`),
        create: (data) => this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        cancel: (id) => this.request(`/bookings/${id}/cancel`, {
            method: 'PUT'
        }),
        getAllAdmin: () => this.request('/bookings/all'),
        updateStatus: (id, status) => this.request(`/bookings/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        })
    };

    dashboard = {
        getStats: () => this.request('/dashboard/stats'),
        getRecent: () => this.request('/dashboard/recent'),
        getUpcoming: () => this.request('/dashboard/upcoming'),
        getUserDashboard: () => this.request('/dashboard/user')
    };
}

const api = new API();