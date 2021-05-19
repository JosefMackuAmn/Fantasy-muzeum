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

///// DEFINING GLOBAL CONSTANTS
const GALLERY_LAST_PHOTO_CLASS = '.gallery__photo--9';
const GALLERY_FIRST_PHOTO_SECOND_SECTION_CLASS = '.gallery__photo--7';

// Move photogallery
let maxPositionTop;
const setMaxPositionTop = (galleryPhotos) => {

    // Get viewport height unit
    const vh = window.innerHeight / 100;
    if (!prevVH) {
        prevVH = vh;
    }

    // Get current top value
    let curTop = galleryPhotos.style.top.slice(0, -2);

    // Set top value to 0 if isnt initialized
    if (!curTop) {
        curTop = 0;
    }

    // Get position of last photo
    const lastPhoto = document.querySelector(GALLERY_LAST_PHOTO_CLASS);
    const lastPhotoTop = lastPhoto.getBoundingClientRect().top;
    
    maxPositionTop = (lastPhotoTop + -curTop - 50 * vh).toFixed(2);
}

const moveGallery = (e, galleryPhotos, galleryMenuItems, galleryScrollbar, galleryThumb) => {

    // Get delta Y value of scroll
    let deltaY;    
    if (e.isSynthetic) {
        deltaY = e.deltaY;
    } else {
        if (e.deltaY > 0) {
            deltaY = 100;
        } else {
            deltaY = -100;
        }
    }

    // Get how many pixels in rem unit
    const html = document.getElementsByTagName('html')[0];
    let pxInRem = window.getComputedStyle(html, null).getPropertyValue('font-size');
    pxInRem = +pxInRem.slice(0, -2);
    
    // Get viewport width unit
    const vw = window.innerWidth / 100;
    if (!prevVW) {
        prevVW = vw;
    }

    // Get viewport height unit
    const vh = window.innerHeight / 100;
    if (!prevVH) {
        prevVH = vh;
    }

    // Count delta X value of a movement
    let deltaX = (deltaY * 15 * vw) / ((40 * vh) + (10 * pxInRem));
    
    // Get current top and right values
    let curTop = galleryPhotos.style.top.slice(0, -2);
    let curRight = galleryPhotos.style.right.slice(0, -2);

    // Set top and right values to 0 if they arent initialized
    if (!curTop || !curRight) {
        curTop = 0;
        curRight = 0;
    }

    // Get scrollbar and thumb height
    const scrollbarHeight = galleryScrollbar.offsetHeight;
    const thumbHeight = galleryThumb.offsetHeight;

    // Get scrollable height
    const scrollableHeight = scrollbarHeight - thumbHeight;

    // Count new top and right position
    let newPositionTop = curTop - deltaY;
    let newPositionRight = curRight - deltaX;

    // Check for upper scroll border
    if (newPositionTop > 0 || newPositionRight > 0) {
        newPositionTop = 0;
        // newDeltaY = curTop;
        // newPositionRight  = (newDeltaY * 15 * vw) / ((40 * vh) + (10 * pxInRem));
        newPositionRight = 0;
    }
    // Check for lower scroll border
    else if (-newPositionTop > +maxPositionTop) {
        newPositionTop = -maxPositionTop;
        newPositionRight = (newPositionTop * 15 * vw) / ((40 * vh) + (10 * pxInRem));
    }

    // Get percentage scrolled
    const percentageScrolled = newPositionTop / -maxPositionTop;    
    
    // Count values for thumb position; top: calc(XY% - 10rem); 10rem for equalizing difference, cause 100% solely makes thumb to overflow
    const thumbTop = scrollableHeight * percentageScrolled;

    // Set thumb position
    galleryThumb.style.top = `${thumbTop}px`;

    // Set new top and right values
    galleryPhotos.style.top = `${newPositionTop}px`;
    galleryPhotos.style.right = `${newPositionRight}px`;

    updateActiveClass(galleryMenuItems, curTop, vh);
}

