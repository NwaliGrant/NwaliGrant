// ============================================
// EMAILJS - SIMPLIFIED WORKING VERSION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.error("❌ Contact form not found!");
        return;
    }

    console.log("📝 Setting up contact form...");

    // Your EmailJS credentials
    const EMAILJS_CONFIG = {
        publicKey: "GrqFYGbJvEMlFaMJF",
        serviceId: "service_40t0i3n",
        templateId: "template_zi2hnoo",
        autoReplyTemplateId: "template_mz4u1vx"
    };

    // Initialize EmailJS with public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log("✅ EmailJS initialized with public key");
    } else {
        console.error("❌ EmailJS not loaded!");
        return;
    }

    // Toast notification function
    function showToast(message, isSuccess = true) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `fixed bottom-6 right-6 px-6 py-4 rounded-lg text-white font-medium shadow-lg transition-all duration-300 z-50 ${
            isSuccess ? 'bg-green-500' : 'bg-red-500'
        } opacity-100 translate-y-0`;
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 3000);
    }

    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnContent = submitBtn.innerHTML;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="opacity-0">Sending</span>
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin"></div>
            </div>
        `;

        try {
            // Get form data
            const formData = {
                from_name: this.querySelector('[name="from_name"]')?.value.trim() || '',
                from_email: this.querySelector('[name="from_email"]')?.value.trim() || '',
                title: this.querySelector('[name="title"]')?.value.trim() || '',
                message: this.querySelector('[name="message"]')?.value.trim() || ''
            };

            // Validate
            if (!formData.from_name || !formData.from_email || !formData.message) {
                throw new Error('Please fill in all required fields');
            }

            console.log('📤 Sending email with data:', formData);

            // Method 1: Try using emailjs.sendForm (often more reliable)
            const response = await emailjs.sendForm(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                this,
                EMAILJS_CONFIG.publicKey  // Pass public key explicitly
            );

            console.log('✅ Email sent successfully:', response);

            // Optional: Send auto-reply
            try {
                await emailjs.sendForm(
                    EMAILJS_CONFIG.serviceId,
                    EMAILJS_CONFIG.autoReplyTemplateId,
                    this,
                    EMAILJS_CONFIG.publicKey
                );
                console.log('✅ Auto-reply sent');
            } catch (autoReplyError) {
                console.warn('⚠️ Auto-reply failed:', autoReplyError);
            }

            showToast('Message sent successfully!', true);
            this.reset();

        } catch (error) {
            console.error('❌ Email error details:', {
                message: error.message,
                status: error.status,
                text: error.text,
                error: error
            });
            
            let errorMessage = 'Failed to send. ';
            if (error.status === 401) {
                errorMessage = 'Invalid public key. Please check configuration.';
            } else if (error.status === 404) {
                errorMessage = 'Service or template not found.';
            } else if (error.status === 429) {
                errorMessage = 'Too many requests. Try again later.';
            } else if (error.text) {
                errorMessage = error.text;
            } else {
                errorMessage += error.message || 'Please try again.';
            }
            
            showToast(errorMessage, false);
        } finally {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });

    console.log("✅ Contact form ready with public key:", EMAILJS_CONFIG.publicKey);
});

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Cursor hover effect
    const interactiveElements = document.querySelectorAll('a, button, .magnetic-btn, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
}

// Magnetic Button Effect
const magneticBtns = document.querySelectorAll('.magnetic-btn');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ============================================
// MOBILE MENU FUNCTIONALITY - ENHANCED
// ============================================

const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenuPanel = document.getElementById('mobileMenuPanel');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const body = document.body;

let isMenuOpen = false;

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    // Toggle hamburger animation
    hamburgerBtn.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', isMenuOpen);
    
    // Toggle menu panel
    mobileMenuPanel.classList.toggle('active');
    
    // Toggle overlay
    mobileMenuOverlay.classList.toggle('active');
    
    // Lock/unlock body scroll
    if (isMenuOpen) {
        body.classList.add('menu-open');
        // Add staggered animation to links
        mobileNavLinks.forEach((link, index) => {
            link.style.transitionDelay = `${0.1 + (index * 0.05)}s`;
        });
    } else {
        body.classList.remove('menu-open');
        // Reset link animations
        mobileNavLinks.forEach(link => {
            link.style.transitionDelay = '0s';
        });
    }
}

function closeMenu() {
    if (isMenuOpen) {
        toggleMenu();
    }
}

// Hamburger click
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMenu);
}

// Overlay click
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMenu);
}

// Nav links click - close menu and smooth scroll
mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        closeMenu();
        
        // Wait for menu close animation then scroll
        setTimeout(() => {
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 300);
    });
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
    }
});

// Close menu on window resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && isMenuOpen) {
        closeMenu();
    }
});

// 3D Tilt Effect for Profile Card
const profileCard = document.getElementById('profileCard');
const profileCardContainer = document.querySelector('.profile-card-container');

if (profileCard && profileCardContainer && !window.matchMedia('(pointer: coarse)').matches) {
    profileCardContainer.addEventListener('mousemove', (e) => {
        const rect = profileCardContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    profileCardContainer.addEventListener('mouseleave', () => {
        profileCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// Animated Counter for Stats
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
};

// Trigger counter animation when profile card is visible
ScrollTrigger.create({
    trigger: "#about",
    start: "top 70%",
    onEnter: () => {
        document.querySelectorAll('.stat-number').forEach(stat => {
            const target = parseInt(stat.getAttribute('data-value'));
            animateCounter(stat, target);
        });
    },
    once: true
});

// Hero Animations
const heroTl = gsap.timeline();

heroTl
    .to('#heroName', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out"
    })
    .to('#heroTitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out"
    }, "-=0.8")
    .to('#heroTagline', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.6");

// Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

revealElements.forEach((element) => {
    const delay = element.style.animationDelay ? parseFloat(element.style.animationDelay) : 0;
    
    gsap.fromTo(element, 
        {
            opacity: 0,
            y: element.classList.contains('reveal-up') ? 30 : 0,
            x: element.classList.contains('reveal-left') ? -30 : element.classList.contains('reveal-right') ? 30 : 0,
            scale: element.classList.contains('reveal-scale') ? 0.9 : 1
        },
        {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 0.8,
            delay: delay,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Project Cards Stagger Animation
gsap.from(".project-card", {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
        trigger: "#projects",
        start: "top 70%"
    }
});

// Skills Cards Animation
gsap.from("#skills .grid > div", {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
        trigger: "#skills",
        start: "top 75%"
    }
});

// Services Animation
gsap.from("#services .grid > div", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: "#services",
        start: "top 75%"
    }
});

// Navigation Background on Scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-dark/95', 'shadow-lg', 'shadow-primary/5');
    } else {
        navbar.classList.remove('bg-dark/95', 'shadow-lg', 'shadow-primary/5');
    }
});

// Smooth Scroll for Desktop Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.classList.contains('mobile-nav-link')) return; // Skip mobile links (handled separately)
        
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance: Pause animations when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

// WhatsApp Widget Tracking
const whatsappBtn = document.querySelector('.whatsapp-button');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function() {
        // Track WhatsApp click (if you use Google Analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'contact',
                'event_label': 'WhatsApp Widget'
            });
        }
        console.log('WhatsApp button clicked'); // For debugging
    });
}


// Testimonials Section Animations
const testimonialCards = document.querySelectorAll('#testimonials .group');

// Intersection Observer for testimonial cards
const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation based on index
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.2, rootMargin: '0px' });

testimonialCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    testimonialObserver.observe(card);
});

// Random testimonial rotation (optional - adds variety)
const testimonials = document.querySelectorAll('#testimonials .group');
if (testimonials.length > 0) {
    setInterval(() => {
        testimonials.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('glow-effect');
                setTimeout(() => {
                    card.classList.remove('glow-effect');
                }, 500);
            }, index * 200);
        });
    }, 5000);
}

// Add glow effect class
const style = document.createElement('style');
style.textContent = `
    .glow-effect {
        box-shadow: 0 0 30px rgba(0, 210, 106, 0.4);
        transition: box-shadow 0.3s ease;
    }
