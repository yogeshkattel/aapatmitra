<script lang="ts">
	import { onMount } from 'svelte';

	// Mock reports data (in a real app, this would come from an API)
	let reports = [
		{
			id: 'REP-001',
			title: 'Working Condition Complaint',
			description: 'Poor ventilation and excessive heat in worker accommodation.',
			status: 'In Progress',
			date: '2023-04-15',
			country: 'Qatar',
			category: 'Work Conditions',
			priority: 'High'
		},
		{
			id: 'REP-002',
			title: 'Wage Issue Report',
			description: 'Delayed payment of wages for three consecutive months.',
			status: 'Resolved',
			date: '2023-04-02',
			country: 'UAE',
			category: 'Wages',
			priority: 'Medium'
		},
		{
			id: 'REP-003',
			title: 'Housing Condition Report',
			description: 'Overcrowded housing conditions with inadequate facilities.',
			status: 'Pending',
			date: '2023-04-10',
			country: 'Saudi Arabia',
			category: 'Housing',
			priority: 'High'
		},
		{
			id: 'REP-004',
			title: 'Contract Violation',
			description: 'Employer forcing longer work hours than specified in contract.',
			status: 'In Progress',
			date: '2023-03-28',
			country: 'Malaysia',
			category: 'Legal',
			priority: 'High'
		},
		{
			id: 'REP-005',
			title: 'Document Confiscation',
			description: 'Employer has confiscated passport and identification documents.',
			status: 'Urgent',
			date: '2023-04-18',
			country: 'Bahrain',
			category: 'Legal',
			priority: 'Critical'
		},
		{
			id: 'REP-006',
			title: 'Health Insurance Issue',
			description: 'No access to promised health insurance coverage.',
			status: 'Pending',
			date: '2023-04-05',
			country: 'Kuwait',
			category: 'Healthcare',
			priority: 'Medium'
		}
	];

	let filters = {
		status: 'All',
		priority: 'All',
		category: 'All'
	};

	let filteredReports = [...reports];

	// Filter functions
	function applyFilters() {
		filteredReports = reports.filter((report) => {
			if (filters.status !== 'All' && report.status !== filters.status) return false;
			if (filters.priority !== 'All' && report.priority !== filters.priority) return false;
			if (filters.category !== 'All' && report.category !== filters.category) return false;
			return true;
		});
	}

	// Get unique values for filter dropdowns
	function getUniqueValues(field) {
		return ['All', ...new Set(reports.map((report) => report[field]))];
	}

	let statusOptions = [];
	let priorityOptions = [];
	let categoryOptions = [];

	onMount(() => {
		statusOptions = getUniqueValues('status');
		priorityOptions = getUniqueValues('priority');
		categoryOptions = getUniqueValues('category');
	});

	// Watch for filter changes
	$: {
		if (filters) {
			applyFilters();
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-800">Reports</h1>
		<p class="mt-2 text-gray-600">Manage and track all your submitted reports</p>
	</div>

	<!-- Filters -->
	<div class="mb-6 rounded-lg bg-white p-4 shadow">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
			<div>
				<label for="status" class="block text-sm font-medium text-gray-700">Status</label>
				<select
					id="status"
					bind:value={filters.status}
					class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
				>
					{#each statusOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
				<select
					id="priority"
					bind:value={filters.priority}
					class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
				>
					{#each priorityOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="category" class="block text-sm font-medium text-gray-700">Category</label>
				<select
					id="category"
					bind:value={filters.category}
					class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
				>
					{#each categoryOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>

			<div class="flex items-end">
				<button
					type="button"
					class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					on:click={() => {
						filters = {
							status: 'All',
							priority: 'All',
							category: 'All'
						};
					}}
				>
					Reset Filters
				</button>
			</div>
		</div>
	</div>

	<!-- Create New Report Button -->
	<div class="mb-6">
		<button
			type="button"
			class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		>
			<svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Create New Report
		</button>
	</div>

	<!-- Reports Grid -->
	{#if filteredReports.length === 0}
		<div class="flex h-40 items-center justify-center rounded-lg bg-gray-50">
			<p class="text-gray-500">No reports match your current filters.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredReports as report}
				<div class="report-card overflow-hidden rounded-lg bg-white shadow">
					<div class="p-5">
						<div class="flex items-center justify-between">
							<span class="text-xs font-medium text-gray-500">{report.id}</span>
							{#if report.status === 'Resolved'}
								<span
									class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
								>
									{report.status}
								</span>
							{:else if report.status === 'In Progress'}
								<span class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
									{report.status}
								</span>
							{:else if report.status === 'Urgent'}
								<span class="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
									{report.status}
								</span>
							{:else}
								<span
									class="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800"
								>
									{report.status}
								</span>
							{/if}
						</div>

						<h3 class="mt-2 text-lg font-medium text-gray-900">{report.title}</h3>
						<p class="mt-1 line-clamp-2 text-sm text-gray-600">{report.description}</p>

						<div class="mt-4 flex flex-wrap gap-2">
							<span
								class="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
							>
								{report.category}
							</span>

							{#if report.priority === 'Critical'}
								<span
									class="inline-flex items-center rounded-md bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
								>
									{report.priority}
								</span>
							{:else if report.priority === 'High'}
								<span
									class="inline-flex items-center rounded-md bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800"
								>
									{report.priority}
								</span>
							{:else}
								<span
									class="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
								>
									{report.priority}
								</span>
							{/if}
						</div>

						<div class="mt-3 flex items-center text-sm text-gray-500">
							<svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							{report.date}
						</div>

						<div class="mt-1 flex items-center text-sm text-gray-500">
							<svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							{report.country}
						</div>

						<div class="mt-4 border-t border-gray-100 pt-4">
							<a
								href={`/dashboard/reports/${report.id}`}
								class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
							>
								View details →
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.report-card {
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.report-card:hover {
		transform: translateY(-3px);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
</style>