const updateActiveClass = (galleryMenuItems, curTop, vh) => {
    // Update active class on menu items
    const middlePhoto = document.querySelector(GALLERY_FIRST_PHOTO_SECOND_SECTION_CLASS);
    const middlePhotoTop = middlePhoto.getBoundingClientRect().top;

    if (middlePhotoTop < -curTop - 50 * vh) {
        galleryMenuItems[0].classList.remove('active');
        galleryMenuItems[1].classList.add('active');
    } else {
        galleryMenuItems[0].classList.add('active');
        galleryMenuItems[1].classList.remove('active');
    }
}

// Move gallery to a certain position
const moveGalleryTo = (type, galleryPhotos, galleryMenuItems, galleryScrollbar, galleryThumb) => {
    // Get how many pixels in rem unit
    const html = document.getElementsByTagName('html')[0];
    let pxInRem = window.getComputedStyle(html, null).getPropertyValue('font-size');
    pxInRem = +pxInRem.slice(0, -2);
    
    // Get viewport width unit
    const vw = window.innerWidth / 100;
    if (!prevVW) {
        prevVW = vw;
    }

    // Get viewport height unit
    const vh = window.innerHeight / 100;
    if (!prevVH) {
        prevVH = vh;
    }

    // Get current top position of galleryPhotos element
    let curTop = galleryPhotos.style.top.slice(0, -2);
    if (!curTop) {
        curTop = '0';
    }

    // Get current top position of 1. photo in 2. section
    const middlePhotoTop = document.querySelector(GALLERY_FIRST_PHOTO_SECOND_SECTION_CLASS).getBoundingClientRect().top;

    switch (type) {
        // Move to first section
        case 'first':
            galleryPhotos.style.top = '0px';
            galleryPhotos.style.right = '0px';
            galleryMenuItems[0].classList.add('active');
            galleryMenuItems[1].classList.remove('active');
            galleryThumb.style.top = `0px`;
        break;
        // Move to second section
        case 'second':
            const newPositionTop = -(middlePhotoTop + -curTop - 50 * vh);
            const newPositionRight = (newPositionTop * 15 * vw) / ((40 * vh) + (10 * pxInRem));
            galleryPhotos.style.top = `${newPositionTop}px`;
            galleryPhotos.style.right = `${newPositionRight}px`;
            galleryMenuItems[0].classList.remove('active');
            galleryMenuItems[1].classList.add('active');

            // Get scrollbar and thumb height
            const scrollbarHeight = galleryScrollbar.offsetHeight;
            const thumbHeight = galleryThumb.offsetHeight;

            // Get scrollable height
            const scrollableHeight = scrollbarHeight - thumbHeight;

            // Get percentage scrolled
            const percentageScrolled = newPositionTop / -maxPositionTop;

            // Count values for thumb position; top: calc(XY% - 10rem); 10rem for equalizing difference, cause 100% solely makes thumb to overflow
            const thumbTop = scrollableHeight * percentageScrolled;

            // Set thumb position
            galleryThumb.style.top = `${thumbTop}px`;
        break;
    }
}

// Move photogallery with a scrollbar
let prevScreenY = 0;
const moveGalleryWithScrollbar = (galleryPhotos, galleryMenuItems, galleryScrollbar, galleryThumb) => {

    // Define function executed on mousemove while holding the thumb
    const moveThumb = e => {
        // Get how much the mouse moved in Y axis
        let movementY = e.movementY;

        // Set movementY if event.movementY is not supported
        if (!movementY) {
            movementY = prevScreenY ? e.screenY - prevScreenY : 0;
            prevScreenY = e.screenY;
        }

        // Get scrollbar and thumb height
        const scrollbarHeight = +galleryScrollbar.offsetHeight;
        const thumbHeight = +galleryThumb.offsetHeight;

        // Get scrollable height
        const scrollableHeight = scrollbarHeight - thumbHeight;

        // Count scrolled percentage and pixel value for gallery photos element
        const scrolledPercentage = +movementY / scrollableHeight;
        const scrolledGalleryPhotos = scrolledPercentage * maxPositionTop;

        // Set up wheel event imitator to pass it to moveGallery()
        const wheelEventImitator = {
            deltaY: scrolledGalleryPhotos,
            isSynthetic: true
        };

        // Move photogallery
        moveGallery(wheelEventImitator, galleryPhotos, galleryMenuItems, galleryScrollbar, galleryThumb);
    }

    const mouseupCleanUp = () => {
        window.removeEventListener('mousemove', moveThumb);
        galleryThumb.style.transition = `all .2s`;
        galleryPhotos.style.transition = `all .2s`;
        window.removeEventListener('mouseup', mouseupCleanUp);
        prevScreenY = 0;
    }

    // Remove transition on thumb and gallery photos to prevent laggy scrolling
    galleryThumb.style.transition = `none`;
    galleryPhotos.style.transition = `none`;

    window.addEventListener('mousemove', moveThumb);
    window.addEventListener('mouseup', mouseupCleanUp);
}