`;
document.head.appendChild(style);

// Back to Top Button Functionality
const backToTopButton = document.getElementById('backToTop');

// Show/hide button based on scroll position
function toggleBackToTopButton() {
    // Get scroll position
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Calculate scroll percentage
    const scrollPercentage = (scrollY / (documentHeight - windowHeight)) * 100;
    
    // Show button after scrolling 300px down
    if (scrollY > 300) {
        backToTopButton.classList.add('show');
        
        // Add progress classes for visual feedback
        backToTopButton.classList.remove('scrolled-50', 'scrolled-75', 'scrolled-100');
        
        if (scrollPercentage >= 100) {
            backToTopButton.classList.add('scrolled-100');
        } else if (scrollPercentage >= 75) {
            backToTopButton.classList.add('scrolled-75');
        } else if (scrollPercentage >= 50) {
            backToTopButton.classList.add('scrolled-50');
        }
    } else {
        backToTopButton.classList.remove('show', 'scrolled-50', 'scrolled-75', 'scrolled-100');
    }
}

// Smooth scroll to top
function scrollToTop() {
    // Method 1: Using native smooth scroll (modern browsers)
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Method 2: Fallback for older browsers (commented out but available)
    /*
    const duration = 800; // milliseconds
    const start = window.scrollY;
    const startTime = performance.now();
    
    function scrollStep(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth deceleration
        const easeInOutCubic = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, start * (1 - easeInOutCubic));
        
        if (elapsed < duration) {
            requestAnimationFrame(scrollStep);
        }
    }
    
    requestAnimationFrame(scrollStep);
    */
    
    // Add click feedback
    backToTopButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        backToTopButton.style.transform = '';
    }, 200);
}

// Add scroll event listener with throttle for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    // Throttle the scroll event for better performance
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            toggleBackToTopButton();
            scrollTimeout = null;
        }, 10); // Run every 10ms for smooth updates
    }
});

// Initial check on page load
document.addEventListener('DOMContentLoaded', () => {
    toggleBackToTopButton();
    
    // Add click event to button
    if (backToTopButton) {
        backToTopButton.addEventListener('click', scrollToTop);
    }
});

// Check on window resize (in case content height changes)
window.addEventListener('resize', () => {
    toggleBackToTopButton();
});

// Optional: Add keyboard accessibility
document.addEventListener('keydown', (e) => {
    // Ctrl + Home keyboard shortcut to go to top
    if (e.ctrlKey && e.key === 'Home') {
        e.preventDefault();
        scrollToTop();
    }
});

// Optional: Show tooltip on hover (if you want)
backToTopButton?.addEventListener('mouseenter', () => {
    const tooltip = document.createElement('div');
    tooltip.className = 'back-to-top-tooltip';
    tooltip.textContent = 'Back to top (Ctrl+Home)';
    tooltip.style.cssText = `
        position: absolute;
        right: 60px;
        top: 50%;
        transform: translateY(-50%);
        background: #111;
        color: white;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 12px;
        white-space: nowrap;
        border: 1px solid #00D26A;
        pointer-events: none;
        opacity: 0;
        animation: fadeIn 0.3s ease forwards;
    `;
    
    // Add animation style if not exists
    if (!document.querySelector('#tooltip-style')) {
        const style = document.createElement('style');
        style.id = 'tooltip-style';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-50%) translateX(-10px); }
                to { opacity: 1; transform: translateY(-50%) translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    backToTopButton.appendChild(tooltip);
    
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.remove();
        }
    }, 2000);
});

backToTopButton?.addEventListener('mouseleave', () => {
    const tooltip = backToTopButton.querySelector('.back-to-top-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
});



// ============================================
// PRELOADER FUNCTIONALITY - OPTIMIZED FOR 5 SECONDS
// ============================================

class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.progressBar = document.getElementById('progressBar');
        this.percentageEl = document.getElementById('preloaderPercentage');
        this.loadingText = document.getElementById('loadingText');
        this.logoParts = document.querySelectorAll('.logo-part');
        
        this.progress = 0;
        this.images = [];
        this.totalImages = 0;
        this.loadedImages = 0;
        
        // Set minimum display time to 5 seconds (5000ms)
        this.minDisplayTime = 5000;
        this.startTime = Date.now();
        
        // Add extra animations for longer display
        this.currentStage = 0;
        this.stageMessages = [
            'Initializing',
            'Loading resources',
            'Processing assets',
            'Optimizing performance',
            'Almost ready',
            'Welcome!'
        ];
        
        this.init();
    }
    
    init() {
        // Create more particles for visual interest
        this.createParticles(50); // Increased from 30 to 50
        
        // Start progress simulation
        this.simulateProgress();
        
        // Track actual resource loading
        this.trackResources();
        
        // Add extra animations
        this.rotateLogoColors();
        this.updateStageMessages();
        
        // Disable scrolling
        document.body.style.overflow = 'hidden';
    }
    
    createParticles(count) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'preloader-particles';
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = 3 + Math.random() * 4 + 's';
            particle.style.width = (2 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = `rgba(0, 210, 106, ${0.2 + Math.random() * 0.3})`;
            particlesContainer.appendChild(particle);
        }
        
        this.preloader.appendChild(particlesContainer);
    }
    
    simulateProgress() {
        // Slower initial progress to fill 5 seconds
        const interval = setInterval(() => {
            if (this.progress < 60) { // Only go to 60% with simulation
                // Slower increment for 5-second experience
                this.progress += Math.random() * 2 + 0.5;
                this.updateProgress();
            } else {
                clearInterval(interval);
            }
        }, 150); // Slower interval (150ms instead of 100ms)
    }
    
    trackResources() {
        // Track images
        this.images = Array.from(document.querySelectorAll('img'));
        this.totalImages = this.images.length;
        
        if (this.totalImages === 0) {
            // If no images, simulate slower progress
            this.simulateRemainingProgress();
        } else {
            this.images.forEach(img => {
                if (img.complete) {
                    this.imageLoaded();
                } else {
                    img.addEventListener('load', () => this.imageLoaded());
                    img.addEventListener('error', () => this.imageLoaded());
                }
            });
        }
        
        // Track fonts
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => this.fontsLoaded());
        } else {
            setTimeout(() => this.fontsLoaded(), 1000); // Delay font loading
        }
    }
    
    simulateRemainingProgress() {
        // If no images, slowly progress to 90%
        const interval = setInterval(() => {
            if (this.progress < 90) {
                this.progress += Math.random() * 1.5 + 0.5;
                this.updateProgress();
            } else {
                clearInterval(interval);
                this.checkCompletion();
            }
        }, 200);
    }
    
    imageLoaded() {
        this.loadedImages++;
        const imageProgress = (this.loadedImages / this.totalImages) * 30;
        this.progress = Math.min(60 + imageProgress, 90);
        this.updateProgress();
        
        if (this.loadedImages === this.totalImages) {
            this.imagesLoaded = true;
            this.checkCompletion();
        }
    }
    
    fontsLoaded() {
        this.fontsReady = true;
        this.progress = Math.min(this.progress + 5, 95);
        this.updateProgress();
        this.checkCompletion();
    }
    
    updateProgress() {
        if (this.progressBar) {
            this.progressBar.style.width = this.progress + '%';
        }
        
        if (this.percentageEl) {
            this.percentageEl.textContent = Math.floor(this.progress) + '%';
        }
    }
    
    rotateLogoColors() {
        // Change logo colors periodically
        setInterval(() => {
            this.logoParts.forEach((part, index) => {
                setTimeout(() => {
                    if (Math.random() > 0.7) {
                        part.style.color = '#00D26A';
                        setTimeout(() => {
                            part.style.color = 'white';
                        }, 300);
                    }
                }, index * 100);
            });
        }, 2000);
    }
    
    updateStageMessages() {
        // Update loading text every 1.2 seconds
        let stageIndex = 0;
        setInterval(() => {
            if (this.progress < 95) {
                stageIndex = Math.floor((this.progress / 100) * this.stageMessages.length);
                stageIndex = Math.min(stageIndex, this.stageMessages.length - 2);
                
                if (this.loadingText) {
                    this.loadingText.textContent = this.stageMessages[stageIndex];
                    
                    // Add pulse effect when text changes
                    this.loadingText.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        this.loadingText.style.transform = 'scale(1)';
                    }, 200);
                }
            }
        }, 1200);
    }
    
    checkCompletion() {
        const imagesDone = this.totalImages === 0 || this.loadedImages === this.totalImages;
        const fontsDone = this.fontsReady;
        
        if (imagesDone && fontsDone && this.progress >= 95) {
            this.finish();
        }
    }
    
    finish() {
        // Gradually reach 100%
        const finalInterval = setInterval(() => {
            if (this.progress < 100) {
                this.progress += 1;
                this.updateProgress();
                
                // Update final message
                if (this.progress === 100 && this.loadingText) {
                    this.loadingText.textContent = 'Welcome!';
                }
            } else {
                clearInterval(finalInterval);
                
                // Calculate elapsed time
                const elapsedTime = Date.now() - this.startTime;
                const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);
                
                // Hide preloader after minimum display time
                setTimeout(() => {
                    this.hide();
                }, remainingTime);
            }
        }, 30);
    }
    
    hide() {
        // Final animation before hiding
        this.progressBar.style.animation = 'none';
        this.logoParts.forEach(part => {
            part.style.animation = 'logoPop 0.5s ease';
        });
        
        // Add fade-out class
        this.preloader.classList.add('fade-out');
        
        // Enable scrolling
        document.body.style.overflow = '';
        
        // Remove preloader from DOM after animation
        setTimeout(() => {
            this.preloader.style.display = 'none';
        }, 800);
        
        // Trigger any animations that should start after preloader
        document.body.classList.add('preloader-complete');
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
    }
}

// Initialize preloader
document.addEventListener('DOMContentLoaded', () => {
    // Check if this is first visit
    if (!sessionStorage.getItem('preloaderShown')) {
        const preloader = new Preloader();
        sessionStorage.setItem('preloaderShown', 'true');
    } else {
        // Returning visitor - hide preloader immediately
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
});

// Fallback: ensure preloader doesn't stay forever
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader && !preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = '';
            }, 800);
        }
    }, 6000); // 6 seconds fallback (slightly more than min 5)
});

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// 1. Defer non-critical JavaScript
const deferScripts = () => {
    const scripts = [
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js',
        'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js'
    ];
    
    scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        document.body.appendChild(script);
    });
};

// 2. Critical CSS inline (optional - but helps)
const addCriticalCSS = () => {
    const criticalStyles = `
        /* Only the most essential styles for above-the-fold content */
        body { background: #0A0A0A; color: white; margin: 0; }
        .nav-blur { backdrop-filter: blur(12px); }
        .gradient-text { background: linear-gradient(135deg, #00D26A 0%, #00A854 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalStyles;
    document.head.insertBefore(style, document.head.firstChild);
};

// 3. Detect slow connections and adjust
const detectSlowConnection = () => {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        
        // If on slow connection, disable heavy animations
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.body.classList.add('slow-connection');
            
            // Pause GSAP animations
            if (window.gsap) {
                gsap.globalTimeline.pause();
            }
        }
    }
};

