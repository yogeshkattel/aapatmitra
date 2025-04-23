<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	onMount(() => {
		// Timeline navigation
		const timelinePoints = document.querySelectorAll('.timeline-point');
		const processDetails = document.querySelectorAll('.process-detail');

		timelinePoints.forEach((point) => {
			point.addEventListener('click', function () {
				const step = this.getAttribute('data-step');

				// Update timeline points
				timelinePoints.forEach((p) => p.classList.remove('active'));
				this.classList.add('active');

				// Update process details
				processDetails.forEach((detail) => {
					detail.classList.remove('active');
					if (detail.getAttribute('data-step') === step) {
						detail.classList.add('active');
					}
				});
			});
		});

		// Stats animation
		const statCards = document.querySelectorAll('.stat-card');
		const statNumbers = document.querySelectorAll('.stat-number');

		const animateStats = () => {
			statCards.forEach((card) => {
				card.classList.add('animate');
			});

			statNumbers.forEach((numberElement) => {
				const targetCount = parseInt(numberElement.getAttribute('data-count'));
				let currentCount = 0;
				const duration = 2000; // ms
				const increment = targetCount > 100 ? 10 : 1;
				const interval = Math.floor(duration / (targetCount / increment));

				const counter = setInterval(() => {
					currentCount += increment;
					if (currentCount >= targetCount) {
						numberElement.textContent = targetCount.toLocaleString();
						clearInterval(counter);
					} else {
						numberElement.textContent = currentCount.toLocaleString();
					}
				}, interval);
			});
		};

		// Trigger animation when the element is in view
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						animateStats();
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (statCards.length > 0) {
			observer.observe(document.querySelector('.stats-container'));
		}
	});
</script>

<svelte:head>
	<title>Aapatmitra - Supporting Nepali Workers Abroad</title>
</svelte:head>

<section id="hero">
	<div class="container">
		<div class="hero-content">
			<h1>Emergency Support for Nepali Workers Abroad</h1>
			<p>Connecting vulnerable workers with immediate help through our rapid-response platform.</p>
			<div class="cta-buttons">
				<a href="/report" class="btn btn-primary">Get Help Now</a>
			</div>
		</div>
		<div class="hero-image">
			<img src="/images/banne.jpeg" alt="Nepali workers supported by Aapatmitra" />
		</div>
	</div>
</section>

<section id="emergency-bar">
	<div class="container">
		<div class="emergency-content">
			<div class="emergency-icon">
				<i class="fas fa-exclamation-triangle"></i>
			</div>
			<p>
				In immediate danger? Call our 24/7 emergency hotline:
				<strong>+977-9807930965</strong>
			</p>
			<a href="#" class="btn btn-urgent">SOS</a>
		</div>
	</div>
</section>

<section id="services">
	<div class="container">
		<div class="section-header">
			<h2>Our Services</h2>
			<p>How Aapatmitra supports Nepali workers abroad</p>
		</div>
		<div class="services-grid">
			<div class="service-card">
				<div class="service-icon">
					<i class="fas fa-hands-helping"></i>
				</div>
				<h3>Emergency Assistance</h3>
				<p>Immediate support for workers facing abuse, exploitation, or emergency situations.</p>
			</div>
			<div class="service-card">
				<div class="service-icon">
					<i class="fas fa-gavel"></i>
				</div>
				<h3>Legal Support</h3>
				<p>Connect with legal resources in your host country and understand your rights.</p>
			</div>
			<div class="service-card">
				<div class="service-icon">
					<i class="fas fa-comments"></i>
				</div>
				<h3>Direct Communication</h3>
				<p>Instant connection with Nepal Embassy, police, and human rights organizations.</p>
			</div>
			<div class="service-card">
				<div class="service-icon">
					<i class="fas fa-map-marked-alt"></i>
				</div>
				<h3>Location Tracking</h3>
				<p>Share your precise location with authorities for faster assistance.</p>
			</div>
		</div>
	</div>
</section>

