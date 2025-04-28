<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import FloatingNotification from '$lib/components/FloatingNotification.svelte';
	import GlobalNotification from '$lib/components/GlobalNotification.svelte';
	import setupMobileMenu from '$lib/js/menu.js';
	import { auth, isAuthenticated } from '$lib/stores/auth.store';
	import {
		checkAndReconnectSocket,
		disconnectSocket,
		initializeSocket
	} from '$lib/stores/socketStore';
	import { onDestroy, onMount } from 'svelte';
	import '../app.postcss';

	// Check if the current route is in the dashboard section
	$: isDashboardRoute = $page.url.pathname.startsWith('/dashboard');

	// Keep track of the interval ID
	let socketCheckInterval: number;

	onMount(() => {
		// Don't set up mobile menu if we're in dashboard
		if (!isDashboardRoute) {
			setupMobileMenu();

			// Mobile menu toggle
			const openMenu = document.getElementById('openMenu');
			const closeMenu = document.getElementById('closeMenu');
			const navLinks = document.getElementById('navLinks');

			if (openMenu && closeMenu && navLinks) {
				openMenu.addEventListener('click', () => {
					navLinks.classList.add('show');
				});

				closeMenu.addEventListener('click', () => {
					navLinks.classList.remove('show');
				});
			}
		}

		// If the user is logged in (server-side session)
		if ($page.data.session && $page.data.user) {
			// Update client-side auth store
			auth.login($page.data.user, $page.data.session);
		}

		// Initialize socket on mount if user is authenticated
		if (browser) {
			const token = localStorage.getItem('token');
			if (token) {
				initializeSocket();
			}

			// Listen for authentication changes
			window.addEventListener('storage', handleStorageChange);

			// Check socket connection every 30 seconds
			socketCheckInterval = window.setInterval(() => {
				checkAndReconnectSocket();
			}, 30000);
		}
	});

	// Clean up on destroy
	onDestroy(() => {
		if (browser) {
			window.removeEventListener('storage', handleStorageChange);
			disconnectSocket();

			// Clear the interval
			if (socketCheckInterval) {
				window.clearInterval(socketCheckInterval);
			}
		}
	});

	// Handle storage changes (for token)
	function handleStorageChange(event: StorageEvent): void {
		if (event.key === 'token') {
			if (event.newValue) {
				// User logged in - initialize socket
				initializeSocket();
			} else {
				// User logged out - disconnect socket
				disconnectSocket();
			}
		}
	}
</script>

<!-- Always include head content but conditionally include specific resources -->
<svelte:head>
	{#if !isDashboardRoute}
		<link rel="stylesheet" href="/css/styles.css" />
		<link rel="stylesheet" href="/css/resource.css" />
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
		/>
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
		<link
			href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
			rel="stylesheet"
		/>
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/flag-icons/6.6.6/css/flag-icons.min.css"
		/>
		<script src="/js/main.js" defer></script>
	{/if}
</svelte:head>

{#if !isDashboardRoute}
	<!-- Main site layout -->
	<header>
		<nav class="navbar">
			<div class="container">
				<div class="logo">
					<h1><span class="highlight">Aapat</span>mitra</h1>
				</div>
				<div class="nav-links" id="navLinks">
					<i class="fas fa-times" id="closeMenu"></i>
					<ul>
						<li><a href="/">Home</a></li>
						<li><a href="/#services">Services</a></li>
						<li><a href="/#about">About</a></li>
						<li><a href="/#impact">Impact</a></li>
						<li><a href="/#support">Support</a></li>
						<li><a href="/#contact">Contact</a></li>
						<li><a href="/resources">Resources</a></li>
						<div class="nav-auth">
							{#if ($page.data.session && $page.data.session.token) || $isAuthenticated}
								<a href="/dashboard" class="btn btn-login">Dashboard</a>
								<form action="/logout" method="POST" style="display: inline;">
									<button type="submit" class="btn btn-signup">Logout</button>
								</form>
							{:else}
								<a href="/login" class="btn btn-login">Login</a>
								<a href="/register" class="btn btn-signup">Sign Up</a>
							{/if}
						</div>
					</ul>
				</div>
				<i class="fas fa-bars" id="openMenu"></i>
			</div>
		</nav>
	</header>

	<main>
		<slot />
	</main>

	<footer>
		<div class="container">
			<div class="footer-content">
				<div class="footer-section about">
					<div class="logo">
						<h2><span class="highlight">Aapat</span>mitra</h2>
					</div>
					<p>
						Supporting Nepali migrant workers through emergency response and proactive protection.
					</p>
					<div class="contact">
						<p><i class="fas fa-phone"></i> +977-9807930965</p>
						<p><i class="fas fa-envelope"></i> info@aapatmitra.org</p>
					</div>
					<div class="socials">
						<a href="#"><i class="fab fa-facebook-f"></i></a>
						<a href="#"><i class="fab fa-twitter"></i></a>
						<a href="#"><i class="fab fa-instagram"></i></a>
						<a href="#"><i class="fab fa-linkedin-in"></i></a>
					</div>
				</div>
				<div class="footer-section links">
					<h3>Quick Links</h3>
					<ul>
						<li><a href="/">Home</a></li>
						<li><a href="/#services">Our Services</a></li>
						<li><a href="/#about">About Us</a></li>
						<li><a href="/resources">Resources</a></li>
						<li><a href="/report">Report an Emergency</a></li>
						<li><a href="/#contact">Contact Us</a></li>
					</ul>
				</div>
				<div class="footer-section resources">
					<h3>Helpful Resources</h3>
					<ul>
						<li><a href="/resources">Emergency Contacts</a></li>
						<li><a href="/resources">Legal Rights Guide</a></li>
						<li><a href="/resources">Safety Checklists</a></li>
						<li><a href="/resources">Embassy Information</a></li>
						<li><a href="/resources">Healthcare Access</a></li>
					</ul>
				</div>
				<div class="footer-section subscribe">
					<h3>Stay Updated</h3>
					<p>Subscribe to our newsletter for important updates and resources.</p>
					<form action="#" method="post">
						<input type="email" placeholder="Enter your email" required />
						<button type="submit" class="btn btn-primary">Subscribe</button>
					</form>
					<div class="app-download">
						<p>Download our mobile app:</p>
						<div class="download-buttons">
							<a href="#"><i class="fab fa-google-play"></i> Google Play</a>
							<a href="#"><i class="fab fa-apple"></i> App Store</a>
						</div>
					</div>
				</div>
			</div>
			<div class="footer-bottom">
				<p>&copy; 2023 Aapatmitra. All rights reserved.</p>
				<div class="footer-bottom-links">
					<a href="#">Privacy Policy</a>
					<a href="#">Terms of Service</a>
					<a href="#">Cookies Policy</a>
				</div>
			</div>
		</div>
	</footer>
{:else}
	<!-- Just render the slot without any wrapper for dashboard routes -->
	<slot />
{/if}

<!-- Global notification component - make sure it's outside all other elements and has high z-index -->
<div class="global-notification-container">
	<FloatingNotification />
</div>

<style>
	/* Add a separate style block or add to your global styles */
	.global-notification-container {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 9999; /* Make sure this is higher than any other element */
		pointer-events: none; /* This allows clicks to pass through to elements below */
	}

	/* The notification itself will have pointer-events: auto to be clickable */
	.global-notification-container :global(.animate-slideIn) {
		pointer-events: auto;
	}
</style>
