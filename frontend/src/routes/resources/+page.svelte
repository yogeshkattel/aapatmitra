<script lang="ts">
	import { activateTab, filterCountriesByCode, setupCountryFilter } from '$lib/js/resources';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// Destructure the data from the page.ts load function
	const { countries, resourceGuides, legalResources, supportServices } = data;

	// Active tab state
	let activeTab = 'emergency';
	let filteredCountries = countries;
	let selectedCountry = 'all';

	// Filter countries based on selection
	function filterCountries(countryCode: string) {
		selectedCountry = countryCode;
		filteredCountries = filterCountriesByCode(countryCode, countries);
	}

	// Switch tabs
	function switchTab(tab: string) {
		activeTab = tab;
		// Also update the DOM to show the active tab
		activateTab(tab);
	}

	onMount(() => {
		// Set up tab switching event listeners
		const tabButtons = document.querySelectorAll('.tab-button');
		tabButtons.forEach((button) => {
			button.addEventListener('click', function (this: HTMLElement) {
				const tab = this.getAttribute('data-tab');
				if (tab) {
					switchTab(tab);
				}
			});
		});

		// Set up country filtering using the helper function
		setupCountryFilter(filterCountries);
	});
</script>

<svelte:head>
	<title>Aapatmitra - Resources</title>
</svelte:head>