// 4. Memory management - clear unused observers
const cleanupObservers = () => {
    const observers = window.__observers || [];
    observers.forEach(observer => {
        if (observer && typeof observer.disconnect === 'function') {
            observer.disconnect();
        }
    });
};

// 5. Implement debounced scroll for better performance
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Replace expensive scroll handlers with debounced versions
const optimizeScrollHandlers = () => {
    const scrollHandlers = [];
    
    // Store original scroll handlers
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, handler, options) {
        if (type === 'scroll') {
            scrollHandlers.push(handler);
            const debouncedHandler = debounce(handler, 10);
            originalAddEventListener.call(this, type, debouncedHandler, options);
        } else {
            originalAddEventListener.call(this, type, handler, options);
        }
    };
};

// 6. Image optimization helper
const optimizeImages = () => {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        // Don't lazy load above-the-fold images
        if (!img.closest('#about') && !img.closest('.hero')) {
            img.loading = 'lazy';
            img.decoding = 'async';
        }
    });
};

// 7. Remove unused CSS variables (for older browsers)
const cleanupCSSVariables = () => {
    if (!window.CSS || !CSS.supports('(--a: 0)')) {
        // Browser doesn't support CSS variables, provide fallbacks
        document.body.classList.add('no-css-vars');
    }
};

