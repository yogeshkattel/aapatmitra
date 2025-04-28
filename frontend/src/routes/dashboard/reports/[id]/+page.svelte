<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { io, Socket } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';

	// Report data
	let report: any = null;
	let loading = true;
	let error: string | null = null;
	let activeConversation: any = null;
	let showChatBox = false;

	// Socket connection
	let socket: Socket | null = null;
	let newMessage: any = null;
	let showNotification = false;

	// API base URL
	const API_BASE_URL = 'http://127.0.0.1:8000';

	// Emergency level colors and icons
	function getEmergencyLevelColor(level: string) {
		switch (level?.toLowerCase()) {
			case 'low':
				return { bg: 'bg-green-100', text: 'text-green-800', icon: 'info' };
			case 'medium':
				return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'alert-triangle' };
			case 'high':
				return { bg: 'bg-orange-100', text: 'text-orange-800', icon: 'alert-octagon' };
			case 'critical':
				return { bg: 'bg-red-100', text: 'text-red-800', icon: 'alert-circle' };
			default:
				return { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'help-circle' };
		}
	}

	// Format date string
	function formatDate(dateString: string) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		});
	}

	// Get unique participants from all conversations
	function getUniqueParticipants(conversations: any[]) {
		if (!conversations || !Array.isArray(conversations)) return [];

		const uniqueParticipants = new Map();

		conversations.forEach((conversation) => {
			if (conversation.participants) {
				conversation.participants.forEach((participant: any) => {
					if (!uniqueParticipants.has(participant.userId)) {
						uniqueParticipants.set(participant.userId, participant);
					}
				});
			}
		});

		return Array.from(uniqueParticipants.values());
	}

	// Get profile image URL or return null for default avatar
	function getProfileImageUrl(participant: any) {
		if (participant?.profile?.picture?.image) {
			return `${API_BASE_URL}/${participant.profile.picture.image}`;
		}
		return null;
	}

	// Get the last message from a specific conversation
	function getLastMessage(conversation: any) {
		if (!conversation?.messages || conversation.messages.length === 0) return 'No messages';
		return conversation.messages[0].content || 'No content';
	}

	// Get the time of the last message
	function getLastMessageTime(conversation: any) {
		if (!conversation?.messages || conversation.messages.length === 0) return '';
		return formatDate(conversation.messages[0].createdAt);
	}

	// Find conversation for a specific user
	function findConversationWithUser(userId: string) {
		if (!report?.conversations) return null;
		return report.conversations.find((conv: any) =>
			conv.participants?.some((p: any) => p.userId === userId)
		);
	}

	// View conversation with specific user
	function viewConversationWithUser(userId: string) {
		const conversation = findConversationWithUser(userId);
		if (conversation) {
			activeConversation = conversation;
			showChatBox = true;
			showNotification = false;
		}
	}

	// Close chat box
	function closeChatBox() {
		showChatBox = false;
	}

	// Handle incoming message notification
	function handleIncomingMessage(message: any) {
		console.log('Received message:', message);
		newMessage = message;
		showNotification = true;

		// If the relevant conversation is already open, add the message
		if (showChatBox && activeConversation && message.report === report.id) {
			// Update the active conversation with the new message
			// In a real app, you'd need to determine which conversation this belongs to
			// For now, refresh the whole report data to get updated conversations
			fetchReport();
		}

		// Auto-dismiss notification after 5 seconds
		setTimeout(() => {
			if (showNotification && newMessage === message) {
				showNotification = false;
			}
		}, 5000);
	}

	// Open chat from notification
	function openChatFromNotification() {
		if (newMessage && newMessage.sender && newMessage.sender.userId) {
			viewConversationWithUser(newMessage.sender.userId);
			showNotification = false;
		}
	}

	// Initialize Socket.IO connection
	function initializeSocket() {
		if (!browser) return;

		const token = localStorage.getItem('token');
		if (!token) return;
		console.log(token)
		try {
			// Configure Socket.IO with proper CORS settings
			socket = io(API_BASE_URL, {
				auth: {
					token
				},
				withCredentials: true,
				transports: ['websocket', 'polling'],
				path: '/socket.io', // Make sure this matches your server configuration
				autoConnect: true,
				reconnection: true,

				reconnectionAttempts: 5,
				reconnectionDelay: 2000
			});

			socket.on('connect', () => {
				console.log('Socket connected successfully');
			});

			socket.on('disconnect', () => {
				console.log('Socket disconnected');
			});

			socket.on('received-message', handleIncomingMessage);

			socket.on('connect_error', (err) => {
				console.error('Socket connection error:', err);
			});
		} catch (err) {
			console.error('Error initializing socket:', err);
		}
	}

	function goBack() {
		goto('/dashboard/reports');
	}

	async function fetchReport() {
		loading = true;
		error = null;

		try {
			const { id } = $page.params;
			if (!id) throw new Error('Report ID is required');

			const token = browser ? localStorage.getItem('token') : null;
			if (!token) throw new Error('No authentication token found');

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
			report = result.data || result;
			console.log('Report data:', report);
		} catch (err: any) {
			console.error('Error fetching report:', err);
			error = err.message || 'Failed to fetch report. Please try again.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if (browser) {
			fetchReport();
			initializeSocket();
		}
	});