<section id="how-it-works">
	<div class="container">
		<div class="section-header">
			<h2>How Aapatmitra Works</h2>
			<p>Simple steps to get the help you need</p>
		</div>

		<div class="timeline-container">
			<div class="timeline-track">
				<div class="timeline-point active" data-step="1">
					<div class="point-marker">
						<div class="point-icon">
							<i class="fas fa-edit"></i>
						</div>
						<span class="point-number">1</span>
					</div>
					<div class="point-label">Report</div>
				</div>

				<div class="timeline-point" data-step="2">
					<div class="point-marker">
						<div class="point-icon">
							<i class="fas fa-bell"></i>
						</div>
						<span class="point-number">2</span>
					</div>
					<div class="point-label">Notify</div>
				</div>

				<div class="timeline-point" data-step="3">
					<div class="point-marker">
						<div class="point-icon">
							<i class="fas fa-chart-line"></i>
						</div>
						<span class="point-number">3</span>
					</div>
					<div class="point-label">Track</div>
				</div>

				<div class="timeline-point" data-step="4">
					<div class="point-marker">
						<div class="point-icon">
							<i class="fas fa-hands-helping"></i>
						</div>
						<span class="point-number">4</span>
					</div>
					<div class="point-label">Assist</div>
				</div>
			</div>

			<div class="process-details">
				<div class="process-detail active" data-step="1">
					<div class="detail-content">
						<div class="detail-text">
							<h3>Report Your Situation</h3>
							<p>
								Use our app or website to describe your emergency, location, and current situation.
							</p>
							<ul class="detail-features">
								<li>
									<i class="fas fa-check-circle"></i> Easy-to-use form interface
								</li>
								<li>
									<i class="fas fa-check-circle"></i> Submit photos or voice notes
								</li>
								<li>
									<i class="fas fa-check-circle"></i> Works offline in emergencies
								</li>
							</ul>
						</div>
						<div class="detail-image">
							<img
								src="/images/report-vector.svg"
								alt="Report emergency situation"
								class="process-vector"
							/>
						</div>
					</div>
				</div>

				<div class="process-detail" data-step="2">
					<div class="detail-content">
						<div class="detail-text">
							<h3>Authorities Notified</h3>
							<p>
								Our system instantly alerts relevant authorities including Nepal Embassy, police,
								and support organizations.
							</p>
							<ul class="detail-features">
								<li>
									<i class="fas fa-check-circle"></i> Automatic geo-location based routing
								</li>
								<li>
									<i class="fas fa-check-circle"></i> SMS, email, and app notifications
								</li>
								<li>
									<i class="fas fa-check-circle"></i> Confirmation when authorities view your report
								</li>
							</ul>
						</div>
						<div class="detail-image">
							<img
								src="/images/notify-vector.svg"
								alt="Authorities notified"
								class="process-vector"
							/>
						</div>
					</div>
				</div>

				<div class="process-detail" data-step="3">
					<div class="detail-content">
						<div class="detail-text">
							<h3>Track Your Case</h3>
							<p>
								Monitor the progress of your case in real-time and stay updated on actions taken.
							</p>
							<ul class="detail-features">
								<li>
									<i class="fas fa-check-circle"></i> Real-time status updates
								</li>
								<li>
									<i class="fas fa-check-circle"></i> Direct messaging with case handlers
								</li>
								<li>
									<i class="fas fa-check-circle"></i> Document upload for additional evidence
								</li>
							</ul>
						</div>
						<div class="detail-image">
							<img
								src="/images/track-vector.svg"
								alt="Track case progress"
								class="process-vector"
							/>
						</div>
					</div>
				</div>

				<div class="process-detail" data-step="4">
					<div class="detail-content">
						<div class="detail-text">
							<h3>Receive Assistance</h3>
							<p>
								Get the help you need through our network of embassy officials, legal advisors, and
								support organizations.
							</p>
							<ul class="detail-features">
								<li>
									<i class="fas fa-check-circle"></i> Legal representation when needed
								</li>
								<li>
									<i class="fas fa-check-circle"></i> Medical assistance coordination
								</li>
								<li>
									<i class="fas fa-check-circle"></i> Support for repatriation if necessary
								</li>
							</ul>
						</div>
						<div class="detail-image">
							<img
								src="/images/assist-vector.svg"
								alt="Receive assistance"
								class="process-vector"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="impact">
	<div class="container">
		<div class="section-header">
			<h2>Our Impact</h2>
			<p>Supporting Nepali workers around the world</p>
		</div>

		<div class="stats-container">
			<div class="stat-card">
				<div class="stat-icon">
					<i class="fas fa-user-shield"></i>
				</div>
				<div class="stat-number" data-count="1500">0</div>
				<div class="stat-label">Workers Assisted</div>
				<div class="stat-description">
					We've provided direct support to workers in emergency situations.
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-icon">
					<i class="fas fa-globe-asia"></i>
				</div>
				<div class="stat-number" data-count="12">0</div>
				<div class="stat-label">Countries</div>
				<div class="stat-description">
					Our services span across major labor destination countries.
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-icon">
					<i class="fas fa-hands-helping"></i>
				</div>
				<div class="stat-number" data-count="24">0</div>
				<div class="stat-label">Partner Organizations</div>
				<div class="stat-description">
					Collaborated with embassies, NGOs, and government agencies.
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-icon">
					<i class="fas fa-phone-alt"></i>
				</div>
				<div class="stat-number" data-count="3000">0</div>
				<div class="stat-label">Support Calls</div>
				<div class="stat-description">
					Our hotline provides immediate assistance to workers in need.
				</div>
			</div>
		</div>
	</div>