<main class="resources-page">
	<div class="container">
		<div class="page-header">
			<h1>Resources & Emergency Contacts</h1>
			<p class="description">
				Access our collection of guides, handbooks, and emergency contact information to help you
				navigate your journey as a migrant worker.
			</p>
		</div>

		<div class="resources-tabs">
			<button class="tab-button active" data-tab="emergency">Emergency Contacts</button>
			<button class="tab-button" data-tab="guides">Guides & Handbooks</button>
			<button class="tab-button" data-tab="legal">Legal Resources</button>
			<button class="tab-button" data-tab="support">Support Services</button>
		</div>

		<section id="emergency" class="tab-content active">
			<div class="section-header">
				<h2>Emergency Contacts</h2>
				<div class="country-filter">
					<label for="country-select">Filter by Country:</label>
					<select id="country-select">
						<option value="all">All Countries</option>
						{#each countries as country}
							<option value={country.code}>{country.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="contacts-grid">
				{#each filteredCountries as country}
					<div class="contact-card">
						<div class="country-header">
							<span class="fi fi-{country.code}"></span>
							<h3>{country.name}</h3>
						</div>
						<div class="contact-section">
							<h4>Embassy Information</h4>
							<div class="contact-info">
								<p><strong>{country.embassy.name}</strong></p>
								<p>{country.embassy.address}</p>
								<p>Phone: {country.embassy.phone}</p>
								<p>Emergency: {country.embassy.emergency}</p>
								<p>Email: {country.embassy.email}</p>
								<a href={country.embassy.website} target="_blank" rel="noopener noreferrer"
									>Visit Website</a
								>
							</div>
						</div>
						<div class="contact-section">
							<h4>Emergency Numbers</h4>
							<div class="contact-info">
								<p>Police: {country.emergency.police}</p>
								<p>Ambulance: {country.emergency.ambulance}</p>
								<p>Fire: {country.emergency.fire}</p>
								<p>Traffic Police: {country.emergency.traffic}</p>
							</div>
						</div>
						<div class="contact-section">
							<h4>Support Organizations</h4>
							<div class="contact-info">
								<p><strong>{country.support.name}</strong></p>
								<p>Phone: {country.support.phone}</p>
								<a href={country.support.website} target="_blank" rel="noopener noreferrer"
									>Visit Website</a
								>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section id="guides" class="tab-content">
			<div class="section-header">
				<h2>Guides & Handbooks</h2>
			</div>
			<div class="resources-grid">
				{#each resourceGuides as category}
					<div class="resource-category">
						<h3>{category.title}</h3>
						<div class="resource-items">
							{#each category.items as item}
								<div class="resource-card">
									<div class="resource-info">
										<h4>{item.title}</h4>
										<p>{item.description}</p>
										<div class="resource-meta">
											<span class="type">{item.type}</span>
											<span class="size">{item.size}</span>
										</div>
									</div>
									<a href={item.url} class="download-button">Download</a>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section id="legal" class="tab-content">
			<div class="section-header">
				<h2>Legal Resources</h2>
			</div>
			<div class="resources-grid">
				{#each legalResources as category}
					<div class="resource-category">
						<h3>{category.title}</h3>
						<div class="resource-items">
							{#each category.items as item}
								<div class="resource-card">
									<div class="resource-info">
										<h4>{item.title}</h4>
										<p>{item.description}</p>
										<div class="resource-meta">
											<span class="type">{item.type}</span>
											<span class="size">{item.size}</span>
										</div>
									</div>
									<a href={item.url} class="download-button">Download</a>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section id="support" class="tab-content">
			<div class="section-header">
				<h2>Support Services</h2>
			</div>
			<div class="support-services-grid">
				{#each supportServices as service}
					<div class="support-card">
						<h3>{service.name}</h3>
						<p class="service-description">{service.description}</p>
						<div class="service-contact">
							<p><i class="fas fa-phone"></i> {service.contact}</p>
							<p>
								<i class="fas fa-globe"></i>
								<a href={service.website} target="_blank" rel="noopener noreferrer"
									>{service.website}</a
								>
							</p>
						</div>
						<div class="service-offerings">
							<h4>Services Offered:</h4>
							<ul>
								{#each service.services as item}
									<li>
										<i class="fas fa-check-circle"></i>
										{item}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>
</main>

<style>
	/* Add any additional styles specifically for this page */
	.resources-page {
		padding: 60px 0;
	}

	/* Ensure tab content is hidden by default */
	.tab-content {
		display: none;
	}

	/* Show active tab content */
	.tab-content.active {
		display: block;
	}

	/* Additional tab styling */
	.resources-tabs {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 2rem;
		border-bottom: 1px solid #e5e5e5;
	}

	.tab-button {
		padding: 0.8rem 1.5rem;
		background: none;
		border: none;
		font-weight: 500;
		color: #666;
		cursor: pointer;
		border-bottom: 3px solid transparent;
		transition: all 0.3s ease;
	}

	.tab-button.active {
		color: #007bff;
		border-bottom: 3px solid #007bff;
	}

	.tab-button:hover {
		color: #007bff;
	}

	/* Support Services Grid */
	.support-services-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.support-card {
		background-color: white;
		border-radius: 0.75rem;
		padding: 2rem;
		box-shadow:
			0 4px 6px rgba(0, 0, 0, 0.05),
			0 1px 3px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.3s,
			box-shadow 0.3s;
		border: 1px solid rgba(226, 232, 240, 0.6);
	}

	.support-card:hover {
		transform: translateY(-5px);
		box-shadow:
			0 10px 15px rgba(0, 0, 0, 0.05),
			0 4px 6px rgba(0, 0, 0, 0.05);
	}

	.support-card h3 {
		color: #2d3748;
		font-size: 1.4rem;
		font-weight: 600;
		margin-bottom: 1rem;
		position: relative;
		padding-bottom: 1rem;
	}

	.support-card h3:after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 40px;
		height: 3px;
		background-color: #3182ce;
		border-radius: 3px;
	}

	.service-description {
		color: #4a5568;
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.service-contact {
		background-color: #f7fafc;
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.service-contact p {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.service-contact p:last-child {
		margin-bottom: 0;
	}

	.service-contact i {
		color: #3182ce;
		margin-right: 0.5rem;
		width: 20px;
		text-align: center;
	}

	.service-contact a {
		color: #3182ce;
		text-decoration: none;
		transition: color 0.2s;
	}

	.service-contact a:hover {
		color: #2b6cb0;
		text-decoration: underline;
	}

	.service-offerings h4 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #2d3748;
	}

	.service-offerings ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.service-offerings li {
		display: flex;
		align-items: flex-start;
		margin-bottom: 0.5rem;
		color: #4a5568;
	}

	.service-offerings i {
		color: #38a169;
		margin-right: 0.5rem;
		transform: translateY(4px);
	}

	@media (max-width: 768px) {
		.support-services-grid {
			grid-template-columns: 1fr;
		}

		.support-card {
			padding: 1.5rem;
		}
	}
</style>
