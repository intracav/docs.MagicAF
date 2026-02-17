// Search Modal with Keyboard Shortcuts
// Integrates with PaperMod's Fuse.js search

import * as params from '@params';

let fuse;
let resList = document.getElementById('searchResults');
let sInput = document.getElementById('searchInput');
let searchModal = document.getElementById('search-modal');
let searchToggle = document.getElementById('search-toggle');
let searchClose = document.getElementById('search-close');
let searchOverlay = document.getElementById('search-overlay');
let first, last, current_elem = null;
let resultsAvailable = false;

// Load search index
function loadSearchIndex() {
    if (fuse) return; // Already loaded
    
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                if (data) {
                    let options = {
                        distance: 100,
                        threshold: 0.4,
                        ignoreLocation: true,
                        keys: ['title', 'permalink', 'summary', 'content']
                    };
                    if (params.fuseOpts) {
                        options = {
                            isCaseSensitive: params.fuseOpts.iscasesensitive ?? false,
                            includeScore: params.fuseOpts.includescore ?? false,
                            includeMatches: params.fuseOpts.includematches ?? false,
                            minMatchCharLength: params.fuseOpts.minmatchcharlength ?? 1,
                            shouldSort: params.fuseOpts.shouldsort ?? true,
                            findAllMatches: params.fuseOpts.findallmatches ?? false,
                            keys: params.fuseOpts.keys ?? ['title', 'permalink', 'summary', 'content'],
                            location: params.fuseOpts.location ?? 0,
                            threshold: params.fuseOpts.threshold ?? 0.4,
                            distance: params.fuseOpts.distance ?? 100,
                            ignoreLocation: params.fuseOpts.ignorelocation ?? true
                        };
                    }
                    fuse = new Fuse(data, options);
                }
            }
        }
    };
    // Get the correct path to index.json (always at site root)
    // Calculate relative path from current page to site root
    let pathname = window.location.pathname;
    // Remove trailing slash and split
    pathname = pathname.replace(/\/$/, '') || '/';
    let parts = pathname.split('/').filter(p => p);
    
    // Calculate depth (number of path segments)
    let depth = parts.length;
    
    // Build relative path: '../' for each level deep we are
    let indexPath;
    if (depth === 0 || pathname === '/') {
        // We're at root
        indexPath = './index.json';
    } else {
        // We're N levels deep, need N '../' to get to root
        indexPath = '../'.repeat(depth) + 'index.json';
    }
    
    xhr.open('GET', indexPath);
    xhr.send();
}

// Show modal
function showModal() {
    // Clear any inline styles that may have been set by other scripts
    searchModal.style.removeProperty('display');
    searchModal.style.removeProperty('pointer-events');
    searchModal.setAttribute('aria-hidden', 'false');
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadSearchIndex();
    setTimeout(() => sInput.focus(), 100);
}

// Hide modal
function hideModal() {
    searchModal.setAttribute('aria-hidden', 'true');
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
    reset();
}

// Reset search
function reset() {
    resultsAvailable = false;
    if (resList) resList.innerHTML = '';
    if (sInput) sInput.value = '';
}

// Active toggle for keyboard navigation
function activeToggle(ae) {
    document.querySelectorAll('.focus').forEach(function (element) {
        element.classList.remove("focus");
    });
    if (ae) {
        ae.focus();
        document.activeElement = current_elem = ae;
        ae.parentElement.classList.add("focus");
    } else if (document.activeElement) {
        document.activeElement.parentElement.classList.add("focus");
    }
}

// Execute search
function executeSearch(query) {
    if (!fuse || !query.trim()) {
        if (resList) resList.innerHTML = '';
        resultsAvailable = false;
        return;
    }

    let results;
    if (params.fuseOpts && params.fuseOpts.limit) {
        results = fuse.search(query.trim(), {limit: params.fuseOpts.limit});
    } else {
        results = fuse.search(query.trim());
    }

    if (results.length !== 0) {
        let resultSet = '';
        for (let item in results) {
            resultSet += `<li class="search-result-item">
                <a href="${results[item].item.permalink}" class="search-result-link">
                    <header class="search-result-header">${results[item].item.title}</header>
                    ${results[item].item.summary ? `<div class="search-result-summary">${results[item].item.summary}</div>` : ''}
                </a>
            </li>`;
        }
        if (resList) {
            resList.innerHTML = resultSet;
            resultsAvailable = true;
            first = resList.firstChild;
            last = resList.lastChild;
        }
    } else {
        if (resList) resList.innerHTML = '<li class="search-result-empty">No results found</li>';
        resultsAvailable = false;
    }
}

// Event listeners
if (sInput) {
    sInput.addEventListener('input', function (e) {
        executeSearch(this.value);
    });

    sInput.addEventListener('search', function (e) {
        if (!this.value) reset();
    });
}

if (searchToggle) {
    searchToggle.addEventListener('click', showModal);
}

if (searchClose) {
    searchClose.addEventListener('click', hideModal);
}

if (searchOverlay) {
    searchOverlay.addEventListener('click', hideModal);
}

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl+K or Cmd+K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchModal.classList.contains('active')) {
            hideModal();
        } else {
            showModal();
        }
        return;
    }

    // Only handle other keys if modal is open
    if (!searchModal.classList.contains('active')) return;

    let ae = document.activeElement;
    let inbox = searchModal.contains(ae);

    if (ae === sInput) {
        document.querySelectorAll('.focus').forEach(el => el.classList.remove('focus'));
    } else if (current_elem) {
        ae = current_elem;
    }

    if (e.key === "Escape") {
        e.preventDefault();
        hideModal();
    } else if (!resultsAvailable || !inbox) {
        return;
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (ae == sInput) {
            activeToggle(resList.firstChild?.querySelector('.search-result-link'));
        } else if (ae && ae.closest('li') != last) {
            let next = ae.closest('li')?.nextSibling;
            if (next) activeToggle(next.querySelector('.search-result-link'));
        }
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (ae && ae.closest('li') == first) {
            activeToggle(sInput);
        } else if (ae != sInput && ae) {
            let prev = ae.closest('li')?.previousSibling;
            if (prev) activeToggle(prev.querySelector('.search-result-link'));
        }
    } else if (e.key === "Enter" || e.key === "ArrowRight") {
        if (ae && ae.classList.contains('search-result-link')) {
            ae.click();
        }
    }
});

// Load index on page load
window.addEventListener('load', loadSearchIndex);
