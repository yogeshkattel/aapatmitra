<!-- src/routes/forgot-password/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { authService } from '$lib/api/authApi';
	import { onMount } from 'svelte';

	let email = '';
	let loading = false;
	let error = '';
	let success = false;

	async function handleForgotPassword() {
		loading = true;
		error = '';
		success = false;

		try {
			// Call the forgot password API
			await authService.forgotPassword({ email });
			success = true;
		} catch (err) {
			console.error('Forgot password error:', err);

			if (err.response?.status === 404) {
				error = 'No account found with this email address';
			} else {
				error = err.message || 'An error occurred while processing your request';
			}
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Forgot Password - Aapatmitra</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-box">
		<div class="auth-illustration">
			<img src="/images/forgot-password-illustration.svg" alt="Forgot Password Illustration" />
			<h3><span class="highlight">Aapat</span>mitra</h3>
			<p>We'll help you reset your password and get back to your account safely.</p>
		</div>
		<div class="auth-form-container">
			<div class="auth-header">
				<h2>Forgot Password</h2>
				<p>Enter your email address and we'll send you a code to reset your password.</p>
			</div>

			{#if error}
				<div class="error-message">
					<i class="fas fa-exclamation-circle"></i>
					{error}
				</div>
			{/if}

			{#if success}
				<div class="success-message">
					<i class="fas fa-check-circle"></i>
					Password reset instructions have been sent to your email. Please check your inbox for the OTP
					code.
					<a href="/reset-password?email={encodeURIComponent(email)}" class="btn btn-link"
						>Reset your password</a
					>
				</div>
			{:else}
				<form class="auth-form" on:submit|preventDefault={handleForgotPassword}>
					<div class="form-group">
						<label for="email">Email</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							placeholder="Enter your email"
							required
						/>
					</div>
					<button type="submit" class="btn btn-primary btn-block" disabled={loading}>
						{#if loading}
							<i class="fas fa-spinner fa-spin"></i> Sending...
						{:else}
							Send Reset Instructions
						{/if}
					</button>
					<p class="auth-redirect">
						Remember your password? <a href="/login">Login</a>
					</p>
				</form>
			{/if}
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

	.success-message {
		background-color: rgba(34, 197, 94, 0.1);
		color: #22c55e;
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		text-align: center;
	}

	.success-message .btn-link {
		margin-top: 0.5rem;
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 500;
	}

	.auth-form .form-group {
		margin-bottom: 1.5rem;
	}

	.auth-form label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.auth-form input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: all 0.3s ease;
	}

	.auth-form input:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
	}

	.password-input {
		position: relative;
	}

	.toggle-password {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		cursor: pointer;
		color: #94a3b8;
		transition: color 0.3s ease;
	}

	.toggle-password:hover {
		color: var(--primary-color);
	}

	.form-options {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.remember-me {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.remember-me input {
		width: auto;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 500;
		transition: all 0.3s ease;
		cursor: pointer;
		gap: 0.5rem;
		border: none;
	}

	.btn-primary {
		background-color: var(--primary-color);
		color: white !important;
	}


	.btn-primary:hover {
		/* opacity: 100; */
		cursor: not-allowed;
	}

  .btn-block {
		width: 100%;
		padding: 1rem;
		font-size: 1.1rem;
	}

	.social-divider {
		display: flex;
		align-items: center;
		margin: 1.5rem 0;
		color: #94a3b8;
	}

	.social-divider::before,
	.social-divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: #e2e8f0;
	}

	.social-divider span {
		padding: 0 1rem;
		font-size: 0.875rem;
	}

	.social-buttons {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.btn-social {
		flex: 1;
		background: #f8fafc;
		color: #64748b;
		border: 1px solid #e2e8f0;
	}

	.btn-social:hover {
		background: #f1f5f9;
	}

	.btn-google {
		color: #ea4335;
	}

	.btn-facebook {
		color: #1877f2;
	}

	.auth-redirect {
		text-align: center;
		font-size: 0.875rem;
		color: #64748b;
	}

	.auth-redirect a {
		color: var(--primary-color);
		font-weight: 500;
		text-decoration: none;
	}

	/* Make responsive */
	@media (max-width: 768px) {
		.auth-box {
			flex-direction: column;
			max-width: 500px;
		}

		.auth-illustration {
			padding: 2rem 1rem;
		}

		.auth-form-container {
			padding: 1.5rem;
		}

		.auth-header h2 {
			font-size: 1.5rem;
		}
	}
</style>
