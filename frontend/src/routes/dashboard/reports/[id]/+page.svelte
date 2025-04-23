<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let report = null;

	onMount(() => {
		const { id } = $page.params;
		const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
		report = storedReports.find((r) => r.id === parseInt(id));
	});
</script>

<div class="container mx-auto px-4 py-6">
	{#if report}
		<h1 class="mb-4 text-2xl font-bold text-gray-800">Report Details</h1>
		<div class="overflow-hidden rounded-lg bg-white shadow">
			<div class="px-4 py-5">
				<h2 class="text-lg font-semibold text-gray-800">{report.name}</h2>
				<p class="text-sm text-gray-500">Country: {report.country}</p>
				<p class="text-sm text-gray-500">Issue: {report.issue}</p>
				<p class="text-sm text-gray-500">Location: {report.location}</p>
				<p class="text-sm text-gray-500">Emergency Level: {report.emergencyLevel}</p>
				<p class="text-sm text-gray-500">Violence Type: {report.violenceType}</p>
				<p class="text-sm text-gray-500">Contact: {report.contactType} - {report.contactValue}</p>
				<p class="text-sm text-gray-500">
					Created At: {new Date(report.createdAt).toLocaleDateString()}
				</p>
			</div>
		</div>
	{:else}
		<div class="flex items-center justify-center p-6">
			<span class="text-gray-600">Loading report details...</span>
		</div>
	{/if}
</div>