</section>

<section id="partners">
	<div class="container">
		<div class="section-header">
			<h2>Our Partners</h2>
			<p>Working together to protect Nepali workers abroad</p>
		</div>

		<div class="partners-grid">
			<div class="partner-logo">
				<img src="/images/nepalpolice.jpg" alt="Nepal Police" />
				<p>Nepal Police</p>
			</div>
			<div class="partner-logo">
				<img src="/images/mofa.jpeg" alt="Ministry of Foreign Affairs" />
				<p>Ministry of Foreign Affairs</p>
			</div>
			<div class="partner-logo">
				<img src="/images/humanrights.jpeg" alt="Human Rights Commission" />
				<p>National Human Rights Commission</p>
			</div>
			<div class="partner-logo">
				<img src="/images/womenrights.jpeg" alt="Women's Rights Organization" />
				<p>Women's Rights Forum</p>
			</div>
			<div class="partner-logo">
				<img src="/images/International Labor NGO.jpeg" alt="International Labor Organization" />
				<p>International Labor Organization</p>
			</div>
			<div class="partner-logo">
				<img src="/images/global nepal network.jpeg" alt="Global Nepal Network" />
				<p>Global Nepal Network</p>
			</div>
		</div>
	</div>
</section>

<section id="contact">
	<div class="container">
		<div class="section-header">
			<h2>Contact Us</h2>
			<p>Reach out for more information or support</p>
		</div>

		<div class="contact-content">
			<div class="contact-info">
				<div class="contact-item">
					<div class="contact-icon">
						<i class="fas fa-map-marker-alt"></i>
					</div>
					<div class="contact-details">
						<h3>Location</h3>
						<p>Kathmandu, Nepal<br />Babarmahal, Kathmandu</p>
					</div>
				</div>

				<div class="contact-item">
					<div class="contact-icon">
						<i class="fas fa-phone-alt"></i>
					</div>
					<div class="contact-details">
						<h3>Phone</h3>
						<p>
							Emergency: +977-9807930965<br />Office: +977-01-4240112
						</p>
					</div>
				</div>

				<div class="contact-item">
					<div class="contact-icon">
						<i class="fas fa-envelope"></i>
					</div>
					<div class="contact-details">
						<h3>Email</h3>
						<p>
							support@aapatmitra.org<br />info@aapatmitra.org
						</p>
					</div>
				</div>
			</div>

			<div class="contact-form">
				<form>
					<div class="form-group">
						<label for="name">Your Name</label>
						<input type="text" id="name" name="name" placeholder="Enter your name" required />
					</div>
					<div class="form-group">
						<label for="email">Email Address</label>
						<input type="email" id="email" name="email" placeholder="Enter your email" required />
					</div>
					<div class="form-group">
						<label for="subject">Subject</label>
						<input
							type="text"
							id="subject"
							name="subject"
							placeholder="Enter your subject"
							required
						/>
					</div>
					<div class="form-group full-width">
						<label for="message">Message</label>
						<textarea id="message" name="message" rows="5" placeholder="Enter your message" required
						></textarea>
					</div>
					<button type="submit" class="btn btn-primary">Send Message</button>
				</form>
			</div>
		</div>
	</div>
</section>
