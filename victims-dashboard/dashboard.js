document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const closeModalBtn = document.querySelector('.close-modal');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const logoutBtn = document.getElementById('logout-btn');
  const userName = document.getElementById('user-name');
  const userRole = document.getElementById('user-role');
  
  // Filter elements
  const filterSource = document.getElementById('filter-source');
  const filterReport = document.getElementById('filter-report');
  
  // Check if user is logged in (using sessionStorage for demo purposes)
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  
  // Initialize the dashboard
  function initDashboard() {
    if (!isLoggedIn) {
      showLoginModal();
    } else {
      hideLoginModal();
      setUserInfo();
    }
    
    // Add event listeners
    setupEventListeners();
  }
  
  // Event listeners
  function setupEventListeners() {
    // Close modal
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', function() {
        loginModal.style.display = 'none';
      });
    }
    
    // Submit login form
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
    
    // Toggle sidebar
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Logout button
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Filter event listeners
    if (filterSource) {
      filterSource.addEventListener('change', filterMessages);
    }
    
    if (filterReport) {
      filterReport.addEventListener('change', filterMessages);
    }
    
    // Navigation event listeners
    setupNavigation();
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    });
    
    // Mark notifications as read
    const markReadBtn = document.querySelector('.notifications-section .btn-text');
    if (markReadBtn) {
      markReadBtn.addEventListener('click', markAllNotificationsAsRead);
    }
    
    // Individual notification actions
    const notificationButtons = document.querySelectorAll('.notification-actions .btn-icon');
    notificationButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        showNotificationMenu(this);
      });
    });
    
    // Print report button
    const printReportBtn = document.querySelector('.header-actions .btn-outline');
    if (printReportBtn) {
      printReportBtn.addEventListener('click', printReport);
    }
    
    // New report button
    const newReportBtn = document.querySelector('.header-actions .btn-primary');
    if (newReportBtn) {
      newReportBtn.addEventListener('click', createNewReport);
    }
    
    // View report buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const reportId = this.closest('tr').querySelector('td').textContent;
        viewReport(reportId);
      });
    });
    
    // Message buttons
    const messageButtons = document.querySelectorAll('.message-btn');
    messageButtons.forEach(button => {
      button.addEventListener('click', function() {
        const reportId = this.closest('tr').querySelector('td').textContent;
        viewMessages(reportId);
      });
    });
    
    // Reply buttons in message cards
    const replyButtons = document.querySelectorAll('.message-actions .btn-sm');
    replyButtons.forEach(button => {
      if (button.textContent.includes('Reply')) {
        button.addEventListener('click', function() {
          const messageCard = this.closest('.message-card');
          const sender = messageCard.querySelector('.sender-details h4').textContent;
          replyToMessage(sender);
        });
      }
    });
    
    // Handle window resize for responsive layout
    window.addEventListener('resize', handleResize);
  }
  
  // Login form submission
  function handleLogin(e) {
    e.preventDefault();
    
    const name = document.getElementById('login-name').value;
    const email = document.getElementById('login-email').value;
    const reportId = document.getElementById('login-report-id').value;
    
    // Validate inputs
    if (!name || !email || !reportId) {
      alert('Please fill in all fields');
      return;
    }
    
    // Store login info in sessionStorage for demo purposes
    sessionStorage.setItem('isLoggedIn', true);
    sessionStorage.setItem('userName', name);
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('reportId', reportId);
    
    // Update UI
    setUserInfo();
    hideLoginModal();
    
    // Show welcome notification
    showWelcomeNotification();
  }
  
  // Set user info in sidebar
  function setUserInfo() {
    const name = sessionStorage.getItem('userName');
    if (name && userName) {
      userName.textContent = name;
    }
  }
  
  // Toggle sidebar visibility
  function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Update toggle icon
    const toggleIcon = sidebarToggle.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
      toggleIcon.classList.remove('fa-bars');
      toggleIcon.classList.add('fa-arrow-right');
    } else {
      toggleIcon.classList.remove('fa-arrow-right');
      toggleIcon.classList.add('fa-bars');
    }
  }
  
  // Handle logout
  function handleLogout() {
    // Clear session storage
    sessionStorage.clear();
    
    // Show login modal
    showLoginModal();
    
    // Reset user info
    if (userName) {
      userName.textContent = 'Guest User';
    }
    
    if (userRole) {
      userRole.textContent = 'Temporary Access';
    }
  }
  
  // Show login modal
  function showLoginModal() {
    if (loginModal) {
      loginModal.style.display = 'flex';
    }
  }
  
  // Hide login modal
  function hideLoginModal() {
    if (loginModal) {
      loginModal.style.display = 'none';
    }
  }
  
  // Filter messages based on source and report
  function filterMessages() {
    const sourceValue = filterSource.value;
    const reportValue = filterReport.value;
    
    const messageCards = document.querySelectorAll('.message-card');
    
    messageCards.forEach(card => {
      let showBySource = true;
      let showByReport = true;
      
      // Check source filter
      if (sourceValue !== 'all') {
        if (!card.classList.contains(sourceValue)) {
          showBySource = false;
        }
      }
      
      // Check report filter
      if (reportValue !== 'all') {
        const reportTag = card.querySelector('.message-report').textContent;
        if (!reportTag.includes(reportValue)) {
          showByReport = false;
        }
      }
      
      // Show or hide the card
      if (showBySource && showByReport) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
    
    // Update message section header
    updateFilterHeader(sourceValue, reportValue);
  }
  
  // Update the filter section header
  function updateFilterHeader(source, report) {
    const headerText = document.querySelector('.messages-section .section-header p');
    
    if (source === 'all' && report === 'all') {
      headerText.textContent = 'Communications regarding your reports';
    } else if (source !== 'all' && report === 'all') {
      headerText.textContent = `Messages from ${getSourceName(source)} only`;
    } else if (source === 'all' && report !== 'all') {
      headerText.textContent = `Messages for report ${report} only`;
    } else {
      headerText.textContent = `Messages from ${getSourceName(source)} for report ${report}`;
    }
  }
  
  // Get source name from value
  function getSourceName(sourceValue) {
    switch(sourceValue) {
      case 'authority':
        return 'Authorities';
      case 'journalist':
        return 'Journalists';
      case 'ngo':
        return 'NGOs';
      default:
        return 'All sources';
    }
  }
  
  // Navigation setup
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    

  }
  
  // Update breadcrumb
  function updateBreadcrumb(pageName) {
    const breadcrumb = document.querySelector('.breadcrumb');
    const headerTitle = document.querySelector('.header-left h1');
    
    if (breadcrumb) {
      breadcrumb.textContent = `Home > ${pageName}`;
    }
    
    if (headerTitle) {
      headerTitle.textContent = pageName;
    }
  }
  
  // Show section (simplified for demo)
  function showSection(sectionId) {
    console.log(`Showing section: ${sectionId}`);
    // In a real app, you would show/hide sections or load content via AJAX
  }
  
  // Mark all notifications as read
  function markAllNotificationsAsRead() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    
    unreadNotifications.forEach(notification => {
      notification.classList.remove('unread');
    });
    
    // Update notification count
    updateNotificationCount();
    
    // Show confirmation message
    showToast('All notifications marked as read');
  }
  
  // Update notification count
  function updateNotificationCount() {
    const count = document.querySelectorAll('.notification-item.unread').length;
    const notificationCount = document.querySelector('.notification-count');
    
    if (notificationCount) {
      notificationCount.textContent = count;
      
      // Hide count badge if zero
      if (count === 0) {
        notificationCount.style.display = 'none';
      } else {
        notificationCount.style.display = 'flex';
      }
    }
  }
  
  // Show notification menu (dropdown)
  function showNotificationMenu(button) {
    console.log('Show notification options menu');
    // Implementation would create a dropdown near the clicked button
  }
  
  // Print report function
  function printReport() {
    console.log('Printing report...');
    window.print();
  }
  
  // Create new report
  function createNewReport() {
    console.log('Opening new report form');
    // In a real app, would show a form or redirect to report creation page
    alert('New report form would open here');
  }
  
  // View report details
  function viewReport(reportId) {
    console.log(`Viewing report ${reportId}`);
    // In a real app, would show report details or redirect
    alert(`Viewing details for report ${reportId}`);
  }
  
  // View messages for a specific report
  function viewMessages(reportId) {
    console.log(`Viewing messages for report ${reportId}`);
    
    // Set the filter to show only this report's messages
    if (filterReport) {
      // Extract the report ID from the full ID string
      const shortId = reportId.split('-').pop();
      filterReport.value = `R-${shortId}`;
      
      // Trigger the filter
      filterMessages();
      
      // Scroll to messages section
      document.querySelector('.messages-section').scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Reply to message
  function replyToMessage(sender) {
    console.log(`Opening reply form for message from ${sender}`);
    // In a real app, would show a reply form
    alert(`Reply to ${sender} would open here`);
  }
  
  // Show welcome notification
  function showWelcomeNotification() {
    // This would create and append a new notification in a real app
    console.log('Welcome notification shown');
  }
  
  // Show toast message
  function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Show and hide with animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');  
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
  
  // Handle window resize
  function handleResize() {
    if (window.innerWidth <= 992) {
      sidebar.classList.add('collapsed');
      mainContent.classList.add('expanded');
    }
  }
  
  // Add toast styles dynamically
  function addToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .toast-message {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-dark);
        color: white;
        padding: 12px 24px;
        border-radius: var(--radius);
        box-shadow: var(--shadow-md);
        z-index: 9999;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
      }
      
      .toast-message.show {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize
  addToastStyles();
  initDashboard();
  handleResize(); // Check initial window size
});