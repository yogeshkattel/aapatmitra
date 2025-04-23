<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let reports = [];
	let loading = false;
	let error = '';

	let newReport = {
		name: '',
		country: '',
		issue: '',
		location: '',
		emergencyLevel: 'low',
		contactType: 'phone',
		violenceType: '',
		contactValue: '',
		image: null
	};

	onMount(async () => {
		await fetchReports();
	});

	async function fetchReports() {
		try {
			loading = true;
			const response = await fetch('http://127.0.0.1:8000/user/reports', {
				headers: {
					Authorization: `Bearer ${document.cookie.split('=')[1]}`
				}
			});

			if (!response.ok) {
				throw new Error('Failed to fetch reports');
			}

			const data = await response.json();
			reports = data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred while fetching reports';
		} finally {
			loading = false;
		}
	}

	async function handleSubmit() {
		try {
			loading = true;
			error = '';

			const response = await fetch('http://127.0.0.1:8000/user/reports', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${document.cookie.split('=')[1]}`
				},
				body: JSON.stringify(newReport)
			});

			if (!response.ok) {
				throw new Error('Failed to create report');
			}

			await fetchReports();
			newReport = {
				name: '',
				country: '',
				issue: '',
				location: '',
				emergencyLevel: 'low',
				contactType: 'phone',
				violenceType: '',
				contactValue: '',
				image: null
			};
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred while creating report';
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-100 py-6">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Create New Report</h2>

			{#if error}
				<div class="mb-4 text-sm text-red-500">{error}</div>
			{/if}

			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div>
						<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
						<input
							type="text"
							id="name"
							bind:value={newReport.name}
							required
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label for="country" class="block text-sm font-medium text-gray-700">Country</label>
						<input
							type="text"
							id="country"
							bind:value={newReport.country}
							required
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label for="issue" class="block text-sm font-medium text-gray-700">Issue</label>
						<textarea
							id="issue"
							bind:value={newReport.issue}
							required
							rows="3"
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						></textarea>
					</div>

					<div>
						<label for="location" class="block text-sm font-medium text-gray-700">Location</label>
						<input
							type="text"
							id="location"
							bind:value={newReport.location}
							required
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label for="emergencyLevel" class="block text-sm font-medium text-gray-700"
							>Emergency Level</label
						>
						<select
							id="emergencyLevel"
							bind:value={newReport.emergencyLevel}
							required
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
						</select>
					</div>

					<div>
						<label for="contactType" class="block text-sm font-medium text-gray-700"
							>Contact Type</label
						>
						<select
							id="contactType"
							bind:value={newReport.contactType}
							required
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						>
							<option value="phone">Phone</option>
							<option value="email">Email</option>
						</select>
					</div>

					<div>
						<label for="violenceType" class="block text-sm font-medium text-gray-700"
							>Violence Type</label
						>
						<input
							type="text"
							id="violenceType"
							bind:value={newReport.violenceType}
							required
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label for="contactValue" class="block text-sm font-medium text-gray-700"
							>Contact Value</label
						>
						<input
							type="text"
							id="contactValue"
							bind:value={newReport.contactValue}
							required
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						{#if loading}
							<svg
								class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						{/if}
						Create Report
					</button>
				</div>
			</form>
		</div>

		<div class="mt-8">
			<h3 class="mb-4 text-lg font-medium text-gray-900">Your Reports</h3>
			<div class="overflow-hidden bg-white shadow sm:rounded-md">
				<ul class="divide-y divide-gray-200">
					{#each reports as report}
						<li class="px-4 py-4 sm:px-6">
							<div class="flex items-center justify-between">
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-medium text-indigo-600">{report.name}</p>
									<p class="mt-1 text-sm text-gray-500">{report.issue}</p>
								</div>
								<div class="ml-4 flex-shrink-0">
									<span
										class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
									>
										{report.emergencyLevel}
									</span>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>
