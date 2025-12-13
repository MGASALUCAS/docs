// Custom header script to display logo
(function() {
    'use strict';

    function addLogo() {
        const navbar = document.querySelector('#navbar');
        if (!navbar) {
            // Retry if navbar not found yet
            setTimeout(addLogo, 100);
            return;
        }

        // Check if we've already added the logo
        if (document.querySelector('.custom-logo-container')) return;

        // Find the logo container
        const logoContainer = navbar.querySelector('.flex.items-center.gap-x-4');
        if (!logoContainer) return;

        // Create container for logo (replacing the main logo)
        const logoContainerDiv = document.createElement('div');
        logoContainerDiv.className = 'custom-logo-container flex items-center gap-2';
        logoContainerDiv.innerHTML = `
      <img src="/logo/logo.png" alt="Mifumo SMS API Logo" class="h-12 w-auto object-contain" />
    `;

        // Wrap in a link that goes to homepage (like the original logo)
        const logoLink = document.createElement('a');
        logoLink.href = '/';
        logoLink.className = 'flex items-center';
        logoLink.appendChild(logoContainerDiv);

        // Insert the logo link at the beginning of the logo container
        logoContainer.insertBefore(logoLink, logoContainer.firstChild);

    }

    // Try to add logo immediately, then retry if needed
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addLogo);
    } else {
        addLogo();
    }

    // Additional retry for SPA navigation
    let retryCount = 0;
    const retryInterval = setInterval(function() {
        if (retryCount < 10 && !document.querySelector('.custom-logo-container')) {
            addLogo();
            retryCount++;
        } else {
            clearInterval(retryInterval);
        }
    }, 500);
})();