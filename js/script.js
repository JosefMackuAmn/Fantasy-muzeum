///// DEFINING FUNCTIONS
// jQuery .ready() fcn equivalent
const ready = callback => {
    if (document.readyState !== 'loading') {
        callback();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState === 'complete') {
                callback();
            }
        })
    }
}

// Calling ready function
ready(() => {
    ///// ANIMATIONS
    // Move head on index page on scroll
    const movableHead = document.getElementById('movable-head');
    if (movableHead) {
        window.addEventListener('scroll', () => {            
            if (movableHead) {
                let scrollTop = window.pageYOffset;
                let moveHeadInRem = ((scrollTop / 100) * 1.2) - 15;
                movableHead.style.left = (2 * moveHeadInRem) + 'rem';
                movableHead.style.top = -(moveHeadInRem / 2 - 15) + 'rem';
            }
        });
    }
});