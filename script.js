// === DOM Elements ===
document.addEventListener('DOMContentLoaded', () => {
    initFadeInAnimations();
    initMobileMenu();
    initAnswerButtons();
    initMusicPlayers();
    initTaskProgression();
});

// === Fade In Animations on Scroll ===
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
}

// === Mobile Menu ===
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }
}

// === Answer Buttons Logic ===
function initAnswerButtons() {
    const answerButtons = document.querySelectorAll('.btn-answer');

    answerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const taskCard = btn.closest('.task-card');
            const answerSection = taskCard.querySelector('.answer-section');
            const nextBtn = taskCard.querySelector('.btn-next');

            if (answerSection) {
                answerSection.classList.add('visible');
                btn.disabled = true;
                btn.textContent = 'Ответ показан';

                // Smooth scroll to answer
                answerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Enable next task button
                if (nextBtn) {
                    nextBtn.classList.add('active');
                }

                // Unlock next task card
                const nextTask = taskCard.nextElementSibling;
                if (nextTask && nextTask.classList.contains('task-card')) {
                    setTimeout(() => {
                        nextTask.classList.remove('locked');
                        nextTask.classList.add('visible');
                        updateProgress();
                    }, 500);
                }

                // Create confetti effect
                createConfetti();
            }
        });
    });
}

// === Task Progression ===
function initTaskProgression() {
    const taskCards = document.querySelectorAll('.task-card');

    taskCards.forEach((card, index) => {
        if (index === 0) {
            card.classList.add('visible');
        } else {
            card.classList.add('locked');
        }
    });

    updateProgress();
}

// === Update Progress Bar ===
function updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const taskCards = document.querySelectorAll('.task-card');
    const visibleCards = document.querySelectorAll('.task-card.visible:not(.locked)').length;

    if (progressBar && taskCards.length > 0) {
        const progress = (visibleCards / taskCards.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

// === Music Players ===
function initMusicPlayers() {
    const playButtons = document.querySelectorAll('.play-btn');

    playButtons.forEach(btn => {
        const audioId = btn.dataset.audio;
        const audio = document.getElementById(audioId);

        if (audio) {
            btn.addEventListener('click', () => {
                if (audio.paused) {
                    // Pause all other audios first
                    document.querySelectorAll('audio').forEach(a => {
                        a.pause();
                        const otherBtn = document.querySelector(`[data-audio="${a.id}"]`);
                        if (otherBtn) {
                            otherBtn.classList.remove('playing');
                            otherBtn.innerHTML = getPlayIcon();
                        }
                    });

                    audio.play();
                    btn.classList.add('playing');
                    btn.innerHTML = getPauseIcon();
                } else {
                    audio.pause();
                    btn.classList.remove('playing');
                    btn.innerHTML = getPlayIcon();
                }
            });

            audio.addEventListener('ended', () => {
                btn.classList.remove('playing');
                btn.innerHTML = getPlayIcon();
            });
        }
    });
}

function getPlayIcon() {
    return `<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>`;
}

function getPauseIcon() {
    return `<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="white"/><rect x="14" y="4" width="4" height="16" fill="white"/></svg>`;
}

// === Confetti Effect ===
function createConfetti() {
    const colors = ['#e84a5f', '#ff6b81', '#ffd3b6', '#f8b4b4', '#d4af37'];

    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

// === Smooth Page Transitions ===
document.querySelectorAll('a[href^="./"], a[href^="/"], a:not([href^="http"])').forEach(link => {
    if (!link.href.includes('#') && link.href.includes('.html')) {
        link.addEventListener('click', (e) => {
            // Allow normal navigation for contest pages
        });
    }
});

// === Header Scroll Effect ===
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 30px rgba(232, 74, 95, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 20px rgba(232, 74, 95, 0.1)';
    }

    lastScroll = currentScroll;
});

// === Parallax Effect for Hero ===
window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content');
    const scroll = window.pageYOffset;

    if (heroContent && scroll < window.innerHeight) {
        heroContent.style.transform = `translateY(${scroll * 0.3}px)`;
        heroContent.style.opacity = 1 - (scroll / window.innerHeight);
    }
});

// === Task Card Animation on Page Load ===
window.addEventListener('load', () => {
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach((card, index) => {
        if (!card.classList.contains('locked')) {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
});
