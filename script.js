/* ============================================
   script.js — Site d'invitation
   30 ans d'amour, 30 ans de vie
   ============================================
   Ce fichier gère :
   1. Le compte à rebours
   2. La navigation (scroll + hamburger mobile)
   3. Les animations d'apparition au scroll
   4. Le formulaire RSVP
   ============================================ */

(function () {
    'use strict';

    /* ============================================
       1. COMPTE À REBOURS
       ============================================
       MODIFIABLE : Changez la date ci-dessous
       Format : 'YYYY-MM-DDTHH:MM:SS'
       ============================================ */
    const EVENT_DATE = new Date('2026-07-12T14:00:00');

    function updateCountdown() {
        const now = new Date();
        const diff = EVENT_DATE - now;

        // Si la date est passée
        if (diff <= 0) {
            document.getElementById('countdown').innerHTML =
                '<p style="font-family: var(--font-heading); font-size: 1.5rem;">La fête a commencé ! 🎉</p>';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('countdown-days').textContent = days;
        document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
    }

    // Mettre à jour chaque seconde
    updateCountdown();
    setInterval(updateCountdown, 1000);


    /* ============================================
       2. NAVIGATION
       ============================================ */

    // Effet de shadow au scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Menu hamburger mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fermer le menu au clic sur un lien
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });


    /* ============================================
       3. ANIMATIONS AU SCROLL
       ============================================
       Les éléments avec la classe .fade-in
       apparaissent progressivement quand ils
       entrent dans le viewport.
       ============================================ */
    const fadeElements = document.querySelectorAll('.fade-in');

    // Utilisation de IntersectionObserver pour la performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // N'animer qu'une fois
                }
            });
        }, {
            threshold: 0.15,     // Déclencher quand 15% de l'élément est visible
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback : tout afficher sans animation
        fadeElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }


    /* ============================================
       4. FORMULAIRE RSVP
       ============================================
       Gestion de la soumission avec message de
       confirmation. Compatible Formspree, Netlify
       Forms, ou tout endpoint POST.
       ============================================ */
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(rsvpForm);
            const action = rsvpForm.getAttribute('action');

            // Si l'action contient encore le placeholder, simuler
            if (action.includes('YOUR_FORM_ID')) {
                // Mode démo : afficher le message de succès
                console.log('Mode démo — Données du formulaire :');
                for (const [key, value] of formData.entries()) {
                    console.log('  ' + key + ' : ' + value);
                }
                rsvpForm.style.display = 'none';
                rsvpSuccess.style.display = 'block';
                rsvpSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Mode production : envoyer au service
            fetch(action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(function (response) {
                if (response.ok) {
                    rsvpForm.style.display = 'none';
                    rsvpSuccess.style.display = 'block';
                    rsvpSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
                }
            })
            .catch(function () {
                alert('Erreur de connexion. Veuillez réessayer ou nous contacter directement.');
            });
        });
    }

})();
