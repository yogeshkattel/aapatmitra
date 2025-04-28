<script lang="ts">
	import { goto } from '$app/navigation';
	import { newMessageStore, showNotificationStore } from '$lib/stores/socketStore';
	import { onMount } from 'svelte';

	// API base URL
	const API_BASE_URL = 'http://127.0.0.1:8000';

	let mounted = false;

	onMount(() => {
		mounted = true;
		console.log('Notification component mounted');
	});

	function openChatFromNotification(): void {
		if ($newMessageStore && $newMessageStore.report) {
			// Pass sender ID as a query parameter to know which conversation to open
			const senderId = $newMessageStore.sender?.userId || '';
			goto(`/dashboard/reports/${$newMessageStore.report}?openChat=${senderId}`);
			$showNotificationStore = false;
		}
	}
</script>

<!-- Only render if mounted to ensure client-side only rendering -->
{#if mounted && $showNotificationStore && $newMessageStore}
	<div id="notification-container">
		<div class="notification-box">
			<div class="notification-content">
				<div class="avatar">
					{#if $newMessageStore.sender?.profile?.picture?.image}
						<img
							src={`${API_BASE_URL}/${$newMessageStore.sender.profile.picture.image}`}
							alt="Sender"
						/>
					{:else}
						<div class="default-avatar">
							{$newMessageStore.sender?.fullName
								? $newMessageStore.sender.fullName.charAt(0).toUpperCase()
								: '?'}
						</div>
					{/if}
				</div>

				<div class="message-content">
					<p class="sender-name">
						{$newMessageStore.sender?.fullName || 'Unknown User'}
					</p>
					<p class="message-text">
						{$newMessageStore.content}
					</p>
					{#if $newMessageStore.report}
						<span class="report-badge">
							Report #{$newMessageStore.report}
						</span>
					{/if}
				</div>

				<div class="action-buttons">
					<button class="reply-btn" on:click={openChatFromNotification}> Reply </button>
					<button class="dismiss-btn" on:click={() => ($showNotificationStore = false)}>
						Dismiss
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	#notification-container {
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 99999;
		width: 320px;
		pointer-events: auto;
	}

	.notification-box {
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		border: 1px solid #e0e7ff;
		animation: slideIn 0.3s ease-out forwards;
		overflow: hidden;
	}

	.notification-content {
		padding: 16px;
		display: flex;
		gap: 12px;
	}

	.avatar {
		flex-shrink: 0;
	}

	.avatar img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}

	.default-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(to bottom right, #6366f1, #8b5cf6);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 500;
	}

	.message-content {
		flex: 1;
		min-width: 0;
	}

	.sender-name {
		font-weight: 600;
		color: #111827;
		font-size: 14px;
		margin: 0 0 4px 0;
	}

	.message-text {
		color: #4b5563;
		font-size: 14px;
		margin: 0 0 6px 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.report-badge {
		display: inline-block;
		background-color: #e0e7ff;
		color: #4f46e5;
		font-size: 12px;
		font-weight: 500;
		padding: 2px 8px;
		border-radius: 9999px;
	}

	.action-buttons {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.reply-btn {
		background-color: #4f46e5;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 6px 10px;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
	}

	.reply-btn:hover {
		background-color: #4338ca;
	}

	.dismiss-btn {
		background: none;
		border: none;
		color: #6b7280;
		font-size: 12px;
		cursor: pointer;
		padding: 0;
		text-align: center;
	}

	.dismiss-btn:hover {
		color: #374151;
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
</style>
