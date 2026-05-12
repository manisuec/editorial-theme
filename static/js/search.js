(function () {
    'use strict';

    var INDEX_URL = '/index.json';
    var FUSE_CDN = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js';
    var MAX_RESULTS = 20;

    var modal = document.getElementById('search-modal');
    var input = document.getElementById('search-input');
    var resultsEl = document.getElementById('search-results');
    var triggers = document.querySelectorAll('[data-search-open]');

    if (!modal || !input || !resultsEl || !triggers.length) return;

    var fuse = null;
    var dataPromise = null;
    var fusePromise = null;
    var debounceTimer = null;
    var lastQuery = '';

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.onload = function () { resolve(); };
            s.onerror = function () { reject(new Error('Failed to load ' + src)); };
            document.head.appendChild(s);
        });
    }

    function loadFuse() {
        if (window.Fuse) return Promise.resolve();
        if (!fusePromise) fusePromise = loadScript(FUSE_CDN);
        return fusePromise;
    }

    function loadData() {
        if (!dataPromise) {
            dataPromise = fetch(INDEX_URL, { credentials: 'same-origin' })
                .then(function (r) {
                    if (!r.ok) throw new Error('Index fetch failed: ' + r.status);
                    return r.json();
                });
        }
        return dataPromise;
    }

    function ensureReady() {
        if (fuse) return Promise.resolve();
        return Promise.all([loadData(), loadFuse()]).then(function (vals) {
            var data = vals[0];
            fuse = new window.Fuse(data, {
                includeScore: true,
                threshold: 0.4,
                ignoreLocation: true,
                minMatchCharLength: 2,
                keys: [
                    { name: 'title',       weight: 0.5  },
                    { name: 'description', weight: 0.25 },
                    { name: 'tags',        weight: 0.15 },
                    { name: 'categories',  weight: 0.10 }
                ]
            });
        });
    }

    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function renderMessage(msg) {
        resultsEl.innerHTML = '<p class="search-message">' + escapeHtml(msg) + '</p>';
    }

    function renderResults(hits, query) {
        if (!hits.length) {
            resultsEl.innerHTML = '<p class="search-message">No results for &ldquo;' + escapeHtml(query) + '&rdquo;</p>';
            return;
        }
        var html = '';
        var n = Math.min(hits.length, MAX_RESULTS);
        for (var i = 0; i < n; i++) {
            var item = hits[i].item;
            var cat = (item.categories && item.categories[0]) ? item.categories[0] : '';
            var tags = (item.tags || []).slice(0, 4);
            var tagsHtml = '';
            for (var j = 0; j < tags.length; j++) {
                tagsHtml += '<span class="search-result-tag">#' + escapeHtml(tags[j]) + '</span>';
            }
            html += '<a class="search-result" href="' + escapeHtml(item.url) + '">'
                  + '<div class="search-result-meta">'
                  + (cat ? '<span class="search-result-category">' + escapeHtml(cat) + '</span>' : '')
                  + (item.date ? '<span class="search-result-date">' + escapeHtml(item.date) + '</span>' : '')
                  + '</div>'
                  + '<h3 class="search-result-title">' + escapeHtml(item.title) + '</h3>'
                  + (item.description ? '<p class="search-result-description">' + escapeHtml(item.description) + '</p>' : '')
                  + (tagsHtml ? '<div class="search-result-tags">' + tagsHtml + '</div>' : '')
                  + '</a>';
        }
        resultsEl.innerHTML = html;
    }

    function runSearch() {
        var q = input.value.trim();
        if (q === lastQuery) return;
        lastQuery = q;
        if (!q) {
            renderMessage('Start typing to search articles…');
            return;
        }
        if (!fuse) {
            renderMessage('Loading…');
            return;
        }
        renderResults(fuse.search(q), q);
    }

    function isOpen() { return modal.classList.contains('is-open'); }

    function closeMobileNavIfOpen() {
        var navMenu = document.getElementById('navMenu');
        var menuToggle = document.getElementById('menuToggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }

    function openModal() {
        if (isOpen()) return;
        closeMobileNavIfOpen();
        modal.hidden = false;
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        renderMessage('Loading…');
        ensureReady().then(function () {
            if (!input.value.trim()) {
                renderMessage('Start typing to search articles…');
            } else {
                lastQuery = '';
                runSearch();
            }
        }).catch(function () {
            renderMessage('Search failed to load. Please refresh and try again.');
        });
        requestAnimationFrame(function () { input.focus(); });
    }

    function closeModal() {
        if (!isOpen()) return;
        modal.classList.remove('is-open');
        modal.hidden = true;
        document.body.style.overflow = '';
    }

    for (var t = 0; t < triggers.length; t++) {
        triggers[t].addEventListener('click', openModal);
    }

    var closers = modal.querySelectorAll('[data-search-close]');
    for (var i = 0; i < closers.length; i++) {
        closers[i].addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen()) closeModal();
    });

    input.addEventListener('input', function () {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(runSearch, 80);
    });
})();