// Resize photogallery
let prevVW, prevVH;
const resizeGallery = (e, galleryPhotos, galleryMenuItems, galleryThumb) => {
    galleryMenuItems[0].classList.add('active');
    galleryMenuItems[1].classList.remove('active');

    galleryPhotos.style.right = `0px`;
    galleryPhotos.style.top = `0px`;
    galleryPhotos.style.width = '100%';
    galleryPhotos.style.height = '100%';
    galleryThumb.style.top = `0px`;
}

// Check if one of parents has a class
const hasOneOfParentsClass = (element, className) => {
    const parentElement = element.parentElement;

    // For IE, otherwise not necessary
    if (!parentElement) return false;

    if (parentElement.classList.contains(className)) {
        return true;
    }

    if (parentElement.parentElement) {
        return hasOneOfParentsClass(parentElement, className);
    }

    return false;
}




////// Calling ready function
ready(() => {
    ///// ANIMATIONS

    // Open mobile menu on click on menu button
    const menuBtn = document.getElementById('menu-btn');
    const navigationList = document.getElementById('navigation-list');
    menuBtn.addEventListener('click', () => {
        navigationList.classList.toggle('opened');
    });

    // Close menu on resize
    window.addEventListener('resize', () => {
        navigationList.classList.remove('opened');
    })

    // Close menu if clicked away
    document.addEventListener('click', e => {
        if (!hasOneOfParentsClass(e.target, 'navigation')) {
            navigationList.classList.remove('opened');
        }
    })

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

    // Move photogallery
    const galleryPhotos = document.getElementById('gallery-photos');
    if (galleryPhotos) {
        // Select menu elements
        const galleryMenu = document.querySelector('.gallery__list');
        const galleryMenuItems = galleryMenu.getElementsByTagName('li');

        // Select scrollbar and thumb
        const galleryScrollbar = document.getElementById('scrollbar');
        const galleryThumb = document.getElementById('thumb');

        // Add click and hold event listener for scrollbar thumb
        galleryThumb.addEventListener('mousedown', e => {
            // Disable disallow cursor
            e.preventDefault();
            moveGalleryWithScrollbar(galleryPhotos, galleryMenuItems, galleryScrollbar, galleryThumb);
        })

        // Add click listeners to gallery menu items to move photogallery
        galleryMenuItems[0].addEventListener('click', () => {
            moveGalleryTo('first', galleryPhotos, galleryMenuItems, galleryScrollbar, galleryThumb);
        });
        galleryMenuItems[1].addEventListener('click', () => {
            moveGalleryTo('second', galleryPhotos, galleryMenuItems, galleryScrollbar, galleryThumb);
        });

        // Get maximum top position
        setMaxPositionTop(galleryPhotos);

        // Move photogallery on wheel event
        window.addEventListener('wheel', e => {
            moveGallery(e, galleryPhotos, galleryMenuItems, galleryScrollbar, galleryThumb);
        });

        // Adjust photogallery after resize
        window.addEventListener('resize', e => {
            // Set transition to none to prevent bugs while executing setMaxPositionTop()
            galleryPhotos.style.transition = 'none';
            // Reset gallery positions after resizing
            resizeGallery(e, galleryPhotos, galleryMenuItems, galleryThumb);
            // Set maximum top value for galleryPhotos
            setMaxPositionTop(galleryPhotos);
            // Restore galleryPhotos transition
            galleryPhotos.style.transition = 'all .2s';
        });
    }
});

//////////////////////////////////////////
///// Service workers
// 'serviceWorker' in navigator && navigator.serviceWorker.register('/sw.js');
if (navigator && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
        .then((registrations) => {
            for (let registration of registrations) {
                registration.unregister();
            }
        })
}