// 8. Implement requestIdleCallback for non-critical tasks
const runWhenIdle = (task) => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(task, { timeout: 2000 });
    } else {
        setTimeout(task, 100);
    }
};

// Initialize all performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Run critical optimizations immediately
    optimizeImages();
    detectSlowConnection();
    optimizeScrollHandlers();
    
    // Defer non-critical tasks
    runWhenIdle(() => {
        deferScripts();
        cleanupCSSVariables();
    });
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    cleanupObservers();
});

// Export for debugging (optional)
window.perf = {
    debounce,
    detectSlowConnection,
    optimizeImages
};

// ============================================
// PERFORMANCE MONITORING
// ============================================

// COMMENT OUT OR DELETE THIS ENTIRE SECTION

/*
const performanceMonitor = {
    init() {
        // Track Core Web Vitals
        this.trackWebVitals();
        
        // Monitor long tasks
        this.trackLongTasks();
        
        // Track resource timing
        this.trackResourceTiming();
    },
    
    trackWebVitals() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.startTime / 1000, 'seconds');
                    
                    // You can send this to analytics
                    if (window.gtag) {
                        gtag('event', 'web_vitals', {
                            event_category: 'Core Web Vitals',
                            event_label: 'LCP',
                            value: Math.round(lastEntry.startTime)
                        });
                    }
                });
                
                lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
                
                // First Input Delay
                const fidObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach(entry => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                });
                
                fidObserver.observe({ type: 'first-input', buffered: true });
                
                // Cumulative Layout Shift
                const clsObserver = new PerformanceObserver((entryList) => {
                    let clsValue = 0;
                    entryList.getEntries().forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    console.log('CLS:', clsValue);
                });
                
                clsObserver.observe({ type: 'layout-shift', buffered: true });
                
            } catch (e) {
                console.log('PerformanceObserver not supported');
            }
        }
    },
    
    trackLongTasks() {
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver((entryList) => {
                    entryList.getEntries().forEach(entry => {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            console.warn('Long task detected:', entry.duration + 'ms');
                            
                            // You can log this to analytics
                            if (window.gtag) {
                                gtag('event', 'performance', {
                                    event_category: 'Long Task',
                                    event_label: 'Duration',
                                    value: Math.round(entry.duration)
                                });
                            }
                        }
                    });
                });
                
                longTaskObserver.observe({ type: 'longtask', buffered: true });
            } catch (e) {
                console.log('Long task monitoring not supported');
            }
        }
    },
    
    trackResourceTiming() {
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const resources = performance.getEntriesByType('resource');
                
                // Find slow resources
                resources.forEach(resource => {
                    if (resource.duration > 1000) { // Resources taking > 1 second
                        console.warn('Slow resource:', resource.name, resource.duration + 'ms');
                    }
                });
            }
        });
    },
    
    // Get performance score (0-100)
    getPerformanceScore() {
        // This is a simplified version
        let score = 100;
        
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                // Deduct points for slow load
                if (navigation.loadEventEnd - navigation.startTime > 3000) {
                    score -= 20;
                }
                
                // Deduct for high number of resources
                const resources = performance.getEntriesByType('resource');
                if (resources.length > 50) {
                    score -= 10;
                }
            }
        }
        
        return Math.max(0, score);
    }
};

// Initialize monitoring
if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
    // Only monitor in production
    performanceMonitor.init();
}
*/

