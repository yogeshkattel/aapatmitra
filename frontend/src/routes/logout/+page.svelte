<script lang="ts">
	import { browser } from '$app/environment';
	import { authService } from '$lib/api/authApi';
	import { auth, isAuthenticated } from '$lib/stores/auth.store';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	console.log('Logout page - Running in browser:', browser);

	// Handle client-side logout immediately
	onMount(() => {
		if (browser) {
			// Clean up all auth data
			console.log('Logout - Cleaning up auth data');

			// Clear auth service state
			authService.logout();

			// Clear auth store state
			auth.logout();

			// Explicitly remove both token storage methods to ensure nothing is left
			localStorage.removeItem('token');
			localStorage.removeItem('auth');

			// Force check the authentication status
			const isStillAuthenticated = get(isAuthenticated);
			console.log('Logout - Auth status after cleanup:', isStillAuthenticated);

			// Add a short delay to ensure state is updated, then redirect
			setTimeout(() => {
				// Add visual confirmation
				const form = document.getElementById('logoutForm');
				if (form && form instanceof HTMLFormElement) {
					const message = document.createElement('p');
					message.textContent = 'Logout successful. Redirecting...';
					message.className = 'mt-4 text-green-600';
					form.parentElement?.appendChild(message);
				}

				// Use direct location change for most reliable redirection
				window.location.href = '/';
			}, 300);
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="rounded-lg bg-white p-8 text-center shadow-md">
		<div class="flex justify-center">
			<div class="border-primary h-10 w-10 animate-spin rounded-full border-b-2"></div>
		</div>
		<p class="mt-4 text-gray-600">Logging you out...</p>

		<!-- Add a form that automatically submits to trigger server-side action -->
		<form method="POST" id="logoutForm">
			<input type="hidden" name="logout" value="true" />
		</form>
	</div>
</div>
