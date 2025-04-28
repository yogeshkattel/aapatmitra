<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		newMessageStore,
		showNotificationStore,
		socketConnection
	} from '$lib/stores/socketStore';

	// API base URL
	const API_BASE_URL = 'http://127.0.0.1:8000';

	function openChatFromNotification(): void {
		if ($newMessageStore && $newMessageStore.report) {
			// Navigate to the report detail page
			goto(`/dashboard/reports/${$newMessageStore.report}`);
			$showNotificationStore = false;
		}
	}
</script>

{#if $showNotificationStore && $newMessageStore}
	<div
		class="animate-slideIn fixed top-20 right-4 z-[9999] w-80 rounded-lg border border-indigo-100 bg-white p-4 shadow-lg"
	>
		<div class="flex items-start space-x-4">
			<div class="flex-shrink-0">
				{#if $newMessageStore.sender?.profile?.picture?.image}
					<img
						src={`${API_BASE_URL}/${$newMessageStore.sender.profile.picture.image}`}
						alt="Sender"
						class="h-10 w-10 rounded-full object-cover"
					/>
				{:else}
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-medium text-white"
					>
						{$newMessageStore.sender?.fullName
							? $newMessageStore.sender.fullName.charAt(0).toUpperCase()
							: '?'}
					</div>
				{/if}
			</div>

			<div class="min-w-0 flex-1">
				<p class="text-sm font-medium text-gray-900">
					{$newMessageStore.sender?.fullName || 'Unknown User'}
				</p>
				<p class="mt-1 truncate text-sm text-gray-500">
					{$newMessageStore.content}
				</p>
				{#if $newMessageStore.report}
					<span
						class="mt-1 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800"
					>
						Report #{$newMessageStore.report}
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
					on:click={() => ($showNotificationStore = false)}
					class="text-xs text-gray-500 hover:text-gray-700"
				>
					Dismiss
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
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

	/* Add these styles to ensure the notification is always visible */
	:global(body) {
		position: relative;
		overflow-x: hidden;
	}
</style>
