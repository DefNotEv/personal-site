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

// Globe initialization and animation
function initGlobe() {
    const container = document.getElementById('globe-container');
    const canvas = document.getElementById('globe-canvas');
    
    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    
    // Create globe
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');

    // Create custom shader material
    const material = new THREE.ShaderMaterial({
        uniforms: {
            earthTexture: { value: texture },
            time: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D earthTexture;
            uniform float time;
            varying vec2 vUv;
            varying vec3 vNormal;
            
            void main() {
                vec4 texColor = texture2D(earthTexture, vUv);
                float brightness = (texColor.r + texColor.g + texColor.b) / 3.0;
                
                if (brightness > 0.25) {
                    // White land with glow
                    float glow = 0.5 + 0.5 * sin(time * 2.0);
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) + vec4(0.8, 0.8, 0.8, 0.0) * glow;
                } else {
                    // Cool-toned dark ocean
                    gl_FragColor = vec4(0.1, 0.12, 0.15, 1.0);
                }
                
                // Add subtle rim lighting
                float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
                gl_FragColor.rgb += vec3(0.1, 0.15, 0.2) * pow(rim, 3.0);
            }
        `
    });

    const globe = new THREE.Mesh(geometry, material);
    // Set initial rotation to show Australia (approximately 120 degrees)
    globe.rotation.y = Math.PI * 2/3;
    scene.add(globe);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.002; // Slowed down from 0.005
        material.uniforms.time.value += 0.005; // Slowed down from 0.01
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    animate();
}

// Initialize globe when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initGlobe();
});
