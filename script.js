// App click transition functionality
window.addEventListener('load', function() {
    const phoneContainer = document.getElementById('phone-container');
    const phoneApp = document.getElementById('click-prompt');
    const loadingScreen = document.getElementById('loading-screen');
    const textLines = document.querySelectorAll('.text-line');
    const disclaimer = document.querySelector('.disclaimer');
    const leftSquare = document.querySelector('.square-wrapper.left .square');

    // Add click event listener to the left square
    leftSquare.addEventListener('click', function() {
        // Create and add fade overlay
        const fadeOverlay = document.createElement('div');
        fadeOverlay.style.position = 'fixed';
        fadeOverlay.style.top = '0';
        fadeOverlay.style.left = '0';
        fadeOverlay.style.width = '100%';
        fadeOverlay.style.height = '100%';
        fadeOverlay.style.backgroundColor = '#000';
        fadeOverlay.style.opacity = '0';
        fadeOverlay.style.transition = 'opacity 0.5s ease';
        fadeOverlay.style.zIndex = '10000';
        document.body.appendChild(fadeOverlay);

        // Create phone container clone
        const phoneClone = phoneContainer.cloneNode(true);
        phoneClone.style.position = 'fixed';
        phoneClone.style.top = '0';
        phoneClone.style.left = '0';
        phoneClone.style.width = '100%';
        phoneClone.style.height = '100%';
        phoneClone.style.backgroundColor = '#fff';
        phoneClone.style.display = 'flex';
        phoneClone.style.justifyContent = 'center';
        phoneClone.style.alignItems = 'center';
        phoneClone.style.zIndex = '9999';
        phoneClone.style.opacity = '0';
        phoneClone.style.transition = 'opacity 0.5s ease';
        document.body.appendChild(phoneClone);

        // Trigger fade
        setTimeout(() => {
            fadeOverlay.style.opacity = '1';
            // After black fade completes, fade in phone
            setTimeout(() => {
                phoneClone.style.opacity = '1';
                // After phone fade completes, reload the page
                setTimeout(() => {
                    localStorage.removeItem('hasSeenAnimation');
                    window.location.reload();
                }, 500);
            }, 500);
        }, 0);
    });

    // Check if user has already seen the animation
    if (localStorage.getItem('hasSeenAnimation')) {
        // Skip animation and remove phone container
        phoneContainer.remove();
        return;
    }

    // Add click event listener to the app
    phoneApp.addEventListener('click', startLoading);

    function startLoading() {
        // Remove click event listener to prevent multiple triggers
        phoneApp.removeEventListener('click', startLoading);

        // Set flag in localStorage
        localStorage.setItem('hasSeenAnimation', 'true');

        // Fade in the black overlay
        const overlay = document.querySelector('.phone-overlay');
        overlay.classList.add('fade-in');
        
        // After the fade to black, show the loading screen
        setTimeout(() => {
            // Remove the phone container
            phoneContainer.remove();
            
            // Add fade-in class to the loading screen
            loadingScreen.classList.add('fade-in');
            
            // Wait a bit longer before showing the text
            setTimeout(() => {
                // Add fade-in class to all text lines
                textLines.forEach(line => {
                    line.classList.add('fade-in');
                });

                // Fade in the disclaimer
                disclaimer.classList.add('fade-in');

                // Play audio when text fades in
                const loadingAudio = document.getElementById('loading-audio');
                loadingAudio.play().catch(error => {
                    console.error('Error playing audio:', error);
                });

                // Wait for text to fade in, then fade out
                setTimeout(() => {
                    // Fade out text lines
                    textLines.forEach(line => {
                        line.classList.remove('fade-in');
                        line.style.opacity = '0';
                    });

                    // Fade out the disclaimer
                    disclaimer.classList.remove('fade-in');
                    disclaimer.style.opacity = '0';

                    // Then fade out the loading screen
                    setTimeout(() => {
                        loadingScreen.classList.add('fade-out');
                        // Play fade-out audio
                        const fadeOutAudio = document.getElementById('fade-out-audio');
                        fadeOutAudio.play().catch(error => {
                            console.error('Error playing fade-out audio:', error);
                        });
                        // Remove the loading screen after the fade-out transition
                        setTimeout(() => {
                            loadingScreen.remove();
                        }, 300); // Match this with the fade-out transition duration
                    }, 300); // Time for text to fade out
                }, 2000); // Time for text to fade in
            }, 500); // Additional delay before showing text
        }, 300); // Time for overlay to fade in
    }
});

// Navigation scrolling functionality
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const parallelogramSection = document.querySelector('.parallelogram-section');

    // Function to update active nav item
    function updateActiveNavItem(sectionId) {
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
    }

    // Function to check which section is in view
    function checkVisibleSection() {
        const scrollLeft = parallelogramSection.scrollLeft;
        const containerWidth = parallelogramSection.clientWidth;
        const sections = document.querySelectorAll('.parallelogram:not(.project)');
        
        let activeSection = null;
        let minDistance = Infinity;

        sections.forEach(section => {
            const sectionLeft = section.offsetLeft;
            const sectionWidth = section.offsetWidth;
            const sectionCenter = sectionLeft + (sectionWidth / 2);
            const viewportCenter = scrollLeft + (containerWidth / 2);
            const distance = Math.abs(sectionCenter - viewportCenter);

            if (distance < minDistance) {
                minDistance = distance;
                activeSection = section;
            }
        });

        if (activeSection) {
            if (activeSection.id === 'about-me' || activeSection.id === 'about-me-skills') {
                updateActiveNavItem('about-me');
            } else if (activeSection.id === 'projects') {
                updateActiveNavItem('projects');
            } else {
                updateActiveNavItem(activeSection.id);
            }
        }
    }

    // Add scroll event listener
    parallelogramSection.addEventListener('scroll', checkVisibleSection);

    // Initial check
    checkVisibleSection();

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            
            if (targetSection) {
                const scrollPosition = targetSection.offsetLeft - 100; // Account for left padding
                parallelogramSection.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
                updateActiveNavItem(sectionId);
            }
        });
    });
});

// EmailJS Configuration and Form Handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    emailjs.init("x72-g1bNU2IhaUCoJ"); // Replace with your actual public key

    const contactForm = document.querySelector('.contact-form');
    const sendButton = document.querySelector('.send-button');
    const nameInput = document.querySelector('.name-input');
    const emailInput = document.querySelector('.email-input');
    const messageInput = document.querySelector('.message-input');

    sendButton.addEventListener('click', function(e) {
        e.preventDefault();

        // Basic form validation
        if (!nameInput.value || !emailInput.value || !messageInput.value) {
            alert('Please fill in all fields');
            return;
        }

        // Show loading state
        sendButton.textContent = 'SENDING...';
        sendButton.disabled = true;

        // Prepare template parameters
        const templateParams = {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        };

        // Send email using EmailJS
        emailjs.send('service_17t42a9', 'template_yz4k2f8', templateParams)
            .then(function(response) {
                // Success
                alert('Message sent successfully!');
                // Clear form
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';
            }, function(error) {
                // Error
                alert('Failed to send message. Please try again.');
                console.error('EmailJS error:', error);
            })
            .finally(function() {
                // Reset button state
                sendButton.textContent = 'SEND MESSAGE';
                sendButton.disabled = false;
            });
    });
});
