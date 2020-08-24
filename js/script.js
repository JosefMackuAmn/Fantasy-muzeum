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

// Move photogallery
let lastTop = 0;
let lastRight = 0;
const moveGallery = (e, galleryPhotos) => {

    let deltaY = e.deltaY;
    
    // Get viewport width unit
    const vw = window.innerWidth / 100;
    if (!prevVW) {
        prevVW = vw;
    }

    //translateX = translateX * 15 * vw / 400;
    let deltaX = deltaY * 15 * vw / 400;
    
    let curTop = galleryPhotos.style.top.slice(0, -2);
    let curRight = galleryPhotos.style.right.slice(0, -2);

    if (!curTop || !curRight) {
        curTop = 0;
        curRight = 0;
    }

    let newPositionTop = curTop - deltaY;
    let newPositionRight = curRight - deltaX;

    if (newPositionTop > 0 || newPositionRight > 0) {
        newPositionTop = 0;
        newPositionRight = 0;
    } else if (newPositionTop < -1800) {
        newPositionTop = -1800;
        newPositionRight = newPositionTop * 15 * vw / 400;
    }

    galleryPhotos.style.top = `${newPositionTop}px`;
    galleryPhotos.style.right = `${newPositionRight}px`;
}

// Resize photogallery
let prevVW;
const resizeGallery = (e, galleryPhotos) => {

    curVW = window.innerWidth / 100;

    let curRight = galleryPhotos.style.right.slice(0, -2);
    if (!curRight) {
        curRight = 0;
    }

    let newRight = curRight * curVW / prevVW;

    galleryPhotos.style.right = `${newRight}px`;
    galleryPhotos.style.width = '100vw';

    prevVW = curVW;
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

    // Move photogallery on wheel event
    const galleryPhotos = document.getElementById('gallery-photos');
    if (galleryPhotos) {
        window.addEventListener('wheel', e => {
            moveGallery(e, galleryPhotos);
        });
        window.addEventListener('resize', e => {
            resizeGallery(e, galleryPhotos);
        });
    }
});