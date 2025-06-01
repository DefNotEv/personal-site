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

    // Add click event listener to the first app (computer)
    phoneApp.addEventListener('click', startLoading);

    function startLoading() {
        // Remove click event listeners to prevent multiple triggers
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
    if (parallelogramSection) {
        parallelogramSection.addEventListener('scroll', checkVisibleSection);
        // Initial check
        checkVisibleSection();
    }

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            
            if (targetSection && parallelogramSection) {
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

// 3D Camera Model
function initCameraModel() {
    const container = document.getElementById('camera-container');
    if (!container) return;

    const canvas = document.getElementById('camera-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create camera body
    const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

    // Create lens
    const lensGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const lensMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 0.6;

    // Create viewfinder
    const viewfinderGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const viewfinderMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const viewfinder = new THREE.Mesh(viewfinderGeometry, viewfinderMaterial);
    viewfinder.position.set(0.7, 0.5, 0);

    // Group all parts
    const cameraModel = new THREE.Group();
    cameraModel.add(body);
    cameraModel.add(lens);
    cameraModel.add(viewfinder);
    scene.add(cameraModel);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        cameraModel.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    animate();
}

// Initialize camera model when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initCameraModel();
});

// Popup functionality for skill parallelograms
document.addEventListener('DOMContentLoaded', function() {
    const skillParallelograms = document.querySelectorAll('.skill-parallelogram');
    
    // Create popup overlay
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    document.body.appendChild(popupOverlay);

    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    popupOverlay.appendChild(popupContent);

    // Add the small red parallelogram
    const popupParallelogram = document.createElement('div');
    popupParallelogram.className = 'popup-parallelogram';
    popupContent.appendChild(popupParallelogram);

    // Add click event listener to the parallelogram to close the popup
    popupParallelogram.addEventListener('click', function() {
        popupOverlay.style.display = 'none';
    });

    // Add the 3px bar as a child for the third bar
    const popupBar2 = document.createElement('div');
    popupBar2.className = 'popup-content-bar-2';
    popupContent.appendChild(popupBar2);

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-popup';
    closeButton.innerHTML = '×';
    popupContent.appendChild(closeButton);

    // Create title element
    const popupTitle = document.createElement('h2');
    popupTitle.className = 'popup-title';
    popupContent.appendChild(popupTitle);

    // Create text element
    const popupText = document.createElement('div');
    popupText.className = 'popup-text';
    popupContent.appendChild(popupText);

    // Create image container for education popup
    const imageContainer = document.createElement('div');
    imageContainer.className = 'education-images';
    popupContent.appendChild(imageContainer);

    // Define popup content for each skill
    const popupContents = {
        'education': {
            title: 'Education',
            text: 'I\'m a grade 12 student @ Unionville H.S, where I am enrolled in the STEM program and Information-Communication Technology SHSM. This fall, I\'ll be heading to Purdue to study Motorsports Engineering—because if you\'re going to obsess over fast cars, you might as well get a degree out of it.',
            images: true
        },
        'sports': {
            title: 'Sports',
            text: 'I am trying to beat the stigma that engineers dont touch grass, so I play a lot of sports. In high school, I did varsity snowboarding, rock climbing, mountain biking, slo-pitch, flag football, and track/field. I somehow ended up ranked 56th in Ontario for girls alpine snowboarding, which is one of my proudest accomplishments. So whether competitive or just for fun, sports have always been part of my day.',
            images: true
        },
        'side-quests': {
            title: 'Side Quests',
            text: 'I\'ve always had a habit of wandering off the main path, and honestly? That\'s where some of the coolest moments have happened. Like spending a month at Shad UBC in 2023, where I lived with 50 strangers, created wild ideas, and realized how much I love brainstorming at 1AM. Or guest speaking at EmpowerED, where I got to talk about STEM outreach and probably overshared about robots. I also somehow got a song I wrote featured in an exhibit at the Royal Ontario Museum. In the competition realm, I lead my team to win the Real World Design Challenge in 2023 and become regional finalists in the Samsung Solve for Tomorrow 2025 challenge. None of these were part of the "plan," but all of them pushed me, shaped me, and reminded me that the detours are sometimes the best part of the adventure.',
            links: [
                { name: 'Shad Canada', url: 'https://www.shad.ca/' },
                { name: 'Real World Design Challenge', url: 'https://www.realworlddesignchallenge.org/' },
                { name: 'Samsung Solve for Tomorrow', url: 'https://www.samsung.com/ca/sustainability/corporate-citizenship/solve-for-tomorrow/' },
                { name: '#MyPandemicStory ROM Exhibit', url: 'https://www.rom.on.ca/en/exhibitions-galleries/exhibitions/mypandemicstory' },
                { name: 'EmpowerED', url: 'https://www.linkedin.com/company/em-empower-ed/' }
            ]
        },
        'marketing': {
            title: 'Marketing',
            text: 'My marketing experience started with me making brainrot—and somehow, I went viral. Apart from the projects in my resume, I got to do lots of freelance, plus work at Atlos Media under our favourite uni influencer limmytalks. I\'ve made really bad viral Instagram reels for everything from zombie-themed coding events to robotics fundraisers, and if there\'s one thing I\'ve learned, it\'s that good marketing isn\'t about being loud—it\'s about being clever, clear, and just a little bit chaotic. I am always looking for freelance work, so let me know how I can help!',
            instagram: [
                { handle: '@hackathoncanada', url: 'https://www.instagram.com/hackathoncanada' },
                { handle: '@roboticsuhs', url: 'https://www.instagram.com/roboticsuhs' },
                { handle: '@apohacks', url: 'https://www.instagram.com/apohacks' },
                { handle: '@frc7902', url: 'https://www.instagram.com/frc7902' },
                { handle: '@hack49__', url: 'https://www.instagram.com/hack49__' },
                { handle: '@hackcanada', url: 'https://www.instagram.com/hackcanada' },
                { handle: '@samthewolfofficial', url: 'https://www.instagram.com/samthewolfofficial' },
                { handle: '@uhsavteam', url: 'https://www.instagram.com/uhsavteam' },
                { handle: '@uhschemistryclub', url: 'https://www.instagram.com/uhschemistryclub' },
                { handle: '@unionvillescienceclub', url: 'https://www.instagram.com/unionvillescienceclub' },
                { handle: '@_bwomp', url: 'https://www.instagram.com/_bwomp' },
                { handle: '@realevwong', url: 'https://www.instagram.com/realevwong' }
            ]
        },
        'clubs': {
            title: 'Clubs',
            text: 'Some people dabble in one club, but I said, "why not all of them?" I\'ve hopped around everything from building robots to writing songs about them. Whether it\'s running audio-visual for school events, doing design competitions, or staying after hours for chess club showdowns, I\'ve always found a way to nerd out with people who love learning as much as I do. DECA taught me how to pitch, chemistry taught me how to not accidentally blow things up (usually), and robotics taught me how to build from scratch—both machines and resilience.',
            images: true,
            clubs: [
                { image: 'images/clubs1.jpg', name: 'A/V' },
                { image: 'images/clubs2.jpg', name: 'DECA' },
                { image: 'images/clubs3.jpg', name: 'Chemistry ' },
                { image: 'images/clubs4.jpg', name: 'Robotics' },
                { image: 'images/clubs5.jpg', name: 'Science' }
            ]
        },
        'fun-facts': {
            title: 'Fun Facts',
            text: '• I have over 2,000 volunteer hours<br>• I\'m first aid certified and I\'ve been doing childcare for 6 years<br>• I can play 7 instruments! Or at least I could, idk if i could still play my elementary school band saxophone.<br>• I\'ve attended 7 hackathons and won awards at 3 of them. Never won an overall prize though<br>• I have more LinkedIn connections than Instagram followers. I don\'t know how to recover from that.<br>• I can read Aurebesh (yes, the Star Wars language).<br>• I refuse to play clash of clans, but I have 21k brawl stars and 6.8k clash royale. I main piper and I have this really dumb hog rider-wall breaker deck'
        }
    };

    // Add click event listeners to skill parallelograms
    skillParallelograms.forEach((parallelogram, index) => {
        parallelogram.addEventListener('click', function() {
            const skillType = Object.keys(popupContents)[index];
            const content = popupContents[skillType];
            
            popupTitle.textContent = content.title;
            popupText.innerHTML = content.text;
            
            // Handle images for education popup
            if (content.images || content.instagram || content.links) {
                if (skillType === 'sports') {
                    imageContainer.innerHTML = `
                        <div class="sports-carousel">
                            <div class="carousel-container">
                                <img src="images/sports1.jpg" alt="Sports 1" class="carousel-slide active">
                                <img src="images/sports2.jpg" alt="Sports 2" class="carousel-slide">
                                <img src="images/sports3.jpg" alt="Sports 3" class="carousel-slide">
                                <img src="images/sports4.jpg" alt="Sports 4" class="carousel-slide">
                            </div>
                        </div>
                    `;
                    imageContainer.style.display = 'flex';
                    
                    // Initialize sports carousel
                    const carousel = imageContainer.querySelector('.sports-carousel');
                    const slides = carousel.querySelectorAll('.carousel-slide');
                    let currentSlide = 0;

                    function showSlide(index) {
                        slides.forEach(slide => slide.classList.remove('active'));
                        slides[index].classList.add('active');
                    }

                    function nextSlide() {
                        currentSlide = (currentSlide + 1) % slides.length;
                        showSlide(currentSlide);
                    }

                    // Auto-advance slides every 3 seconds
                    setInterval(nextSlide, 3000);
                } else if (skillType === 'marketing' && content.instagram) {
                    imageContainer.innerHTML = `
                        <div class="instagram-buttons">
                            ${content.instagram.map(account => `
                                <a href="${account.url}" target="_blank" class="instagram-button">
                                    <i class="fab fa-instagram"></i>
                                    ${account.handle}
                                </a>
                            `).join('')}
                        </div>
                    `;
                    imageContainer.style.display = 'flex';
                } else if (skillType === 'clubs' && content.clubs) {
                    imageContainer.innerHTML = `
                        <div class="clubs-scroll">
                            <div class="clubs-track">
                                ${content.clubs.map(club => `
                                    <div class="club-item">
                                        <img src="${club.image}" alt="${club.name}">
                                        <p>${club.name}</p>
                                    </div>
                                `).join('')}
                                ${content.clubs.map(club => `
                                    <div class="club-item">
                                        <img src="${club.image}" alt="${club.name}">
                                        <p>${club.name}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                    imageContainer.style.display = 'block';
                } else if (skillType === 'side-quests' && content.links) {
                    imageContainer.innerHTML = `
                        <div class="side-quest-buttons">
                            ${content.links.map(link => `
                                <a href="${link.url}" target="_blank" class="side-quest-button">
                                    ${link.name}
                                </a>
                            `).join('')}
                        </div>
                    `;
                    imageContainer.style.display = 'flex';
                } else {
                    imageContainer.innerHTML = `
                        <div class="education-image">
                            <img src="images/uhs.jpg" alt="Unionville High School" onclick="window.open('https://www.instagram.com/samthewolfofficial', '_blank')">
                            <p>my high school</p>
                        </div>
                        <div class="education-image">
                            <img src="images/purdue.jpeg" alt="Purdue University" onclick="window.open('https://www.purdue.edu/', '_blank')">
                            <p>my university</p>
                        </div>
                    `;
                    imageContainer.style.display = 'flex';
                }
            } else {
                imageContainer.style.display = 'none';
            }
            
            popupOverlay.style.display = 'flex';
        });
    });

    // Close popup when clicking the close button
    closeButton.addEventListener('click', function() {
        popupOverlay.style.display = 'none';
    });

    // Close popup when clicking outside the content
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            popupOverlay.style.display = 'none';
        }
    });
});
