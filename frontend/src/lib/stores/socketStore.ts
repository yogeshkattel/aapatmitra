import { browser } from '$app/environment';
import { io, Socket } from 'socket.io-client';
import { derived, get, writable, type Writable } from 'svelte/store';

// API base URL
const API_BASE_URL = 'http://127.0.0.1:8000';

// Define message interface
interface Message {
	id?: string;
	content?: string;
	sender?: {
		userId?: string;
		fullName?: string;
		profile?: {
			picture?: {
				image?: string;
			};
		};
	};
	report?: string | number;
	createdAt?: string;
	senderId?: string;
}

// Create writable stores with TypeScript types
export const socketConnection: Writable<Socket | null> = writable(null);
export const newMessageStore: Writable<Message | null> = writable(null);
export const showNotificationStore: Writable<boolean> = writable(false);

// Initialize socket connection
export function initializeSocket(): void {
	if (!browser) {
		console.log('Not in browser environment');
		return;
	}

	const token = localStorage.getItem('token');
	if (!token) {
		console.log('No token found for socket connection');
		return;
	}

	console.log('Initializing socket connection');

	try {
		// Configure Socket.IO with proper CORS settings
		const socket: Socket = io(API_BASE_URL, {
			auth: {
				token
			},
			withCredentials: true,
			transports: ['websocket', 'polling'],
			path: '/socket.io',
			autoConnect: true,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 2000
		});

		socket.on('connect', (): void => {
			console.log('Socket connected successfully');
		});

		socket.on('disconnect', (): void => {
			console.log('Socket disconnected');
		});

		socket.on('received-message', handleIncomingMessage);

		socket.on('connect_error', (err: Error): void => {
			console.error('Socket connection error:', err);
		});

		socketConnection.set(socket);
	} catch (err) {
		console.error('Error initializing socket:', err);
	}
}

// Handle incoming message notification
function handleIncomingMessage(message: Message): void {
	console.log('Received message:', message);

	// Add alert for debugging
	if (browser) {
		console.log('Message received and setting state');
	}

	newMessageStore.set(message);
	showNotificationStore.set(true);

	// Log the current state
	console.log('Notification should be showing:', get(showNotificationStore));
	console.log('Message data:', get(newMessageStore));

	// Keep notification open longer to make sure user sees it
	setTimeout(() => {
		showNotificationStore.update((current: boolean): boolean => {
			if (current) return false;
			return current;
		});
	}, 15000); // Increased to 15 seconds for better testing
}

// Disconnect socket
export function disconnectSocket(): void {
	socketConnection.update((socket: Socket | null): Socket | null => {
		if (socket) {
			socket.disconnect();
		}
		return null;
	});
}

// Add a function to check for token changes and reconnect if needed
export function checkAndReconnectSocket(): void {
	if (!browser) return;

	const token = localStorage.getItem('token');
	const currentSocket = get(socketConnection);

	if (token && !currentSocket) {
		// We have a token but no socket connection
		initializeSocket();
	} else if (!token && currentSocket) {
		// We don't have a token but have a socket connection
		disconnectSocket();
	}
}

// Add a debugging helper function
export function testNotification(): void {
	const testMessage: Message = {
		id: 'test-message',
		content: 'This is a test notification message',
		sender: {
			userId: 'test-user',
			fullName: 'Test User',
			profile: {
				picture: {
					image: null
				}
			}
		},
		report: '123',
		createdAt: new Date().toISOString(),
		senderId: 'test-user'
	};

	handleIncomingMessage(testMessage);
}
