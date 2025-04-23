<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// Mock report data - in a real app this would come from an API
	let report = {
		id: '',
		title: '',
		description: '',
		status: '',
		date: '',
		country: '',
		category: '',
		priority: '',
		comments: [],
		attachments: []
	};

	// Mock comments data
	const mockComments = [
		{
			id: 1,
			author: 'Jane Smith',
			text: 'This report needs immediate attention.',
			date: '2023-06-15'
		},
		{
			id: 2,
			author: 'John Doe',
			text: "I've assigned additional resources to this case.",
			date: '2023-06-16'
		},
		{
			id: 3,
			author: 'Sarah Johnson',
			text: 'Update: Local authorities have been notified.',
			date: '2023-06-18'
		}
	];

	// Mock attachments
	const mockAttachments = [
		{ id: 1, name: 'evidence.pdf', size: '2.4 MB', date: '2023-06-14' },
		{ id: 2, name: 'witness_statement.docx', size: '1.1 MB', date: '2023-06-15' },
		{ id: 3, name: 'location_photo.jpg', size: '3.8 MB', date: '2023-06-15' }
	];

	// Mock report data based on hardcoded IDs
	const mockReports = {
		'1': {
			id: '1',
			title: 'Human Trafficking Case #1289',
			description:
				'Suspected human trafficking operation discovered in downtown area. Multiple victims identified, ages 15-22.',
			status: 'active',
			date: '2023-06-10',
			country: 'United States',
			category: 'Trafficking',
			priority: 'high',
			comments: mockComments,
			attachments: mockAttachments
		},
		'2': {
			id: '2',
			title: 'Child Labor Investigation #087',
			description:
				'Reports of children under 12 working in textile factory. Initial evidence suggests unsafe working conditions.',
			status: 'pending',
			date: '2023-06-05',
			country: 'Bangladesh',
			category: 'Child Labor',
			priority: 'high',
			comments: mockComments.slice(0, 1),
			attachments: mockAttachments.slice(0, 2)
		},
		'3': {
			id: '3',
			title: 'Modern Slavery Report #342',
			description:
				'Workers in agricultural sector reporting passport confiscation and forced labor conditions.',
			status: 'resolved',
			date: '2023-05-20',
			country: 'Thailand',
			category: 'Forced Labor',
			priority: 'medium',
			comments: mockComments,
			attachments: mockAttachments.slice(1, 3)
		},
		'4': {
			id: '4',
			title: 'Exploitation Case #763',
			description:
				'Domestic workers reporting excessive hours, no days off, and psychological abuse.',
			status: 'active',
			date: '2023-06-08',
			country: 'Saudi Arabia',
			category: 'Exploitation',
			priority: 'medium',
			comments: mockComments.slice(1, 3),
			attachments: mockAttachments.slice(0, 1)
		},
		'5': {
			id: '5',
			title: 'Child Trafficking Alert #129',
			description:
				'Multiple reports of children being transported across borders for suspected forced labor.',
			status: 'pending',
			date: '2023-06-12',
			country: 'Myanmar',
			category: 'Trafficking',
			priority: 'high',
			comments: [],
			attachments: mockAttachments
		},
		'6': {
			id: '6',
			title: 'Wage Theft Investigation #476',
			description:
				'Factory workers reporting months of unpaid wages and threats when requesting payment.',
			status: 'resolved',
			date: '2023-05-25',
			country: 'Indonesia',
			category: 'Wage Theft',
			priority: 'low',
			comments: mockComments,
			attachments: []
		}
	};

	let newComment = '';
	let displayedReportId = '';

	onMount(() => {
		// Get the report ID from the URL
		displayedReportId = $page.params.id;
		loadReport(displayedReportId);
	});

	function loadReport(id: string) {
		// In a real app, this would be an API call
		if (mockReports[id]) {
			report = mockReports[id];
		} else {
			// Handle case when report is not found
			report = {
				id: 'not-found',
				title: 'Report Not Found',
				description: 'The requested report does not exist or has been removed.',
				status: 'error',
				date: '',
				country: '',
				category: '',
				priority: '',
				comments: [],
				attachments: []
			};
		}
	}

	function addComment() {
		if (newComment.trim()) {
			report.comments = [
				{
					id: report.comments.length + 1,
					author: 'Current User',
					text: newComment,
					date: new Date().toISOString().split('T')[0]
				},
				...report.comments
			];
			newComment = '';
		}
	}

	function goBack() {
		goto('/dashboard/reports');
	}

	function getStatusClass(status: string) {
		switch (status) {
			case 'active':
				return 'bg-blue-100 text-blue-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'resolved':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getPriorityClass(priority: string) {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800';
			case 'medium':
				return 'bg-orange-100 text-orange-800';
			case 'low':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="mx-auto max-w-7xl p-6">
	<div class="mb-6 flex items-center justify-between">
		<button on:click={goBack} class="flex items-center text-blue-600 hover:text-blue-800">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mr-1 h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
					clip-rule="evenodd"
				/>
			</svg>
			Back to Reports
		</button>

		<div class="flex space-x-3">
			<button class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
				Edit Report
			</button>
			<button class="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
				Export PDF
			</button>
		</div>
	</div>

	{#if report.id === 'not-found'}
		<div class="rounded-lg bg-red-100 p-6">
			<h1 class="text-2xl font-bold text-red-800">{report.title}</h1>
			<p class="mt-2 text-red-700">{report.description}</p>
			<p class="mt-4">Please return to the reports list and select a valid report.</p>
		</div>
	{:else}
		<div class="overflow-hidden rounded-lg bg-white shadow-md">
			<!-- Report Header -->
			<div class="border-b p-6">
				<div class="flex items-start justify-between">
					<div>
						<h1 class="text-2xl font-bold text-gray-900">{report.title}</h1>
						<div class="mt-2 flex items-center space-x-3">
							<span
								class="rounded-full px-2.5 py-0.5 text-sm font-medium {getStatusClass(
									report.status
								)}"
							>
								{report.status.charAt(0).toUpperCase() + report.status.slice(1)}
							</span>
							<span
								class="rounded-full px-2.5 py-0.5 text-sm font-medium {getPriorityClass(
									report.priority
								)}"
							>
								{report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
							</span>
							<span class="text-gray-500">Report #{report.id}</span>
						</div>
					</div>
					<div class="text-right">
						<p class="text-sm text-gray-500">Submitted on</p>
						<p class="font-medium">{report.date}</p>
					</div>
				</div>
			</div>

			<!-- Report Details -->
			<div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
				<div class="md:col-span-2">
					<h2 class="mb-4 text-xl font-semibold">Description</h2>
					<p class="whitespace-pre-line text-gray-700">{report.description}</p>

					<div class="mt-8">
						<h2 class="mb-4 text-xl font-semibold">Details</h2>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-sm text-gray-500">Category</p>
								<p class="font-medium">{report.category}</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Country</p>
								<p class="font-medium">{report.country}</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Status</p>
								<p class="font-medium">
									{report.status.charAt(0).toUpperCase() + report.status.slice(1)}
								</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Priority</p>
								<p class="font-medium">
									{report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
								</p>
							</div>
						</div>
					</div>

					<!-- Attachments Section -->
					<div class="mt-8">
						<h2 class="mb-4 text-xl font-semibold">Attachments ({report.attachments.length})</h2>
						{#if report.attachments.length === 0}
							<p class="italic text-gray-500">No attachments for this report</p>
						{:else}
							<div class="overflow-hidden rounded-lg border">
								<ul class="divide-y">
									{#each report.attachments as attachment}
										<li class="flex items-center justify-between p-4 hover:bg-gray-50">
											<div class="flex items-center">
												<svg
													class="mr-3 h-6 w-6 text-gray-400"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
													/>
												</svg>
												<div>
													<p class="font-medium">{attachment.name}</p>
													<p class="text-sm text-gray-500">
														Added on {attachment.date} • {attachment.size}
													</p>
												</div>
											</div>
											<button class="text-blue-600 hover:text-blue-800">Download</button>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				</div>

				<!-- Comments Section -->
				<div class="md:col-span-1">
					<div class="rounded-lg bg-gray-50 p-4">
						<h2 class="mb-4 text-xl font-semibold">Activity & Comments</h2>

						<!-- Add Comment Form -->
						<div class="mb-6">
							<textarea
								bind:value={newComment}
								class="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
								rows="3"
								placeholder="Add a comment..."
							></textarea>
							<button
								on:click={addComment}
								class="mt-2 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
								disabled={!newComment.trim()}
							>
								Add Comment
							</button>
						</div>

						<!-- Comments List -->
						<div class="space-y-4">
							{#if report.comments.length === 0}
								<p class="py-4 text-center italic text-gray-500">No comments yet</p>
							{:else}
								{#each report.comments as comment}
									<div class="rounded-lg bg-white p-4 shadow-sm">
										<div class="flex justify-between">
											<span class="font-semibold">{comment.author}</span>
											<span class="text-sm text-gray-500">{comment.date}</span>
										</div>
										<p class="mt-2 text-gray-700">{comment.text}</p>
									</div>
								{/each}
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Add any specific styles needed */
</style>
