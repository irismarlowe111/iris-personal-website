// ========================================
// Personal Website - JavaScript
// Features: Language toggle, Smooth scroll, Animations
// ========================================

// --- State Management ---
const state = {
    lang: localStorage.getItem('lang') || 'en',
    lastScroll: 0
};

// --- DOM Elements ---
const elements = {
    langToggle: document.getElementById('langToggle'),
    navbar: document.querySelector('.navbar'),
    navLinks: document.querySelectorAll('.nav-menu a'),
    sections: document.querySelectorAll('section[id]')
};

// --- Translations ---
const translations = {
    en: {
        home: 'Home',
        about: 'About',
        skills: 'Skills',
        projects: 'Projects',
        contact: 'Contact'
    },
    zh: {
        home: '首页',
        about: '关于',
        skills: '技能',
        projects: '项目',
        contact: '联系'
    }
};

// --- Initialize ---
function init() {
    // Set initial language
    setLanguage(state.lang);

    // Setup event listeners
    setupEventListeners();

    // Start animations
    startAnimations();

    // Handle scroll
    handleInitialScroll();
}

// --- Event Listeners ---
function setupEventListeners() {
    // Language toggle
    if (elements.langToggle) {
        elements.langToggle.addEventListener('click', toggleLanguage);
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll handler
    window.addEventListener('scroll', () => {
        handleScroll();
        updateActiveSection();
    });

    // Resize handler for animations
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            startAnimations();
        }, 250);
    });
}

// --- Language Functions ---
function toggleLanguage() {
    state.lang = state.lang === 'en' ? 'zh' : 'en';
    setLanguage(state.lang);
    localStorage.setItem('lang', state.lang);
}

function setLanguage(lang) {
    state.lang = lang;

    // Update toggle button
    if (elements.langToggle) {
        elements.langToggle.setAttribute('data-lang', lang);
    }

    // Update all translatable elements
    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update active nav link text
    updateNavText();
}

function updateNavText() {
    const navMap = {
        en: ['home', 'about', 'skills', 'projects', 'contact'],
        zh: ['home', 'about', 'skills', 'projects', 'contact']
    };

    const keys = navMap[state.lang];
    elements.navLinks.forEach((link, index) => {
        const originalText = link.getAttribute(`data-${state.lang}`);
        if (!link.dataset.currentText || link.dataset.currentLang !== state.lang) {
            link.dataset.currentText = originalText;
            link.dataset.currentLang = state.lang;
        }
    });
}

// --- Scroll Functions ---
function handleScroll() {
    const currentScroll = window.pageYOffset;

    // Navbar background on scroll
    if (currentScroll > 50) {
        elements.navbar.classList.add('scrolled');
    } else {
        elements.navbar.classList.remove('scrolled');
    }

    state.lastScroll = currentScroll;
}

function handleInitialScroll() {
    if (window.pageYOffset > 50) {
        elements.navbar.classList.add('scrolled');
    }
}

function updateActiveSection() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    elements.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// --- Animation Functions ---
function startAnimations() {
    // Fade in sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        sectionObserver.observe(section);
    });

    // Stagger animation for skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease, border-color 0.3s';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        cardObserver.unobserve(entry.target);
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        cardObserver.observe(card);
    });

    // Stagger animation for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease, border-color 0.3s';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        cardObserver.unobserve(entry.target);
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        cardObserver.observe(card);
    });
}

// --- Utility Functions ---
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// --- Initialize on DOM Ready ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
