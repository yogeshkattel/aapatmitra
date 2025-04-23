/**
 * Resources page interaction functions
 */

// Activate a specific tab
export function activateTab(tabId: string) {
	// Hide all tab content
	const tabContents = document.querySelectorAll('.tab-content');
	tabContents.forEach((content) => {
		content.classList.remove('active');
	});

	// Deactivate all tab buttons
	const tabButtons = document.querySelectorAll('.tab-button');
	tabButtons.forEach((button) => {
		button.classList.remove('active');
	});

	// Activate the selected tab and its content
	const selectedTab = document.getElementById(tabId);
	if (selectedTab) {
		selectedTab.classList.add('active');
	}

	const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
	if (selectedButton) {
		selectedButton.classList.add('active');
	}
}

// Filter countries by country code
export function filterCountriesByCode(countryCode: string, countries: any[]): any[] {
	if (countryCode === 'all') {
		return countries;
	} else {
		return countries.filter((country) => country.code === countryCode);
	}
}

// Set up tab switching event listeners
export function setupTabSwitching(switchTabCallback: (tabId: string) => void) {
	const tabButtons = document.querySelectorAll('.tab-button');
	tabButtons.forEach((button) => {
		button.addEventListener('click', function (this: HTMLElement) {
			const tabId = this.getAttribute('data-tab');
			if (tabId) {
				// Visual update
				tabButtons.forEach((btn) => btn.classList.remove('active'));
				this.classList.add('active');

				// Callback to update state
				switchTabCallback(tabId);
			}
		});
	});
}

// Set up country filter event listener
export function setupCountryFilter(filterCallback: (countryCode: string) => void) {
	const countrySelect = document.getElementById('country-select') as HTMLSelectElement;
	if (countrySelect) {
		countrySelect.addEventListener('change', function () {
			filterCallback(this.value);
		});
	}
}
