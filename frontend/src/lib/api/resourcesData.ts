// Types for resources data
export interface Country {
	code: string;
	name: string;
	embassy: {
		name: string;
		address: string;
		phone: string;
		emergency: string;
		email: string;
		website: string;
	};
	emergency: {
		police: string;
		ambulance: string;
		fire: string;
		traffic: string;
	};
	support: {
		name: string;
		phone: string;
		website: string;
	};
}

export interface ResourceGuide {
	title: string;
	description: string;
	type: string;
	size: string;
	url: string;
}

export interface ResourceCategory {
	title: string;
	items: ResourceGuide[];
}

export interface LegalResource {
	title: string;
	description: string;
	type: string;
	size: string;
	url: string;
}

export interface LegalCategory {
	title: string;
	items: LegalResource[];
}

export interface SupportService {
	name: string;
	description: string;
	contact: string;
	website: string;
	services: string[];
}

// Mock data
export const countries: Country[] = [
	{
		code: 'kw',
		name: 'Kuwait',
		embassy: {
			name: 'Embassy of Nepal in Kuwait',
			address: 'Block 1, Street 1, House 1, Kuwait City',
			phone: '+965 12345678',
			emergency: '+965 98765432',
			email: 'nepalembassy.kuwait@mofa.gov.np',
			website: 'https://kuwait.nepalembassy.gov.np'
		},
		emergency: {
			police: '112',
			ambulance: '101',
			fire: '102',
			traffic: '180'
		},
		support: {
			name: 'Kuwait Red Crescent Society',
			phone: '+965 12345678',
			website: 'https://www.krcs.org.kw'
		}
	},
	{
		code: 'qa',
		name: 'Qatar',
		embassy: {
			name: 'Embassy of Nepal in Qatar',
			address: 'Al Hilal Area, Doha',
			phone: '+974 12345678',
			emergency: '+974 98765432',
			email: 'nepalembassy.qatar@mofa.gov.np',
			website: 'https://qatar.nepalembassy.gov.np'
		},
		emergency: {
			police: '999',
			ambulance: '999',
			fire: '999',
			traffic: '999'
		},
		support: {
			name: 'Qatar Red Crescent Society',
			phone: '+974 12345678',
			website: 'https://www.qrcs.org.qa'
		}
	},
	{
		code: 'sa',
		name: 'Saudi Arabia',
		embassy: {
			name: 'Embassy of Nepal in Saudi Arabia',
			address: 'Diplomatic Quarter, Riyadh',
			phone: '+966 12345678',
			emergency: '+966 98765432',
			email: 'nepalembassy.riyadh@mofa.gov.np',
			website: 'https://sa.nepalembassy.gov.np'
		},
		emergency: {
			police: '999',
			ambulance: '997',
			fire: '998',
			traffic: '993'
		},
		support: {
			name: 'Saudi Red Crescent Authority',
			phone: '+966 12345678',
			website: 'https://www.srca.org.sa'
		}
	},
	{
		code: 'ae',
		name: 'UAE',
		embassy: {
			name: 'Embassy of Nepal in UAE',
			address: 'Al Safa 2, Dubai',
			phone: '+971 12345678',
			emergency: '+971 98765432',
			email: 'nepalembassy.uae@mofa.gov.np',
			website: 'https://ae.nepalembassy.gov.np'
		},
		emergency: {
			police: '999',
			ambulance: '998',
			fire: '997',
			traffic: '901'
		},
		support: {
			name: 'Emirates Red Crescent',
			phone: '+971 12345678',
			website: 'https://www.rcuae.ae'
		}
	}
];

export const resourceGuideCategories: ResourceCategory[] = [
	{
		title: 'Pre-Departure Guides',
		items: [
			{
				title: 'Pre-Departure Checklist',
				description: 'Essential items and documents to prepare before leaving Nepal',
				type: 'PDF',
				size: '1.2 MB',
				url: '#'
			},
			{
				title: 'Cultural Preparation Guide',
				description: 'Understanding cultural differences and adapting to new environments',
				type: 'PDF',
				size: '2.1 MB',
				url: '#'
			}
		]
	},
	{
		title: 'Worker Rights',
		items: [
			{
				title: 'Labor Rights Handbook',
				description: 'Comprehensive guide to your rights as a worker in different countries',
				type: 'PDF',
				size: '3.5 MB',
				url: '#'
			},
			{
				title: 'Wage Protection Guide',
				description: 'Understanding wage protection systems in Gulf countries',
				type: 'PDF',
				size: '1.7 MB',
				url: '#'
			}
		]
	},
	{
		title: 'Health & Safety',
		items: [
			{
				title: 'Health Insurance Guide',
				description: 'Accessing healthcare and insurance in your host country',
				type: 'PDF',
				size: '2.3 MB',
				url: '#'
			},
			{
				title: 'Workplace Safety Manual',
				description: 'Safety procedures and protocols for construction and domestic workers',
				type: 'PDF',
				size: '4.1 MB',
				url: '#'
			}
		]
	}
];

export const legalCategories: LegalCategory[] = [
	{
		title: 'Legal Rights & Protection',
		items: [
			{
				title: "Workers' Rights Handbook",
				description: 'Comprehensive guide to labor rights in major destination countries',
				type: 'PDF',
				size: '3.5 MB',
				url: '#'
			},
			{
				title: 'Legal Assistance Guide',
				description: 'How to access legal support when facing workplace issues',
				type: 'PDF',
				size: '2.1 MB',
				url: '#'
			}
		]
	},
	{
		title: 'Contract & Documentation',
		items: [
			{
				title: 'Employment Contract Guide',
				description: 'Understanding your employment contract terms and conditions',
				type: 'PDF',
				size: '1.8 MB',
				url: '#'
			},
			{
				title: 'Document Verification Checklist',
				description: 'Essential documents needed for work abroad and verification process',
				type: 'PDF',
				size: '1.2 MB',
				url: '#'
			}
		]
	}
];

export const supportServices: SupportService[] = [
	{
		name: 'Pravasi Nepali Coordination Center',
		description: 'Support network for Nepali migrant workers facing difficulties abroad',
		contact: '+977-1-4423941',
		website: 'https://www.pncc.org.np',
		services: [
			'Legal consultation',
			'Repatriation assistance',
			'Family coordination',
			'Case documentation'
		]
	},
	{
		name: 'Nepal Migrant Workers Support Center',
		description: 'Government service center for migrant workers and their families',
		contact: '+977-1-4102266',
		website: 'https://dofe.gov.np',
		services: [
			'Pre-departure orientation',
			'Complaint handling',
			'Compensation claims',
			'Insurance support'
		]
	},
	{
		name: "Migrant Workers' Rights Protection Committee",
		description: 'Advocacy organization working to protect the rights of Nepali migrant workers',
		contact: '+977-1-4720123',
		website: 'https://www.mwrpc.org',
		services: [
			'Rights advocacy',
			'Policy recommendations',
			'Worker education',
			'Research and documentation'
		]
	}
];

// API functions
export function getCountries() {
	return countries;
}

export function getCountryByCode(code: string) {
	return countries.find((country) => country.code === code);
}

export function getResourceGuides() {
	return resourceGuideCategories;
}

export function getLegalResources() {
	return legalCategories;
}

export function getSupportServices() {
	return supportServices;
}
