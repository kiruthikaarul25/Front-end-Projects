// script.js - Complete Event Management System

// Event Data
const eventsData = [
    { id: 1, name: "Hackathon 2025", date: "April 15, 2025", description: "24-hour coding challenge. Build the future with innovative solutions.", category: "Tech", icon: "fa-code", maxParticipants: 200 },
    { id: 2, name: "Cultural Fest - Euphoria", date: "May 5, 2025", description: "Music, dance, art, and drama competitions. Showcase your talent!", category: "Cultural", icon: "fa-music", maxParticipants: 500 },
    { id: 3, name: "AI Workshop", date: "April 28, 2025", description: "Hands-on GenAI & ML workshop by industry experts.", category: "Workshop", icon: "fa-robot", maxParticipants: 100 },
    { id: 4, name: "Sports Meet 2025", date: "June 10, 2025", description: "Cricket, football, basketball, and more. Compete for glory!", category: "Sports", icon: "fa-futbol", maxParticipants: 300 },
    { id: 5, name: "Tech Symposium", date: "May 20, 2025", description: "Latest trends in technology, guest lectures, and networking.", category: "Tech", icon: "fa-microchip", maxParticipants: 250 },
    { id: 6, name: "Art Exhibition", date: "April 30, 2025", description: "Showcase your artistic skills. Painting, sculpture, digital art.", category: "Cultural", icon: "fa-palette", maxParticipants: 150 }
];

