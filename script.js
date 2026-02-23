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

// EmailJS Initialization
(function() {
    emailjs.init("Lomynv67E252xxVCU"); // Public Key
})();

// Toast Notification Function
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    
    toast.textContent = message;
    
    // Set initial visible classes
    const baseClasses = "fixed bottom-6 right-6 px-6 py-4 rounded-lg text-white font-medium shadow-lg transition-all duration-300";
    const typeClass = type === "success" ? "bg-green-500" : "bg-red-500";
    
    toast.className = `${baseClasses} ${typeClass} opacity-100 translate-y-0`;
    
    // 1. Start the fade out at 3 seconds
    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-2");
        
        // 2. Fully "clear" the element from view after the transition ends (300ms)
        setTimeout(() => {
            toast.className = "hidden"; 
        }, 300); 
    }, 3000);
}

// Contact Form Submission
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = this;
    const btn = form.querySelector("button");
    const originalText = btn.innerHTML;

    // Loading state
    btn.disabled = true;
    btn.innerHTML = "Sending...";

    emailjs.sendForm("service_40t0i3n", "template_zi2hnoo", form)
    .then(() => {
        // Auto-reply to visitor
        emailjs.sendForm("service_40t0i3n", "template_mz4u1vx", form);
        showToast("Message sent successfully ✅", "success");
        form.reset();
    })
    .catch((error) => {
        showToast("Failed to send ❌", "error");
        console.log(error);
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
    });
});
