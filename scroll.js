/* scroll.js
   Handles in-page anchor clicks and scroll offset for dynamic header+nav height.
*/
(function () {
    function getHeaderNavHeight() {
        const header = document.getElementById('header');
        const nav = document.querySelector('nav');
        const h = header ? header.getBoundingClientRect().height : 0;
        const n = nav ? nav.getBoundingClientRect().height : 0;
        return Math.ceil(h + n);
    }

    function scrollToElementWithOffset(el, behavior) {
        const offset = getHeaderNavHeight();
        const rect = el.getBoundingClientRect();
        const top = window.scrollY + rect.top - offset;
        // default to smooth scrolling
        window.scrollTo({ top, behavior: behavior || 'smooth' });

        // move focus for accessibility without causing another scroll
        try {
            const hadTab = el.hasAttribute('tabindex');
            if (!hadTab) el.setAttribute('tabindex', '-1');
            if (typeof el.focus === 'function') el.focus({ preventScroll: true });
            if (!hadTab) el.removeAttribute('tabindex');
        } catch (e) {
            // If preventScroll not supported, skip focusing to avoid an instant jump
        }
    }

    // Delegate clicks on same-page anchors and handle offset scroll
    document.addEventListener('click', function (ev) {
        const a = ev.target.closest('a[href^="#"]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (!target) return; // let browser handle if no target on page

        ev.preventDefault();
        scrollToElementWithOffset(target, 'smooth');
        // update URL hash without jump (adds history entry)
        history.pushState(null, '', '#' + id);
    });

    // On page load with a hash, scroll to target after layout
    window.addEventListener('load', function () {
        if (!location.hash) return;
        const id = location.hash.slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        // allow fonts/layout to settle
        setTimeout(function () { scrollToElementWithOffset(target, 'smooth'); }, 120);
    });

    // Handle back/forward navigation
    window.addEventListener('popstate', function () {
        if (!location.hash) return;
        const id = location.hash.slice(1);
        const target = document.getElementById(id);
        if (target) scrollToElementWithOffset(target, 'smooth');
    });
})();
