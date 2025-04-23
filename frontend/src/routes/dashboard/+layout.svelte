<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { auth, isAuthenticated } from '$lib/stores/auth.store';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import '../../app.postcss';

	let userName = 'Julie';
	let showDropdown = false;

	// Toggle dropdown visibility
	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	// Function to handle logout
	function handleLogout() {
		if (browser) {
			auth.logout();
			goto('/logout');
		}
	}

	// Check authentication status once on mount
	onMount(() => {
		if (browser) {
			// Simple check - if there's a token, we're good to go
			// If the token exists and isAuthenticated is false, sync them
			const token = localStorage.getItem('token');
			const isUserAuthenticated = get(isAuthenticated);

			console.log('Auth check - Token exists:', !!token);
			console.log('Auth check - Is authenticated:', isUserAuthenticated);

			if (!token && !isUserAuthenticated) {
				console.log('No authentication found, redirecting to login');
				goto('/login');
			} else if (token && !isUserAuthenticated) {
				// Token exists but store is not synced - fix the store
				console.log('Token exists but store not synced, updating store');
				// Re-init the auth store from token
				localStorage.setItem(
					'auth',
					JSON.stringify({
						user: null,
						token: token,
						isAuthenticated: true
					})
				);
			}
		}
	});

	function handleImageError(e: Event) {
		const img = e.currentTarget as HTMLImageElement;
		img.style.display = 'none';
	}
</script>

<svelte:head>
	<!-- Directly include Tailwind's CDN for emergency styling -->
	<link
		href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Navigation Bar -->
	<nav class="bg-indigo-700 p-4 text-white shadow-lg">
		<div class="container mx-auto flex items-center justify-between">
			<!-- Logo and Brand -->
			<div class="flex items-center">
				<!-- Fix the logo path to use one of the existing images -->
				<img
					src="/images/logo-landscape.png"
					alt="Logo"
					class="mr-3 h-8 w-auto"
					on:error={handleImageError}
				/>
				<span class="text-xl font-bold">JulieCare</span>
			</div>

			<!-- Navigation Links -->
			<div class="mx-auto hidden space-x-6 md:flex">
				<a href="/dashboard" class="px-3 py-2 text-white hover:text-indigo-200">Dashboard</a>
				<a href="/dashboard/reports" class="px-3 py-2 text-white hover:text-indigo-200">Reports</a>
				<a href="/dashboard/resources" class="px-3 py-2 text-white hover:text-indigo-200"
					>Resources</a
				>
				<a href="/dashboard/settings" class="px-3 py-2 text-white hover:text-indigo-200">Settings</a
				>
			</div>

			<!-- User Menu -->
			<div class="flex items-center">
				<span class="mr-4">{userName}</span>
				<div class="relative">
					<button
						class="flex items-center rounded-full bg-indigo-600 p-1 hover:bg-indigo-500"
						on:click={toggleDropdown}
					>
						<span class="sr-only">User menu</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</button>
					{#if showDropdown}
						<div
							class="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
						>
							<a
								href="/dashboard/profile"
								class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a
							>
							<a
								href="/dashboard/settings"
								class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a
							>
							<button
								on:click={handleLogout}
								class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
							>
								Sign out
							</button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="container mx-auto flex-grow p-4">
		<slot />
	</main>

	<!-- Footer -->
	<footer class="bg-gray-800 p-4 text-center text-white">
		<p>© 2023 JulieCare. All rights reserved.</p>
	</footer>
</div>