</script>

<div class="relative !m-0 min-h-screen bg-gray-50 !p-0">
	<!-- Header with card-style navigation -->
	<header class="sticky top-0 z-20 !m-0 border-b border-gray-200 bg-white !p-0 shadow-sm">
		<div class="mx-auto max-w-full">
			<div class="flex items-center justify-between px-4 py-4">
				<button
					on:click={goBack}
					class="flex items-center text-gray-600 transition-colors hover:text-gray-900"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-2 h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="text-sm font-medium">Back to Reports</span>
				</button>
				<h1 class="text-2xl font-bold text-gray-900">Report Details</h1>
				<div class="w-20"></div>
				<!-- Spacer -->
			</div>
		</div>
	</header>

	<!-- Message Notification -->
	{#if showNotification && newMessage}
		<div
			class="animate-slideIn fixed top-20 right-4 z-40 w-80 rounded-lg border border-indigo-100 bg-white p-4 shadow-lg"
		>
			<div class="flex items-start space-x-4">
				<div class="flex-shrink-0">
					{#if newMessage.sender?.profile?.picture?.image}
						<img
							src={`${API_BASE_URL}/${newMessage.sender.profile.picture.image}`}
							alt="Sender"
							class="h-10 w-10 rounded-full object-cover"
						/>
					{:else}
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-medium text-white"
						>
							{newMessage.sender?.fullName
								? newMessage.sender.fullName.charAt(0).toUpperCase()
								: '?'}
						</div>
					{/if}
				</div>

				<div class="min-w-0 flex-1">
					<p class="text-sm font-medium text-gray-900">
						{newMessage.sender?.fullName || 'Unknown User'}
					</p>
					<p class="mt-1 truncate text-sm text-gray-500">
						{newMessage.content}
					</p>
					{#if newMessage.report}
						<span
							class="mt-1 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800"
						>
							Report #{newMessage.report}
						</span>
					{/if}
				</div>

				<div class="flex flex-shrink-0 flex-col space-y-2">
					<button
						on:click={openChatFromNotification}
						class="rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none"
					>
						Reply
					</button>
					<button
						on:click={() => (showNotification = false)}
						class="text-xs text-gray-500 hover:text-gray-700"
					>
						Dismiss
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if loading}
		<!-- Loading state with centered spinner -->
		<div class="flex h-[calc(100vh-64px)] items-center justify-center">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"
			></div>
		</div>
	{:else if error}
		<!-- Error state -->
		<div class="mx-auto mt-12 max-w-xl rounded-lg bg-red-50 p-6">
			<div class="flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-3 h-5 w-5 text-red-400"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
						clip-rule="evenodd"
					/>
				</svg>
				<h3 class="text-lg font-medium text-red-800">Error loading report</h3>
			</div>
			<p class="mt-2 text-sm text-red-700">{error}</p>
			<button
				on:click={fetchReport}
				class="mt-4 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-200"
			>
				Retry
			</button>
		</div>
	{:else if report}
		<!-- Main content with fixed sidebar -->
		<div class="relative">
			<!-- Fixed width sidebar for conversations - Only visible on larger screens -->
			<div
				class="fixed top-32 right-4 z-30 block w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md lg:right-8 xl:right-[calc((100vw-1280px)/2+2rem)]"
			>
				<div class="border-b border-gray-200 px-5 py-4">
					<div class="flex items-center justify-between">
						<h3 class="text-base font-medium text-gray-900">Conversations</h3>
						<span
							class="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800"
						>
							{report.conversations?.length || 0}
						</span>
					</div>
				</div>

				{#if !report.conversations || report.conversations.length === 0}
					<div class="p-6 text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mx-auto h-12 w-12 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
						<p class="mt-3 text-sm text-gray-500">No active conversations</p>
					</div>
				{:else}
					<div
						class="custom-scrollbar max-h-[calc(100vh-200px)] divide-y divide-gray-200 overflow-y-auto"
					>
						{#each getUniqueParticipants(report.conversations) as participant}
							{#if participant.userId !== report.user?.userId}
								{@const conversation = findConversationWithUser(participant.userId)}
								<button
									on:click={() => viewConversationWithUser(participant.userId)}
									class={`w-full p-4 text-left transition-colors hover:bg-gray-50 focus:outline-none ${
										activeConversation?.id === conversation?.id ? 'bg-indigo-50' : ''
									}`}
								>
									<div class="flex items-center gap-3">
										<!-- Avatar -->
										<div class="relative">
											{#if getProfileImageUrl(participant)}
												<img
													src={getProfileImageUrl(participant)}
													alt={participant.fullName}
													class="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
												/>
											{:else}
												<div
													class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-medium text-white"
												>
													{participant.fullName
														? participant.fullName.charAt(0).toUpperCase()
														: '?'}
												</div>
											{/if}
											<div
												class="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
											></div>
										</div>

										<!-- Details -->
										<div class="min-w-0 flex-1">
											<div class="flex items-center justify-between gap-2">
												<span class="truncate text-sm font-medium text-gray-900">
													{participant.fullName || 'Anonymous'}
												</span>
												{#if conversation?.messages?.length > 0}
													<span class="text-xs text-gray-500">
														{getLastMessageTime(conversation)}
													</span>
												{/if}
											</div>
											<div class="mt-1 flex items-center justify-between gap-2">
												<p class="truncate text-sm text-gray-600">
													{conversation ? getLastMessage(conversation) : 'No messages'}
												</p>
											</div>
											{#if participant.userType}
												<div class="mt-1">
													<span
														class="inline-flex items-center rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
													>
														{participant.userType}
													</span>
												</div>
											{/if}
										</div>
									</div>
								</button>
							{/if}
						{/each}
					</div>
				{/if}
			</div>

			<!-- Main content with right margin for the sidebar on larger screens -->
			<div class="!m-0 mx-auto max-w-full px-4 py-6 !pt-6 pr-[calc(340px)] !pb-6">
				<div class="space-y-6">
					<!-- Report header card - Made larger -->
					<div class="rounded-xl border border-gray-200 bg-white shadow-md">
						<div class="border-b border-gray-200 px-6 py-5">
							<div class="flex flex-wrap items-center justify-between gap-3">
								<div>
									<h2 class="text-xl font-semibold text-gray-900">{report.name}</h2>
									<p class="mt-1 text-sm text-gray-500">
										{report.location || 'Unknown location'} • {report.country || 'Unknown country'}
									</p>
								</div>
								{#if report.emergencyLevel}
									{@const emergency = getEmergencyLevelColor(report.emergencyLevel)}
									<span
										class={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${emergency.bg} ${emergency.text}`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mr-1 h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											{#if emergency.icon === 'info'}
												<path
													fill-rule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
													clip-rule="evenodd"
												/>
											{:else if emergency.icon === 'alert-triangle'}
												<path
													fill-rule="evenodd"
													d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
													clip-rule="evenodd"
												/>
											{:else if emergency.icon === 'alert-octagon'}
												<path
													fill-rule="evenodd"
													d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a1 1 0 100-2 1 1 0 000 2z"
													clip-rule="evenodd"
												/>
											{:else if emergency.icon === 'alert-circle'}
												<path
													fill-rule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
													clip-rule="evenodd"
												/>
											{:else}
												<path
													fill-rule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
													clip-rule="evenodd"
												/>
											{/if}
										</svg>
										{report.emergencyLevel}
									</span>
								{/if}
							</div>
						</div>

						<div class="space-y-8 px-6 py-6">
							<!-- Report Details -->
							<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
								<div class="space-y-5 rounded-lg bg-gray-50 p-5">
									<div class="flex items-center justify-between">
										<span class="text-sm font-medium text-gray-700">Violence Type:</span>
										<span class="text-sm font-medium text-gray-900"
											>{report.violenceType || 'Not specified'}</span
										>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-sm font-medium text-gray-700">Contact Type:</span>
										<span class="text-sm font-medium text-gray-900"
											>{report.contactType || 'Not specified'}</span
										>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-sm font-medium text-gray-700">Created At:</span>
										<span class="text-sm font-medium text-gray-900"
											>{formatDate(report.createdAt) || 'Unknown'}</span
										>
									</div>
								</div>

								<div class="space-y-5 rounded-lg bg-gray-50 p-5">
									<div class="flex items-center justify-between">
										<span class="text-sm font-medium text-gray-700">Report ID:</span>
										<span class="text-sm font-medium text-gray-900">#{report.id || 'Unknown'}</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-sm font-medium text-gray-700">Status:</span>
										<span
											class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
										>
											<span class="mr-1 h-2 w-2 rounded-full bg-green-400"></span>
											{report.status || 'Active'}
										</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-sm font-medium text-gray-700">Last Updated:</span>
										<span class="text-sm font-medium text-gray-900"
											>{formatDate(report.updatedAt) || 'Unknown'}</span
										>
									</div>
								</div>
							</div>

							<!-- Description -->
							<div>
								<h3 class="mb-3 text-base font-semibold text-gray-900">Description</h3>
								<div class="rounded-lg bg-gray-50 p-5">
									<p class="text-sm whitespace-pre-line text-gray-600">
										{report.issue || 'No description provided'}
									</p>
								</div>
							</div>

							<!-- Evidence Images -->
							{#if report.images && report.images.length > 0}
								<div>
									<h3 class="mb-3 text-base font-semibold text-gray-900">Evidence</h3>
									<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
										{#each report.images as img}
											<div
												class="group relative aspect-square overflow-hidden rounded-lg shadow-sm"
											>
												<img
													src={`${API_BASE_URL}/${img.image}`}
													alt="Report evidence"
													class="h-full w-full rounded-lg border border-gray-200 object-cover transition-opacity hover:opacity-90"
												/>
												<div
													class="bg-opacity-0 group-hover:bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-all group-hover:opacity-100"
												>
													<button
														class="transform rounded-full bg-white p-2 transition-transform hover:scale-110"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-5 w-5 text-gray-900"
															viewBox="0 0 20 20"
															fill="currentColor"
														>
															<path
																d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
															/>
															<path
																d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
															/>
														</svg>
													</button>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Facebook-style Chat Message Box (Appears when clicking on conversation) -->
		{#if showChatBox && activeConversation}
			<div
				class="fixed right-4 bottom-4 z-30 flex h-96 w-96 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
			>
				<!-- Chat Header -->
				<div
					class="flex items-center justify-between border-b border-gray-200 bg-indigo-50 px-4 py-3"
				>
					<div class="flex items-center">
						{#if activeConversation}
							{@const participant = activeConversation.participants?.find(
								(p) => p.userId !== report.user?.userId
							)}
							<!-- Participant Avatar -->
							<div class="relative mr-3">
								{#if participant && getProfileImageUrl(participant)}
									<img
										src={getProfileImageUrl(participant)}
										alt={participant.fullName}
										class="h-8 w-8 rounded-full border-2 border-white object-cover"
									/>
								{:else}
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-medium text-white"
									>
										{participant?.fullName ? participant.fullName.charAt(0).toUpperCase() : '?'}
									</div>
								{/if}
								<div
									class="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-white bg-green-500"
								></div>
							</div>

							<!-- Participant Name -->
							<div>
								<h4 class="text-sm font-medium text-gray-900">
									{participant?.fullName || 'Anonymous'}
								</h4>
							</div>
						{/if}
					</div>

					<!-- Close Button -->
					<button on:click={closeChatBox} class="text-gray-500 hover:text-gray-700">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>

				<!-- Chat Messages -->
				<div class="custom-scrollbar flex-1 overflow-y-auto bg-gray-50 p-4">
					{#if activeConversation.messages && activeConversation.messages.length > 0}
						<div class="space-y-3">
							{#each activeConversation.messages as message}
								{@const isCurrentUser = message.senderId === report.user?.userId}
								<div class={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
									<div
										class={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm ${isCurrentUser ? 'bg-indigo-100 text-indigo-900' : 'border border-gray-200 bg-white text-gray-800'}`}
									>
										<p class="text-sm">{message.content}</p>
										<div
											class={`mt-1 text-xs ${isCurrentUser ? 'text-indigo-700' : 'text-gray-500'}`}
										>
											{formatDate(message.createdAt)}
										</div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="flex h-full items-center justify-center">
							<p class="text-sm text-gray-500">No messages in this conversation</p>
						</div>
					{/if}
				</div>

				<!-- Message Input -->
				<div class="border-t border-gray-200 bg-white p-3">
					<div class="flex items-center">
						<input
							type="text"
							placeholder="Type a message..."
							class="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:outline-none"
						/>
						<button
							class="ml-2 rounded-full bg-indigo-500 p-2 text-white transition-colors hover:bg-indigo-600"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.custom-scrollbar {
		scrollbar-width: thin;
		scrollbar-color: #c7d2fe #f1f5f9;
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: #f1f5f9;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: #c7d2fe;
		border-radius: 20px;
		border: 2px solid #f1f5f9;
	}

	@keyframes slideIn {
		from {
			transform: translateY(-10px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-slideIn {
		animation: slideIn 0.3s ease-out forwards;
	}
</style>
