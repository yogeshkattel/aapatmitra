<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let formData = {
		name: '',
		country: '',
		issue: '',
		location: '',
		emergencyLevel: '',
		contactType: '',
		violenceType: '',
		contactValue: '',
		image: 0
	};

	let loading = false;
	let error = null;
	let success = false;

	const emergencyLevels = ['low', 'medium', 'high', 'critical'];
	const contactTypes = ['email', 'whatsapp', 'phone', 'viber'];
	const violenceTypes = ['domestic'];

	async function handleSubmit() {
		if (loading) return;
		loading = true;
		error = null;

		try {
			const token = browser ? localStorage.getItem('token') : null;
			if (!token) throw new Error('No authentication token found');

			const API_BASE_URL = 'http://127.0.0.1:8000';
			const response = await fetch(`${API_BASE_URL}/reports`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				},
				body: JSON.stringify(formData),
				mode: 'cors',
				cache: 'no-store'
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			if (result.success) {
				success = true;
				setTimeout(() => goto('/reports'), 2000);
			} else {
				error = result.message || 'Failed to create report';
			}
		} catch (err) {
			console.error('Error creating report:', err);
			error = 'Failed to create report. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-6">
	<h1 class="mb-4 text-2xl font-bold text-gray-800">Create Report</h1>

	{#if success}
		<div class="rounded-md bg-green-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-green-800">Success</h3>
					<div class="mt-2 text-sm text-green-700">
						<p>Your report has been created successfully! Redirecting to reports...</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if error}
		<div class="mb-6 rounded-md bg-red-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error</h3>
					<div class="mt-2 text-sm text-red-700">
						<p>{error}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div>
			<label class="block text-sm font-medium text-gray-700">Name</label>
			<input
				type="text"
				bind:value={formData.name}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700">Country</label>
			<input
				type="text"
				bind:value={formData.country}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700">Issue</label>
			<textarea
				bind:value={formData.issue}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			></textarea>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700">Location</label>
			<input
				type="text"
				bind:value={formData.location}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700">Emergency Level</label>
			<select
				bind:value={formData.emergencyLevel}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			>
				{#each emergencyLevels as level}
					<option value={level}>{level}</option>
				{/each}
			</select>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700">Contact Type</label>
			<select
				bind:value={formData.contactType}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			>
				{#each contactTypes as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700">Violence Type</label>
			<select
				bind:value={formData.violenceType}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			>
				{#each violenceTypes as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700">Contact Value</label>
			<input
				type="text"
				bind:value={formData.contactValue}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>

		<div>
			<button
				type="submit"
				class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			>
				{#if loading}
					<span>Loading...</span>
				{:else}
					<span>Create Report</span>
				{/if}
			</button>
		</div>
	</form>
</div>