// ============================================
// COOKIE CONSENT MANAGER - Tailwind Version
// ============================================

class CookieConsent {
    constructor() {
        this.banner = document.getElementById('cookieConsent');
        this.settings = document.getElementById('cookieSettings');
        this.acceptBtn = document.getElementById('acceptCookies');
        this.declineBtn = document.getElementById('declineCookies');
        this.customizeBtn = document.getElementById('customizeCookies');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.openPrefsBtn = document.getElementById('openCookiePreferences');
        
        this.analyticsCheckbox = document.getElementById('analyticsCookies');
        this.marketingCheckbox = document.getElementById('marketingCookies');
        
        this.init();
    }
    
    init() {
        const consent = this.getCookieConsent();
        
        if (!consent) {
            // Show banner after a short delay
            setTimeout(() => {
                this.banner.classList.add('show');
            }, 1000);
        } else {
            this.applyConsent(consent);
        }
        
        this.addEventListeners();
    }
    
    addEventListeners() {
        this.acceptBtn?.addEventListener('click', () => this.acceptAll());
        this.declineBtn?.addEventListener('click', () => this.declineAll());
        this.customizeBtn?.addEventListener('click', () => this.toggleSettings());
        this.saveSettingsBtn?.addEventListener('click', () => this.saveSettings());
        this.closeSettingsBtn?.addEventListener('click', () => this.toggleSettings());
        
        this.openPrefsBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.banner.classList.add('show');
            this.settings.classList.add('show');
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settings.classList.contains('show')) {
                this.toggleSettings();
            }
        });
    }
    
    toggleSettings() {
        this.settings.classList.toggle('show');
    }
    
    acceptAll() {
        const consent = {
            essential: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };
        
        this.saveConsent(consent);
        this.applyConsent(consent);
        this.hideBanner();
        this.showToast('✓ All cookies accepted');
    }
    
    declineAll() {
        const consent = {
            essential: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        };
        
        this.saveConsent(consent);
        this.applyConsent(consent);
        this.hideBanner();
        this.showToast('✓ Only essential cookies enabled');
    }
    
    saveSettings() {
        const consent = {
            essential: true,
            analytics: this.analyticsCheckbox?.checked || false,
            marketing: this.marketingCheckbox?.checked || false,
            timestamp: new Date().toISOString()
        };
        
        this.saveConsent(consent);
        this.applyConsent(consent);
        this.hideBanner();
        this.showToast('✓ Preferences saved');
    }
    
    saveConsent(consent) {
        localStorage.setItem('cookieConsent', JSON.stringify(consent));
        document.cookie = `cookieConsent=${JSON.stringify(consent)}; max-age=31536000; path=/; SameSite=Lax`;
    }
    
    getCookieConsent() {
        const stored = localStorage.getItem('cookieConsent');
        return stored ? JSON.parse(stored) : null;
    }
    
    applyConsent(consent) {
        if (this.analyticsCheckbox) this.analyticsCheckbox.checked = consent.analytics;
        if (this.marketingCheckbox) this.marketingCheckbox.checked = consent.marketing;
        
        // Apply analytics based on consent
        if (consent.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
    }
    
    enableAnalytics() {
        // Enable Google Analytics if you have it
        if (window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        console.log('Analytics enabled');
    }
    
    disableAnalytics() {
        if (window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        this.clearCookiesByPattern('_ga');
        this.clearCookiesByPattern('_gid');
        console.log('Analytics disabled');
    }
    
    clearCookiesByPattern(pattern) {
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const name = cookie.split('=')[0].trim();
            if (name.includes(pattern)) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }
        });
    }
    
    hideBanner() {
        this.banner.classList.remove('show');
        this.settings.classList.remove('show');
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-24 right-6 bg-primary text-dark px-6 py-3 rounded-full font-medium shadow-xl z-[9999] animate-bounce';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.cookieConsent = new CookieConsent();
});



