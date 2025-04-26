<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// Report data
	let report = null;
	let loading = true;
	let error = null;

	// Messages data
	let messages = [];
	let messagesLoading = true;
	let messagesError = null;

	// Sample emergency level colors (these should match your existing app)
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

	async function fetchReport() {
		loading = true;
		error = null;

		try {
			const { id } = $page.params;
			if (!id) throw new Error('Report ID is required');

			const token = browser ? localStorage.getItem('token') : null;
			if (!token) throw new Error('No authentication token found');

			const API_BASE_URL = 'http://127.0.0.1:8000';
			const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
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
				report = result.data;
			} else {
				error = result.message || 'Failed to load report';
			}
		} catch (err) {
			console.error('Error fetching report:', err);
			error = err.message || 'Failed to fetch report. Please try again.';
		} finally {
			loading = false;
		}
	}

	// Mock function to fetch messages (would be replaced with real API call)
	async function fetchMessages() {
		messagesLoading = true;
		messagesError = null;

		try {
			// In a real app, fetch messages from API
			// Simulate delay
			await new Promise((resolve) => setTimeout(resolve, 800));

			// Mock data
			messages = [
				{
					id: 1,
					user: {
						name: 'Sarah Johnson',
						role: 'Case Manager',
						avatar: '/images/humanrights.jpeg'
					},
					lastMessage: "We've confirmed receipt of your report and are looking into the situation.",
					timestamp: new Date('2025-04-16T09:15:00'),
					unread: 2
				},
				{
					id: 2,
					user: {
						name: 'Michael Chen',
						role: 'Legal Advisor',
						avatar: '/images/humanrights.jpeg'
					},
					lastMessage: 'Could you provide contact details for any witnesses?',
					timestamp: new Date('2025-04-16T14:30:00'),
					unread: 0
				},
				{
					id: 3,
					user: {
						name: 'Alex Rivera',
						role: 'Support Specialist',
						avatar: '/images/humanrights.jpeg'
					},
					lastMessage: "I'm here to provide any assistance you might need with your case.",
					timestamp: new Date('2025-04-15T10:45:00'),
					unread: 1
				}
			];
		} catch (err) {
			console.error('Error fetching messages:', err);
			messagesError = 'Failed to load messages. Please try again.';
		} finally {
			messagesLoading = false;
		}
	}

	function goBack() {
		goto('/dashboard/reports');
	}

	onMount(() => {
		if (browser) {
			fetchReport();
			fetchMessages();
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6">
	<div class="container mx-auto px-4">
		<!-- Header with Back Button -->
		<div class="mb-4 flex items-center">
			<button
				class="mr-4 flex items-center rounded-lg bg-white px-3 py-2 text-sm text-gray-700 shadow transition-colors hover:bg-gray-50"
				on:click={goBack}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Reports
			</button>
			<h1 class="text-3xl font-bold text-indigo-800">Report Details</h1>
		</div>

		{#if loading}
			<div class="flex items-center justify-center p-6">
				<div
					class="border-b-3 border-t-3 h-10 w-10 animate-spin rounded-full border-indigo-600"
				></div>
				<span class="ml-3 text-indigo-800">Loading report details...</span>
			</div>
		{:else if error}
			<div class="rounded-md bg-red-50 p-4 shadow-md">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-red-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">Error loading report</h3>
						<div class="mt-2 text-sm text-red-700">
							<p>{error}</p>
						</div>
						<div class="mt-4">
							<button
								type="button"
								class="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
								on:click={fetchReport}
							>
								Try again
							</button>
						</div>
					</div>
				</div>
			</div>
		{:else if report}
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div class="col-span-1 lg:col-span-2">
					<div class="overflow-hidden rounded-xl bg-white shadow-lg">
						<!-- Report Header -->
						<div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
							<div class="flex flex-wrap items-start justify-between">
								<div>
									<h2 class="text-2xl font-bold text-white">{report.name || 'Unnamed Report'}</h2>
									<p class="mt-1 text-indigo-100">
										{report.country} · {report.location}
									</p>
								</div>
								<div>
									<span
										class="inline-flex rounded-full px-3 py-1 text-sm font-semibold {getEmergencyLevelColor(
											report.emergencyLevel
										)}"
									>
										{report.emergencyLevel}
									</span>
								</div>
							</div>
						</div>

						<!-- Report Content -->
						<div class="p-6">
							<div class="mb-6">
								<h3 class="text-lg font-semibold text-gray-800">Issue Description</h3>
								<p class="mt-2 whitespace-pre-line text-gray-700">{report.issue}</p>
							</div>

							<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
								<div>
									<h3 class="text-lg font-semibold text-gray-800">Report Details</h3>
									<div class="mt-2 space-y-3">
										<div class="flex justify-between border-b border-gray-100 pb-2">
											<span class="text-gray-600">Violence Type:</span>
											<span class="font-medium text-gray-800">{report.violenceType}</span>
										</div>
										<div class="flex justify-between border-b border-gray-100 pb-2">
											<span class="text-gray-600">Contact Type:</span>
											<span class="font-medium text-gray-800">{report.contactType}</span>
										</div>
										<div class="flex justify-between border-b border-gray-100 pb-2">
											<span class="text-gray-600">Contact Value:</span>
											<span class="font-medium text-gray-800">{report.contactValue}</span>
										</div>
									</div>
								</div>

								<div>
									<h3 class="text-lg font-semibold text-gray-800">Status Information</h3>
									<div class="mt-2 space-y-3">
										<div class="flex justify-between border-b border-gray-100 pb-2">
											<span class="text-gray-600">Report ID:</span>
											<span class="font-medium text-gray-800">#{report.id}</span>
										</div>
										<div class="flex justify-between border-b border-gray-100 pb-2">
											<span class="text-gray-600">Created:</span>
											<span class="font-medium text-gray-800">
												{new Date(report.createdAt).toLocaleDateString()}
											</span>
										</div>
										<div class="flex justify-between border-b border-gray-100 pb-2">
											<span class="text-gray-600">Last Updated:</span>
											<span class="font-medium text-gray-800">
												{new Date(report.updatedAt || report.createdAt).toLocaleDateString()}
											</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Report Images (if available) -->
							{#if report.image && report.image.length > 0}
								<div class="mb-6">
									<h3 class="text-lg font-semibold text-gray-800">Evidence & Images</h3>
									<div class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
										{#each report.image as img}
											<div class="overflow-hidden rounded-lg bg-gray-100">
												<img
													src={img.image}
													alt="Report evidence"
													class="h-48 w-full object-cover"
												/>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Messages Section -->
				<div class="col-span-1">
					<div class="overflow-hidden rounded-xl bg-white shadow-lg">
						<div
							class="border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 p-4"
						>
							<h3 class="text-lg font-medium text-white">Messages</h3>
							<p class="text-sm text-indigo-100">People who have contacted you about this report</p>
						</div>

						{#if messagesLoading}
							<div class="flex items-center justify-center p-6">
								<div
									class="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"
								></div>
								<span class="ml-3 text-gray-600">Loading messages...</span>
							</div>
						{:else if messagesError}
							<div class="p-4 text-center text-red-500">
								<p>{messagesError}</p>
								<button class="mt-2 text-indigo-600 hover:underline" on:click={fetchMessages}>
									Try again
								</button>
							</div>
						{:else if messages.length === 0}
							<div class="p-6 text-center">
								<p class="text-gray-500">No messages yet</p>
								<p class="mt-2 text-sm text-gray-400">
									You'll be notified when someone sends you a message about this report
								</p>
							</div>
						{:else}
							<div class="divide-y divide-gray-100">
								{#each messages as message}
									<div class="cursor-pointer p-4 transition-colors hover:bg-gray-50">
										<div class="flex items-start space-x-3">
											<div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
												<img
													src={message.user.avatar}
													alt={message.user.name}
													class="h-full w-full object-cover"
												/>
											</div>
											<div class="min-w-0 flex-1">
												<div class="flex items-center justify-between">
													<h4 class="truncate font-medium text-gray-900">{message.user.name}</h4>
													<span class="text-xs text-gray-500">
														{message.timestamp.toLocaleDateString()}
													</span>
												</div>
												<p class="text-sm text-gray-500">{message.user.role}</p>
												<p class="mt-1 truncate text-sm text-gray-700">{message.lastMessage}</p>
											</div>
											{#if message.unread > 0}
												<div class="ml-2 flex-shrink-0">
													<span
														class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-800"
													>
														{message.unread}
													</span>
												</div>
											{/if}
										</div>
									</div>
								{/each}
							</div>
							<div class="border-t border-gray-200 bg-gray-50 p-4">
								<button
									class="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
								>
									View All Messages
								</button>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
