(function () {
    'use strict';

    var root = document.documentElement;

    // Theme toggle. With no stored choice the site follows the OS (prefers-color-scheme);
    // the inline script in baseof.html applies a stored choice before first paint.
    var themeToggle = document.getElementById('themeToggle');
    var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function currentTheme() {
        var explicit = root.getAttribute('data-theme');
        if (explicit === 'dark' || explicit === 'light') return explicit;
        return darkQuery && darkQuery.matches ? 'dark' : 'light';
    }

    function syncToggle() {
        if (!themeToggle) return;
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        themeToggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
        themeToggle.setAttribute('title', 'Switch to ' + next + ' theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var next = currentTheme() === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) {}
            syncToggle();
        });
        if (darkQuery && darkQuery.addEventListener) darkQuery.addEventListener('change', syncToggle);
        syncToggle();
    }

    // Search shortcut: Cmd/Ctrl+K, or "/" when not typing. Opens the modal via its existing trigger.
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    document.querySelectorAll('[data-kbd]').forEach(function (el) {
        if (!isMac) el.textContent = 'Ctrl K';
    });
    document.addEventListener('keydown', function (e) {
        var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
        var combo = (e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K');
        if (combo || (e.key === '/' && !typing)) {
            var trigger = document.querySelector('[data-search-open]');
            if (trigger) {
                e.preventDefault();
                trigger.click();
            }
        }
    });

    // Copy buttons on code blocks (layouts/_markup/render-codeblock.html)
    document.querySelectorAll('.code-copy').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var block = btn.closest('.code-block');
            var code = block && block.querySelector('pre code');
            if (!code) return;
            var text = code.innerText.replace(/\n$/, '');
            var reset = function (label) {
                btn.textContent = label;
                setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
            };
            // Fallback for contexts where the async clipboard API is missing or refuses
            // (plain-http previews, unfocused documents)
            var legacyCopy = function () {
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.setAttribute('readonly', '');
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                var ok = false;
                try { ok = document.execCommand('copy'); } catch (e) {}
                document.body.removeChild(ta);
                btn.focus();
                reset(ok ? 'Copied' : (isMac ? 'Press ⌘C' : 'Press Ctrl+C'));
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () { reset('Copied'); }, legacyCopy);
            } else {
                legacyCopy();
            }
        });
    });

    // Table of contents: highlight the section being read and count down the time left
    var tocLinks = document.querySelectorAll('.post-toc nav a, .toc-mobile nav a');
    var content = document.querySelector('.post-content');
    if (tocLinks.length && content) {
        var byId = {};
        tocLinks.forEach(function (a) {
            var id = decodeURIComponent((a.getAttribute('href') || '').slice(1));
            (byId[id] = byId[id] || []).push(a);
        });
        var headings = Array.prototype.filter.call(content.querySelectorAll('h2[id], h3[id]'), function (h) { return byId[h.id]; });
        var progress = document.querySelector('.toc-progress');
        var bar = progress && progress.querySelector('.toc-bar i');
        var left = progress && progress.querySelector('.toc-left');
        var total = progress ? parseInt(progress.getAttribute('data-reading-time'), 10) || 0 : 0;
        var activeId = null;
        var ticking = false;

        var update = function () {
            ticking = false;
            var current = null;
            for (var i = 0; i < headings.length; i++) {
                if (headings[i].getBoundingClientRect().top <= 120) current = headings[i].id; else break;
            }
            if (current !== activeId) {
                activeId = current;
                tocLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
                (byId[current] || []).forEach(function (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'location'); });
            }
            if (bar && left) {
                var rect = content.getBoundingClientRect();
                var f = Math.min(1, Math.max(0, (window.innerHeight * 0.3 - rect.top) / rect.height));
                bar.style.width = (f * 100).toFixed(1) + '%';
                var mins = Math.max(1, Math.ceil(total * (1 - f)));
                left.textContent = f <= 0 ? total + ' min read' : (f >= 0.98 ? 'Done reading' : mins + ' min left');
            }
        };
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        update();

        // collapse the drop-down after a section is picked
        document.querySelectorAll('.toc-mobile nav a').forEach(function (a) {
            a.addEventListener('click', function () { var d = a.closest('details'); if (d) d.open = false; });
        });
    }

    // Archive filters: topic chips and a title filter; ?topic=<name> preselects a topic
    var controls = document.getElementById('archive-controls');
    if (controls) {
        controls.hidden = false;
        var filterInput = document.getElementById('archive-filter');
        var chips = controls.querySelectorAll('.chip');
        var rows = document.querySelectorAll('.post-row');
        var groups = document.querySelectorAll('.year-group');
        var empty = document.getElementById('archive-empty');
        var topic = '';
        var apply = function () {
            var q = filterInput.value.trim().toLowerCase();
            var shown = 0;
            rows.forEach(function (r) {
                var ok = (!topic || r.getAttribute('data-cat') === topic) &&
                    (!q || r.querySelector('.post-row-title').textContent.toLowerCase().indexOf(q) !== -1);
                r.hidden = !ok;
            });
            groups.forEach(function (g) {
                var n = g.querySelectorAll('.post-row:not([hidden])').length;
                g.hidden = n === 0;
                shown += n;
                var c = g.querySelector('.year-count');
                if (c) c.textContent = n + (n === 1 ? ' post' : ' posts');
            });
            empty.hidden = shown !== 0;
        };
        var select = function (chip) {
            topic = chip.getAttribute('data-cat');
            chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
            apply();
        };
        chips.forEach(function (c) { c.addEventListener('click', function () { select(c); }); });
        filterInput.addEventListener('input', apply);
        var wanted = new URLSearchParams(window.location.search).get('topic');
        if (wanted) {
            chips.forEach(function (c) { if (c.getAttribute('data-cat') === wanted) select(c); });
        }
    }

    // Avatar lightbox: clicking the homepage avatar shows a larger copy.
    // The overlay is built on first use, so pages without an avatar cost nothing.
    var avatar = document.querySelector('.home-avatar');
    if (avatar) {
        var zoom = null;
        var lastFocus = null;
        var closeZoom = function () {
            if (!zoom || !zoom.classList.contains('is-open')) return;
            zoom.classList.remove('is-open');
            zoom.hidden = true;
            if (lastFocus && lastFocus.focus) lastFocus.focus();
        };
        var openZoom = function () {
            if (!zoom) {
                zoom = document.createElement('div');
                zoom.className = 'avatar-zoom';
                zoom.hidden = true;
                var backdrop = document.createElement('div');
                backdrop.className = 'avatar-zoom-backdrop';
                var big = document.createElement('img');
                big.src = avatar.getAttribute('data-large') || avatar.src;
                big.alt = avatar.alt;
                zoom.appendChild(backdrop);
                zoom.appendChild(big);
                zoom.addEventListener('click', closeZoom);
                document.body.appendChild(zoom);
            }
            lastFocus = document.activeElement;
            zoom.hidden = false;
            zoom.classList.add('is-open');
        };
        avatar.addEventListener('click', function (e) {
            e.preventDefault();
            openZoom();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeZoom();
        });
    }

    // Mobile menu
    var menuToggle = document.getElementById('menuToggle');
    var navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        var setOpen = function (open) {
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.classList.toggle('active', open);
            navMenu.classList.toggle('active', open);
        };
        menuToggle.addEventListener('click', function () {
            setOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
        });
        navMenu.querySelectorAll('.nav-item').forEach(function (item) {
            item.addEventListener('click', function () { setOpen(false); });
        });
        document.addEventListener('click', function (e) {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) setOpen(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                setOpen(false);
                menuToggle.focus();
            }
        });
    }
})();
