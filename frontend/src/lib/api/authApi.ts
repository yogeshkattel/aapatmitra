import axios from 'axios';

// Base API URL
const API_URL = 'http://127.0.0.1:8000';

// Auth API client
const authApi = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Request interceptor to add auth token to requests
authApi.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Types
export interface AuthDto {
	email: string;
	password: string;
}

export interface CreateUserDto {
	email: string;
	password: string;
	password2: string;
	fullName: string;
	type: string;
}

export interface VerifyUserDto {
	email: string;
	otp: string;
}

export interface PasswordResetRequestDto {
	email: string;
}

export interface PasswordResetDto {
	email: string;
	otp: string;
	password: string;
}

export interface PasswordChangeDto {
	oldPassword: string;
	newPassword: string;
}

export interface CreateUserProfile {
	isForeignEmployed: boolean;
	country: string;
	familyContactNumber: string;
	info: {
		picture: number;
		phone: string;
	};
}

// Auth API functions
export const authService = {
	// Register a new user
	register: async (userData: CreateUserDto) => {
		try {
			const response = await authApi.post('/auth/register', userData);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Login a user
	login: async (credentials: AuthDto) => {
		try {
			const response = await authApi.post('/auth/login', credentials);
			if (response.data.access_token) {
				localStorage.setItem('token', response.data.access_token);
			}
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Verify user with OTP
	verifyAccount: async (verifyData: VerifyUserDto) => {
		try {
			const response = await authApi.post('/auth/verify', verifyData);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Resend verification OTP
	resendVerificationOtp: async (email: string) => {
		try {
			const response = await authApi.get(`/auth/resendVerificationOtp/${email}`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Request password reset
	forgotPassword: async (data: PasswordResetRequestDto) => {
		try {
			const response = await authApi.post('/auth/forgot-password', data);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Reset password with OTP
	resetPassword: async (data: PasswordResetDto) => {
		try {
			const response = await authApi.post('/auth/reset-password', data);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Change password (authenticated)
	changePassword: async (data: PasswordChangeDto) => {
		try {
			const response = await authApi.post('/auth/change-password', data);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Get current user profile
	getProfile: async () => {
		try {
			const response = await authApi.get('/profile');
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Create user profile
	createProfile: async (profileData: CreateUserProfile) => {
		try {
			const response = await authApi.post('/profile/user', profileData);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Check if user is authenticated
	isAuthenticated: () => {
		return !!localStorage.getItem('token');
	},

	// Logout user
	logout: () => {
		localStorage.clear();
		
	}
};

export default authService;
