import {
	getCountries,
	getLegalResources,
	getResourceGuides,
	getSupportServices
} from '$lib/api/resourcesData';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	// Load all data for the resources page
	const countries = getCountries();
	const resourceGuides = getResourceGuides();
	const legalResources = getLegalResources();
	const supportServices = getSupportServices();

	return {
		countries,
		resourceGuides,
		legalResources,
		supportServices
	};
};
