<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import authService from '$lib/api/authApi';
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';

	let email = '';
	let otp = '';
	let loading = false;
	let error = '';
	let successMessage = '';
	let resendDisabled = false;
	let resendCountdown = 0;

	onMount(() => {
		// Get email from URL query parameter
		const urlParams = $page.url.searchParams;
		email = urlParams.get('email') || '';

		if (!email) {
			goto('/login');
		}
	});

	async function handleVerify() {
		if (!otp) {
			error = 'Please enter the verification code';
			return;
		}

		loading = true;
		error = '';
		successMessage = '';

		try {
			await authStore.verifyAccount({ email, otp });
			successMessage = 'Your account has been verified successfully!';

			// Redirect to login after successful verification
			setTimeout(() => {
				goto('/login');
			}, 2000);
		} catch (err) {
			error = err.response?.data?.message || 'Invalid or expired verification code';
		} finally {
			loading = false;
		}
	}

	async function handleResendOtp() {
		loading = true;
		error = '';
		successMessage = '';

		try {
			await authService.resendVerificationOtp(email);
			successMessage = 'A new verification code has been sent to your email';

			// Disable resend button for 60 seconds
			resendDisabled = true;
			resendCountdown = 60;

			const countdownInterval = setInterval(() => {
				resendCountdown--;
				if (resendCountdown <= 0) {
					clearInterval(countdownInterval);
					resendDisabled = false;
				}
			}, 1000);
		} catch (err) {
			error = err.response?.data?.message || 'Failed to resend verification code';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Verify Account - Aapatmitra</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-box">
		<div class="auth-illustration">
			<img src="/images/verification-illustration.svg" alt="Verification Illustration" />
			<h3><span class="highlight">Aapat</span>mitra</h3>
			<p>Just one more step to complete your account setup!</p>
		</div>
		<div class="auth-form-container">
			<div class="auth-header">
				<h2>Verify Your Account</h2>
				<p>We've sent a verification code to your email</p>
			</div>

			{#if error}
				<div class="error-message">
					<i class="fas fa-exclamation-circle"></i>
					{error}
				</div>
			{/if}

			{#if successMessage}
				<div class="success-message">
					<i class="fas fa-check-circle"></i>
					{successMessage}
				</div>
			{/if}

			<div class="email-preview">
				<i class="fas fa-envelope"></i>
				<span>{email}</span>
			</div>

			<form class="auth-form" on:submit|preventDefault={handleVerify}>
				<div class="form-group">
					<label for="otp">Verification Code</label>
					<input
						type="text"
						id="otp"
						bind:value={otp}
						placeholder="Enter 6-digit code"
						maxlength="6"
						required
					/>
					<small>Enter the 6-digit code sent to your email</small>
				</div>

				<button type="submit" class="btn btn-primary btn-block" disabled={loading}>
					{#if loading}
						<i class="fas fa-spinner fa-spin"></i> Verifying...
					{:else}
						Verify Account
					{/if}
				</button>
			</form>

			<div class="resend-link">
				Didn't receive a code?
				<button on:click={handleResendOtp} disabled={resendDisabled} class="btn-link">
					{#if resendDisabled}
						Resend in {resendCountdown}s
					{:else}
						Resend code
					{/if}
				</button>
			</div>

			<div class="auth-redirect">
				<a href="/login">Back to Login</a>
			</div>
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
		padding: 0.75rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.email-preview {
		background-color: #f8fafc;
		padding: 0.75rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 500;
	}

	.email-preview i {
		color: var(--primary-color);
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

	.auth-form input {
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

	.auth-form small {
		display: block;
		margin-top: 0.5rem;
		color: var(--text-light);
		font-size: 0.875rem;
	}

	.btn-block {
		width: 100%;
		padding: 1rem;
		font-size: 1.1rem;
	}

	.resend-link {
		text-align: center;
		margin: 1.5rem 0;
		color: var(--text-light);
	}

	.btn-link {
		background: none;
		border: none;
		color: var(--primary-color);
		font-weight: 500;
		cursor: pointer;
		padding: 0;
		text-decoration: underline;
	}

	.btn-link:disabled {
		color: var(--text-light);
		cursor: not-allowed;
		text-decoration: none;
	}

	.auth-redirect {
		text-align: center;
		margin: 1.5rem 0 0;
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
</style>
