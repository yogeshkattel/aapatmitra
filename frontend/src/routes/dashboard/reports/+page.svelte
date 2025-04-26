<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let reports = [];
	let recentReports = [];
	let loading = true;
	let recentLoading = true;
	let error = null;
	let recentError = null;
	let currentPage = 1;
	let totalPages = 1;
	let selectedReport = null;
	let showModal = false;

	const filters = {
		emergencyLevel: '',
		violenceType: '',
		createdAt: ''
	};

	const emergencyLevels = ['low', 'medium', 'high', 'critical'];
	const violenceTypes = ['domestic'];

	// Get appropriate color for emergency level
	function getEmergencyLevelColor(level) {
		switch (level) {
			case 'low':
				return 'bg-green-100 text-green-800';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'high':
				return 'bg-orange-100 text-orange-800';
			case 'critical':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	async function fetchRecentReports() {
		recentLoading = true;
		recentError = null;

		try {
			const token = browser ? localStorage.getItem('token') : null;
			if (!token) throw new Error('No authentication token found');

			const API_BASE_URL = 'http://127.0.0.1:8000';
			const query = new URLSearchParams({
				page: '1',
				limit: '3',
				sort: 'createdAt',
				order: 'DESC'
			});

			const response = await fetch(`${API_BASE_URL}/reports?${query}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				},
				mode: 'cors',
				cache: 'no-store'
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			if (result.success) {
				recentReports = result.data;
			} else {
				recentError = result.message || 'Failed to load recent reports';
			}
		} catch (err) {
			console.error('Error fetching recent reports:', err);
			recentError = 'Failed to fetch recent reports. Please try again.';
		} finally {
			recentLoading = false;
		}
	}

	async function fetchReports() {
		loading = true;
		error = null;

		try {
			const token = browser ? localStorage.getItem('token') : null;
			if (!token) throw new Error('No authentication token found');

			const API_BASE_URL = 'http://127.0.0.1:8000';
			const query = new URLSearchParams({
				page: currentPage.toString(),
				limit: '10',
				sort: 'createdAt',
				order: 'DESC'
			});

			// Conditionally add non-empty filters
			const activeFilters: Record<string, string> = {};
			if (filters.emergencyLevel) activeFilters.emergencyLevel = filters.emergencyLevel;
			if (filters.violenceType) activeFilters.violenceType = filters.violenceType;
			if (filters.createdAt) activeFilters.createdAt = filters.createdAt;

			if (Object.keys(activeFilters).length > 0) {
				query.append('filters', JSON.stringify(activeFilters));
			}

			const response = await fetch(`${API_BASE_URL}/reports?${query}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				},
				mode: 'cors',
				cache: 'no-store'
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			if (result.success) {
				reports = result.data;
				totalPages = Math.ceil(result.total / 10);
			} else {
				error = result.message || 'Failed to load reports';
			}
		} catch (err) {
			console.error('Error fetching reports:', err);
			error = 'Failed to fetch reports. Please try again.';
		} finally {
			loading = false;
		}
	}

	function applyFilters() {
		currentPage = 1;
		fetchReports();
	}

	function goToPage(page) {
		if (page < 1 || page > totalPages) return;
		currentPage = page;
		fetchReports();
	}

	function viewReport(report) {
		selectedReport = report;
		showModal = true;
	}

	function viewReportDetails(report) {
		goto(`/dashboard/reports/${report.id}`);
	}

	function closeModal() {
		showModal = false;
		selectedReport = null;
	}

	onMount(() => {
		if (browser) {
			fetchRecentReports();
			fetchReports();
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6">
	<div class="container mx-auto px-4">
		<h1 class="mb-6 text-3xl font-bold text-indigo-800">Reports Dashboard</h1>

		<!-- Recent Reports Section -->
		<div class="mb-8">
			<h2 class="mb-4 text-2xl font-bold text-indigo-700">Recent Reports</h2>
			{#if recentLoading}
				<div class="flex items-center justify-center p-6">
					<div
						class="border-b-3 border-t-3 h-10 w-10 animate-spin rounded-full border-indigo-600"
					></div>
					<span class="ml-3 text-indigo-800">Loading recent reports...</span>
				</div>
			{:else if recentError}
				<div class="mb-4 rounded-md bg-red-50 p-3 shadow-md">
					<p class="text-sm text-red-700">{recentError}</p>
				</div>
			{:else if recentReports.length === 0}
				<div class="rounded-xl bg-white p-6 shadow-md">
					<p class="text-gray-700">No recent reports found.</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each recentReports as report}
						<div
							class="overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
						>
							<div class="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
								<h3 class="truncate text-lg font-semibold text-white">{report.name}</h3>
								<p class="mt-1 text-sm text-white opacity-90">{report.country}</p>
							</div>
							<div class="p-4">
								<div class="mb-2 flex items-center">
									<span
										class="mr-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold {getEmergencyLevelColor(
											report.emergencyLevel
										)}"
									>
										{report.emergencyLevel}
									</span>
									<span class="text-sm text-gray-600">{report.violenceType}</span>
								</div>
								<p class="line-clamp-2 text-sm text-gray-700">{report.issue}</p>
								<div class="mt-3 flex items-center justify-between">
									<span class="text-xs text-gray-500"
										>{new Date(report.createdAt).toLocaleDateString()}</span
									>
									<div>
										<button
											on:click={() => viewReport(report)}
											class="mr-2 rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
										>
											View
										</button>
										<button
											on:click={() => viewReportDetails(report)}
											class="rounded-md bg-purple-600 px-3 py-1 text-xs font-medium text-white shadow-sm transition-all hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
										>
											Details
										</button>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Filter Section -->
		<div class="mb-8 rounded-xl bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">Filters</h2>
			<div class="flex flex-wrap items-center gap-4">
				<div class="flex-1">
					<label class="block text-sm font-medium text-gray-700">Emergency Level</label>
					<select
						bind:value={filters.emergencyLevel}
						class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 shadow-sm transition-all focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						on:change={applyFilters}
					>
						<option value="">All</option>
						{#each emergencyLevels as level}
							<option value={level}>{level}</option>
						{/each}
					</select>
				</div>

				<div class="flex-1">
					<label class="block text-sm font-medium text-gray-700">Violence Type</label>
					<select
						bind:value={filters.violenceType}
						class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 shadow-sm transition-all focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						on:change={applyFilters}
					>
						<option value="">All</option>
						{#each violenceTypes as type}
							<option value={type}>{type}</option>
						{/each}
					</select>
				</div>

				<div class="flex-1">
					<label class="block text-sm font-medium text-gray-700">Created At</label>
					<input
						type="date"
						bind:value={filters.createdAt}
						class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 shadow-sm transition-all focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						on:change={applyFilters}
					/>
				</div>
			</div>
		</div>

		<!-- All Reports Section -->
		<h2 class="mb-4 text-2xl font-bold text-indigo-700">All Reports</h2>

		<!-- Table View -->
		{#if loading}
			<div class="flex items-center justify-center p-8">
				<div
					class="border-b-3 border-t-3 h-14 w-14 animate-spin rounded-full border-indigo-600"
				></div>
				<span class="ml-4 text-lg text-indigo-800">Loading reports...</span>
			</div>
		{:else if error}
			<div class="mb-6 rounded-md bg-red-50 p-4 shadow-md">
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
		{:else}
			<div class="overflow-hidden rounded-xl bg-white shadow-xl">
				<table class="min-w-full">
					<thead class="bg-gradient-to-r from-indigo-600 to-purple-600">
						<tr>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white"
							>
								Name
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white"
							>
								Country
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white"
							>
								Issue
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white"
							>
								Location
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white"
							>
								Emergency Level
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white"
							>
								Violence Type
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white"
							>
								Contact
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white"
							>
								Created At
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white"
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each reports as report, i}
							<tr class="transition-colors hover:bg-indigo-50">
								<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
									>{report.name}</td
								>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{report.country}</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{report.issue}</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{report.location}</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm">
									<span
										class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getEmergencyLevelColor(
											report.emergencyLevel
										)}"
									>
										{report.emergencyLevel}
									</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600"
									>{report.violenceType}</td
								>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
									{report.contactType} - {report.contactValue}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
									{new Date(report.createdAt).toLocaleDateString()}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm">
									<button
										on:click={() => viewReport(report)}
										class="mr-2 rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
									>
										View
									</button>
									<button
										on:click={() => viewReportDetails(report)}
										class="rounded-md bg-purple-600 px-3 py-1 text-sm font-medium text-white shadow-sm transition-all hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
									>
										Details
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="mt-8 flex justify-between">
				<button
					on:click={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
					class="rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
				>
					Previous
				</button>
				<div class="text-center">
					<span class="rounded-md bg-indigo-100 px-4 py-2 font-medium text-indigo-800">
						Page {currentPage} of {totalPages}
					</span>
				</div>
				<button
					on:click={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					class="rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
				>
					Next
				</button>
			</div>
		{/if}

		<!-- Modal for Report Details -->
		{#if showModal && selectedReport}
			<div
				class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity"
			>
				<div
					class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
				>
					<div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
						<div class="flex items-center justify-between">
							<h3 class="text-xl font-bold text-white">Report Details</h3>
							<button
								on:click={closeModal}
								class="rounded-full bg-white bg-opacity-20 p-1 text-white transition-colors hover:bg-opacity-30"
							>
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
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>

					<div class="divide-y divide-gray-200 px-6 py-5">
						<div class="pb-3">
							<p class="text-sm text-gray-500">Personal Information</p>
							<div class="mt-2 grid grid-cols-2 gap-4">
								<div>
									<p class="text-sm font-medium text-gray-500">Name</p>
									<p class="mt-1 text-base font-medium text-gray-900">{selectedReport.name}</p>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-500">Country</p>
									<p class="mt-1 text-base text-gray-900">{selectedReport.country}</p>
								</div>
							</div>
						</div>

						<div class="py-3">
							<p class="text-sm text-gray-500">Incident Details</p>
							<div class="mt-2 grid grid-cols-2 gap-4">
								<div>
									<p class="text-sm font-medium text-gray-500">Issue</p>
									<p class="mt-1 text-base text-gray-900">{selectedReport.issue}</p>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-500">Location</p>
									<p class="mt-1 text-base text-gray-900">{selectedReport.location}</p>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-500">Emergency Level</p>
									<p class="mt-1">
										<span
											class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getEmergencyLevelColor(
												selectedReport.emergencyLevel
											)}"
										>
											{selectedReport.emergencyLevel}
										</span>
									</p>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-500">Violence Type</p>
									<p class="mt-1 text-base text-gray-900">{selectedReport.violenceType}</p>
								</div>
							</div>
						</div>

						<div class="py-3">
							<p class="text-sm text-gray-500">Contact Information</p>
							<div class="mt-2">
								<p class="text-sm font-medium text-gray-500">Contact Method</p>
								<p class="mt-1 text-base text-gray-900">
									{selectedReport.contactType} - {selectedReport.contactValue}
								</p>
							</div>
						</div>

						<div class="pt-3">
							<p class="text-sm font-medium text-gray-500">Created At</p>
							<p class="mt-1 text-base text-gray-900">
								{new Date(selectedReport.createdAt).toLocaleString()}
							</p>
						</div>
					</div>

					<div class="bg-gray-50 px-6 py-4">
						<button
							on:click={closeModal}
							class="w-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-center font-medium text-white shadow-md transition-all hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