// Initialize Dark Mode
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (darkModeToggle) darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            if (document.body.hasAttribute('data-theme')) {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });
    }
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuIcon = document.getElementById('menuIcon');
    const navLinks = document.getElementById('navLinks');
    
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Load Events Page
function loadEventsPage() {
    const eventsGrid = document.getElementById('eventsGrid');
    const searchInput = document.getElementById('searchEvents');
    
    if (!eventsGrid) return;
    
    function displayEvents(events) {
        eventsGrid.innerHTML = events.map(event => `
            <div class="event-card glass-card" data-event-id="${event.id}">
                <div class="event-icon"><i class="fas ${event.icon}"></i></div>
                <h3>${event.name}</h3>
                <div class="event-date"><i class="fas fa-calendar-alt"></i> ${event.date}</div>
                <p>${event.description}</p>
                <div class="event-actions">
                    <button class="register-btn" onclick="redirectToRegister(${event.id}, '${event.name}')">
                        Register Now <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    displayEvents(eventsData);
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = eventsData.filter(event => 
                event.name.toLowerCase().includes(searchTerm) || 
                event.description.toLowerCase().includes(searchTerm) ||
                event.category.toLowerCase().includes(searchTerm)
            );
            displayEvents(filtered);
        });
    }
}

// Redirect to Register with event pre-selected
window.redirectToRegister = function(eventId, eventName) {
    localStorage.setItem('selectedEvent', JSON.stringify({ id: eventId, name: eventName }));
    window.location.href = 'register.html';
};

// Load Registration Form
function loadRegistrationForm() {
    const registrationForm = document.getElementById('registrationForm');
    const eventSelect = document.getElementById('eventSelect');
    
    if (!registrationForm) return;
    
    // Populate event dropdown
    if (eventSelect) {
        const selectedEventData = localStorage.getItem('selectedEvent');
        let preselectedEventName = '';
        
        if (selectedEventData) {
            const selected = JSON.parse(selectedEventData);
            preselectedEventName = selected.name;
        }
        
        eventSelect.innerHTML = '<option value="">Select an event</option>' + 
            eventsData.map(event => `
                <option value="${event.name}" ${preselectedEventName === event.name ? 'selected' : ''}>
                    ${event.name} - ${event.date}
                </option>
            `).join('');
        
        // Clear the stored selection after using it
        localStorage.removeItem('selectedEvent');
    }
    
    // Form submission
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const eventName = document.getElementById('eventSelect').value;
        
        // Validation
        let isValid = true;
        
        // Name validation
        if (name.length < 3) {
            showError('nameError', 'Name must be at least 3 characters');
            isValid = false;
        } else {
            clearError('nameError');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError('emailError');
        }
        
        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            showError('phoneError', 'Please enter a valid 10-digit phone number');
            isValid = false;
        } else {
            clearError('phoneError');
        }
        
        // Event validation
        if (!eventName) {
            showError('eventError', 'Please select an event');
            isValid = false;
        } else {
            clearError('eventError');
        }
        
        if (isValid) {
            // Get selected event details
            const selectedEvent = eventsData.find(e => e.name === eventName);
            
            // Save registration to localStorage
            const registration = {
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                eventName: eventName,
                eventDate: selectedEvent ? selectedEvent.date : 'TBD',
                registrationDate: new Date().toISOString()
            };
            
            // Get existing registrations
            let registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
            registrations.push(registration);
            localStorage.setItem('registrations', JSON.stringify(registrations));
            
            // Store current registration for dashboard
            localStorage.setItem('currentRegistration', JSON.stringify(registration));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    });
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Load Dashboard
function loadDashboard() {
    const dashboardContent = document.getElementById('dashboardContent');
    const backToHomeBtn = document.getElementById('backToHome');
    
    if (!dashboardContent) return;
    
    // Get current registration
    let registration = JSON.parse(localStorage.getItem('currentRegistration'));
    
    // If no current registration, try to get the latest one
    if (!registration) {
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        if (registrations.length > 0) {
            registration = registrations[registrations.length - 1];
        }
    }
    
    if (registration) {
        dashboardContent.innerHTML = `
            <div class="dashboard-card glass-card">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>🎉 Registration Successful!</h2>
                <p>Thank you for registering with EventFlow. We're excited to have you!</p>
                
                <div class="registered-event-details">
                    <h3><i class="fas fa-ticket-alt"></i> Your Event Details</h3>
                    <p><strong>Event Name:</strong> ${registration.eventName}</p>
                    <p><strong>Event Date:</strong> ${registration.eventDate}</p>
                    <p><strong>Registered On:</strong> ${new Date(registration.registrationDate).toLocaleDateString()}</p>
                    <hr style="margin: 1rem 0; border-color: var(--card-border);">
                    <p><strong>Registrant Name:</strong> ${registration.name}</p>
                    <p><strong>Email:</strong> ${registration.email}</p>
                    <p><strong>Phone:</strong> ${registration.phone}</p>
                </div>
                
                <div style="margin-top: 1.5rem;">
                    <button onclick="window.location.href='index.html'" class="btn-primary">
                        <i class="fas fa-home"></i> Back to Home
                    </button>
                </div>
            </div>
        `;
    } else {
        dashboardContent.innerHTML = `
            <div class="dashboard-card glass-card">
                <div class="success-icon" style="color: var(--danger);">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2>No Registration Found</h2>
                <p>You haven't registered for any events yet.</p>
                <div style="margin-top: 1.5rem;">
                    <button onclick="window.location.href='events.html'" class="btn-primary">
                        <i class="fas fa-calendar"></i> Browse Events
                    </button>
                </div>
            </div>
        `;
    }
    
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

// Initialize Active Navigation
function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Load Home Page Events
function loadHomeEvents() {
    const upcomingEventsGrid = document.getElementById('upcomingEventsGrid');
    if (upcomingEventsGrid) {
        const upcomingEvents = eventsData.slice(0, 3);
        upcomingEventsGrid.innerHTML = upcomingEvents.map(event => `
            <div class="event-card glass-card">
                <div class="event-icon"><i class="fas ${event.icon}"></i></div>
                <h3>${event.name}</h3>
                <div class="event-date"><i class="fas fa-calendar-alt"></i> ${event.date}</div>
                <p>${event.description}</p>
                <a href="register.html" class="btn-sm">Register →</a>
            </div>
        `).join('');
    }
}

// Initialize all components based on current page
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initMobileMenu();
    initActiveNav();
    
    // Load page-specific content
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '') {
        loadHomeEvents();
    } else if (currentPage === 'events.html') {
        loadEventsPage();
    } else if (currentPage === 'register.html') {
        loadRegistrationForm();
    } else if (currentPage === 'dashboard.html') {
        loadDashboard();
    }
});