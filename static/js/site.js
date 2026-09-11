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
