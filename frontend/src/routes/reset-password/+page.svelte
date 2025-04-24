<!-- src/routes/reset-password/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authService } from '$lib/api/authApi';
	import { onMount } from 'svelte';

	let email = '';
	let otp = '';
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	let success = false;
	let showPassword = false;
	let showConfirmPassword = false;

	onMount(() => {
		// Get email from query params if present
		const urlParams = new URLSearchParams(window.location.search);
		const emailParam = urlParams.get('email');
		if (emailParam) {
			email = emailParam;
		}
	});

	function togglePassword(field: 'password' | 'confirmPassword') {
		if (field === 'password') {
			showPassword = !showPassword;
		} else {
			showConfirmPassword = !showConfirmPassword;
		}
	}

	async function handleResetPassword() {
		loading = true;
		error = '';
		success = false;

		// Password validation
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			loading = false;
			return;
		}

		if (password.length < 8) {
			error = 'Password must be at least 8 characters long';
			loading = false;
			return;
		}

		try {
			// Call the reset password API
			await authService.resetPassword({ email, otp, password });
			success = true;
		} catch (err) {
			console.error('Reset password error:', err);

			if (err.response?.status === 404) {
				error = 'Invalid OTP or email address';
			} else if (err.response?.status === 400) {
				error = 'Invalid or expired OTP';
			} else {
				error = err.message || 'An error occurred while processing your request';
			}
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Reset Password - Aapatmitra</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-box">
		<div class="auth-illustration">
			<img src="/images/reset-password-illustration.svg" alt="Reset Password Illustration" />
			<h3><span class="highlight">Aapat</span>mitra</h3>
			<p>Create a new secure password for your account.</p>
		</div>
		<div class="auth-form-container">
			<div class="auth-header">
				<h2>Reset Password</h2>
				<p>Enter the OTP sent to your email and create a new password.</p>
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
					Your password has been reset successfully!
					<a href="/login" class="btn btn-link">Login with your new password</a>
				</div>
			{:else}
				<form class="auth-form" on:submit|preventDefault={handleResetPassword}>
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
					<div class="form-group">
						<label for="otp">OTP Code</label>
						<input
							type="text"
							id="otp"
							bind:value={otp}
							placeholder="Enter the OTP code from your email"
							required
						/>
					</div>
					<div class="form-group">
						<label for="password">New Password</label>
						<div class="password-input">
							{#if showPassword}
								<input
									type="text"
									id="password"
									bind:value={password}
									placeholder="Enter your new password"
									required
								/>
							{:else}
								<input
									type="password"
									id="password"
									bind:value={password}
									placeholder="Enter your new password"
									required
								/>
							{/if}
							<i
								class={showPassword
									? 'fas fa-eye toggle-password'
									: 'fas fa-eye-slash toggle-password'}
								on:click={() => togglePassword('password')}
							></i>
						</div>
					</div>
					<div class="form-group">
						<label for="confirmPassword">Confirm Password</label>
						<div class="password-input">
							{#if showConfirmPassword}
								<input
									type="text"
									id="confirmPassword"
									bind:value={confirmPassword}
									placeholder="Confirm your new password"
									required
								/>
							{:else}
								<input
									type="password"
									id="confirmPassword"
									bind:value={confirmPassword}
									placeholder="Confirm your new password"
									required
								/>
							{/if}
							<i
								class={showConfirmPassword
									? 'fas fa-eye toggle-password'
									: 'fas fa-eye-slash toggle-password'}
								on:click={() => togglePassword('confirmPassword')}
							></i>
						</div>
					</div>
					<button type="submit" class="btn btn-primary btn-block" disabled={loading}>
						{#if loading}
							<i class="fas fa-spinner fa-spin"></i> Resetting Password...
						{:else}
							Reset Password
						{/if}
					</button>
					<p class="auth-redirect">
						<a href="/forgot-password">Resend OTP code</a> • <a href="/login">Back to Login</a>
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
		color: white;
	}

	/* .btn-primary:hover {
		background-color: var(--primary-dark-color);
		color: white;
	} */

	.btn-primary:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.btn-block {
		width: 100%;
	}

	.auth-redirect {
		text-align: center;
		font-size: 0.875rem;
		color: #64748b;
		margin-top: 1rem;
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
