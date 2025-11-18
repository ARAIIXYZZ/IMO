// Enhanced interactive effects and redirect logic
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    const profileImg = document.querySelector('.profile-img');
    const redirectOverlay = document.getElementById('redirectOverlay');
    const countdownElement = document.getElementById('countdown');
    
    let currentClickedLink = null;
    let visitedLinks = new Set();
    let redirectInProgress = false;

    // Button hover effects
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Ripple click effect
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const linkType = this.getAttribute('data-link-type');
            currentClickedLink = this.href;
            
            // Mark this link as visited
            visitedLinks.add(linkType);
            
            // Store in sessionStorage for back button detection
            sessionStorage.setItem('lastClickedLink', currentClickedLink);
            sessionStorage.setItem('visitedLinks', JSON.stringify(Array.from(visitedLinks)));
            
            // Open link in new tab
            window.open(currentClickedLink, '_blank');
            
            // Show redirect overlay after a short delay
            setTimeout(() => {
                showRedirectOverlay();
            }, 1000);
        });
    });
    
    // Profile image interaction
    profileImg.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.08)';
    });
    
    profileImg.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Back button detection and redirect logic
    function handleBackButton() {
        if (redirectInProgress) return;
        
        const visitedLinksArray = JSON.parse(sessionStorage.getItem('visitedLinks') || '[]');
        const allLinks = Array.from(buttons).map(btn => ({
            href: btn.href,
            type: btn.getAttribute('data-link-type')
        }));
        
        // Find next unvisited link
        const nextLink = allLinks.find(link => !visitedLinksArray.includes(link.type));
        
        if (nextLink && !redirectInProgress) {
            redirectInProgress = true;
            showRedirectOverlay();
            
            let countdown = 3;
            countdownElement.textContent = countdown;
            
            const countdownInterval = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;
                
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    redirectToLink(nextLink.href);
                }
            }, 1000);
        }
    }
    
    function showRedirectOverlay() {
        redirectOverlay.style.display = 'flex';
    }
    
    function hideRedirectOverlay() {
        redirectOverlay.style.display = 'none';
    }
    
    function redirectToLink(url) {
        // Mark this link as visited
        const linkType = getLinkTypeFromUrl(url);
        visitedLinks.add(linkType);
        sessionStorage.setItem('visitedLinks', JSON.stringify(Array.from(visitedLinks)));
        
        // Redirect to next link
        window.open(url, '_blank');
        
        // Hide overlay after redirect
        setTimeout(() => {
            hideRedirectOverlay();
            redirectInProgress = false;
        }, 500);
    }
    
    function getLinkTypeFromUrl(url) {
        const button = Array.from(buttons).find(btn => btn.href === url);
        return button ? button.getAttribute('data-link-type') : 'unknown';
    }
    
    // Listen for page visibility changes (when user comes back to tab)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && sessionStorage.getItem('lastClickedLink')) {
            // User has returned to the tab after clicking a link
            setTimeout(handleBackButton, 500);
        }
    });
    
    // Listen for focus events (when user switches back to this tab)
    window.addEventListener('focus', function() {
        if (sessionStorage.getItem('lastClickedLink')) {
            setTimeout(handleBackButton, 500);
        }
    });
    
    // Add subtle background parallax effect
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('body');
        parallax.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    });
    
    // Initialize visited links from sessionStorage
    const storedVisitedLinks = JSON.parse(sessionStorage.getItem('visitedLinks') || '[]');
    storedVisitedLinks.forEach(link => visitedLinks.add(link));
});
