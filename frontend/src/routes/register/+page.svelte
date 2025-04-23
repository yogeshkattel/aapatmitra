<!-- src/routes/register/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	let showPassword = false;
	let showConfirmPassword = false;
	let termsAccepted = false;

	async function handleRegister() {
		loading = true;
		error = '';

		// Validate form
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			loading = false;
			return;
		}

		if (!termsAccepted) {
			error = 'Please accept the Terms of Service and Privacy Policy';
			loading = false;
			return;
		}

		try {
			await authStore.register({
				fullName: name,
				email,
				password,
				password2: confirmPassword,
				type: 'normal' // Default user type
			});
			// Redirect to verification page
			goto(`/verify?email=${encodeURIComponent(email)}`);
		} catch (err) {
			if (err.response?.status === 409) {
				error = 'Email already exists. Please use a different email address.';
			} else {
				error = err.response?.data?.message || 'An error occurred during registration';
			}
			loading = false;
		}
	}

	function togglePassword() {
		showPassword = !showPassword;
	}

	function toggleConfirmPassword() {
		showConfirmPassword = !showConfirmPassword;
	}
</script>

<svelte:head>
	<title>Register - Aapatmitra</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-box">
		<div class="auth-illustration">
			<img src="/images/register-illustration.svg" alt="Register Illustration" />
			<h3><span class="highlight">Aapat</span>mitra</h3>
			<p>Join our platform to access resources and emergency support for Nepali workers abroad.</p>
		</div>
		<div class="auth-form-container">
			<div class="auth-header">
				<h2>Create Account</h2>
				<p>Join Aapatmitra to access resources and support</p>
			</div>

			{#if error}
				<div class="error-message">
					<i class="fas fa-exclamation-circle"></i>
					{error}
				</div>
			{/if}

			<form class="auth-form" on:submit|preventDefault={handleRegister}>
				<div class="form-group">
					<label for="name">Full Name</label>
					<input
						type="text"
						id="name"
						bind:value={name}
						placeholder="Enter your full name"
						required
					/>
				</div>

				<div class="form-group">
					<label for="email">Email Address</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						placeholder="Enter your email"
						required
					/>
				</div>

				<div class="form-group">
					<label for="password">Password</label>
					<div class="password-input">
						<input
							type="password"
							id="password"
							bind:value={password}
							placeholder="Create a password"
							required
							minlength="8"
							class={showPassword ? 'show-password' : ''}
						/>
						<i
							class={showPassword
								? 'fas fa-eye toggle-password'
								: 'fas fa-eye-slash toggle-password'}
							on:click={togglePassword}
						></i>
					</div>
				</div>

				<div class="form-group">
					<label for="confirm-password">Confirm Password</label>
					<div class="password-input">
						<input
							type="password"
							id="confirm-password"
							bind:value={confirmPassword}
							placeholder="Confirm your password"
							required
							minlength="8"
							class={showConfirmPassword ? 'show-password' : ''}
						/>
						<i
							class={showConfirmPassword
								? 'fas fa-eye toggle-password'
								: 'fas fa-eye-slash toggle-password'}
							on:click={toggleConfirmPassword}
						></i>
					</div>
				</div>

				<div class="terms">
					<label class="remember-me">
						<input type="checkbox" bind:checked={termsAccepted} required />
						<span
							>I agree to the <a href="/terms">Terms of Service</a> and
							<a href="/privacy">Privacy Policy</a></span
						>
					</label>
				</div>

				<button type="submit" class="btn btn-primary btn-block" disabled={loading}>
					{#if loading}
						<i class="fas fa-spinner fa-spin"></i> Creating Account...
					{:else}
						Create Account
					{/if}
				</button>

				<div class="social-divider">
					<span>Or continue with</span>
				</div>

				<div class="social-buttons">
					<button type="button" class="btn btn-social btn-google">
						<i class="fab fa-google"></i>
						Google
					</button>
					<button type="button" class="btn btn-social btn-facebook">
						<i class="fab fa-facebook-f"></i>
						Facebook
					</button>
				</div>

				<p class="auth-redirect">
					Already have an account? <a href="/login">Sign In</a>
				</p>
			</form>
		</div>
	</div>
</div>

<style>
	/* Auth Pages Styles */
	.auth-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5rem 2rem 2rem 2rem;
		background: linear-gradient(135deg, var(--secondary-color) 0%, var(--accent-color) 100%);
	}

	.auth-box {
		display: flex;
		background: white;
		border-radius: 1rem;
		width: 100%;
		max-width: 1000px;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		margin-top: 1rem;
		overflow: hidden;
	}

	.auth-illustration {
		flex: 1;
		background: #f8fafc;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.auth-illustration::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 5px;
		background: var(--primary-color);
		opacity: 0.1;
	}

	.auth-illustration img {
		max-width: 80%;
		height: auto;
		margin-bottom: 1.5rem;
	}

	.auth-illustration h3 {
		color: var(--dark-color);
		font-size: 2.5rem;
		margin-bottom: 1rem;
		font-weight: 700;
	}

	.highlight {
		color: var(--primary-color);
	}

	.auth-illustration p {
		color: var(--grey-color);
		font-size: 1rem;
		max-width: 80%;
	}

	.auth-form-container {
		flex: 1;
		padding: 2rem;
		max-width: 500px;
	}

	.auth-header {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.auth-header h2 {
		font-size: 1.8rem;
		margin-bottom: 0.5rem;
	}

	.auth-header p {
		color: var(--grey-color);
		font-size: 1rem;
	}

	.error-message {
		background-color: rgba(239, 68, 68, 0.1);
		color: #ef4444;
		padding: 0.75rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.auth-form .form-group {
		margin-bottom: 1rem;
	}

	.auth-form label {
		display: block;
		margin-bottom: 0.25rem;
		font-weight: 500;
		color: var(--text-dark);
	}

	.auth-form input:not([type='checkbox']) {
		width: 100%;
		padding: 0.6rem 1rem;
		border: 2px solid #e2e8f0;
		border-radius: 0.5rem;
		font-size: 0.95rem;
		transition: all 0.3s ease;
	}

	.auth-form input:focus {
		border-color: var(--accent-color);
		box-shadow: 0 0 0 3px rgba(69, 123, 157, 0.1);
		outline: none;
	}

	.password-input {
		position: relative;
	}

	.toggle-password {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--grey-color);
		cursor: pointer;
		transition: color 0.3s ease;
	}

	.toggle-password:hover {
		color: var(--dark-color);
	}

	.terms {
		margin-bottom: 1.5rem;
	}

	.terms a {
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 500;
	}

	.terms a:hover {
		text-decoration: underline;
	}

	.remember-me {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-light);
		cursor: pointer;
	}

	.remember-me input[type='checkbox'] {
		width: 1rem;
		height: 1rem;
		cursor: pointer;
	}

	.btn-block {
		width: 100%;
		padding: 1rem;
		font-size: 1.1rem;
	}

	.social-divider {
		text-align: center;
		margin: 1rem 0;
		position: relative;
	}

	.social-divider::before,
	.social-divider::after {
		content: '';
		position: absolute;
		top: 50%;
		width: calc(50% - 4rem);
		height: 1px;
		background-color: #e2e8f0;
	}

	.social-divider::before {
		left: 0;
	}

	.social-divider::after {
		right: 0;
	}

	.social-divider span {
		background-color: white;
		padding: 0 1rem;
		color: var(--text-light);
		font-size: 0.9rem;
	}

	.social-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.btn-social {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background-color: white;
		border: 2px solid #e2e8f0;
		color: var(--text-dark);
		padding: 0.5rem;
		font-size: 1rem;
		transition: all 0.3s ease;
	}

	.btn-social:hover {
		background-color: #f8fafc;
		transform: translateY(-2px);
	}

	.btn-google i {
		color: #ea4335;
	}

	.btn-facebook i {
		color: #1877f2;
	}

	.auth-redirect {
		text-align: center;
		margin: 0;
		color: var(--text-light);
	}

	.auth-redirect a {
		color: var(--primary-color);
		font-weight: 500;
		text-decoration: none;
	}

	.auth-redirect a:hover {
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.auth-container {
			padding: 1rem;
		}

		.auth-box {
			flex-direction: column;
		}

		.auth-illustration {
			padding: 2rem 1rem;
		}

		.auth-form-container {
			padding: 1.5rem;
			max-width: none;
		}
	}

	@media (max-width: 480px) {
		.auth-container {
			padding: 0;
		}

		.auth-box {
			border-radius: 0;
		}

		.auth-illustration {
			display: none;
		}

		.auth-form-container {
			padding: 1.5rem;
		}
	}

	.show-password {
		-webkit-text-security: none;
		text-security: none;
	}
</style>
