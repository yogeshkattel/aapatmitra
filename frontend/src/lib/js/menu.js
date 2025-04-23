// Mobile menu toggle
function setupMobileMenu() {
	// Only run in browser environment
	if (typeof window !== 'undefined' && typeof document !== 'undefined') {
		const openMenuBtn = document.getElementById('openMenu');
		const closeMenuBtn = document.getElementById('closeMenu');
		const navLinks = document.getElementById('navLinks');

		if (openMenuBtn && closeMenuBtn && navLinks) {
			openMenuBtn.addEventListener('click', () => {
				navLinks.classList.add('active');
			});

			closeMenuBtn.addEventListener('click', () => {
				navLinks.classList.remove('active');
			});
		}
	}
}

// Call setup only in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
	document.addEventListener('DOMContentLoaded', setupMobileMenu);
}

export default setupMobileMenu;
