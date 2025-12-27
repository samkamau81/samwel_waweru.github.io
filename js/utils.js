// Utility functions
const Utils = {

    logout: function() {
        if (confirm('Are you sure you want to log off?')) {
            document.body.style.transition = 'opacity 1s';
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                document.body.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0a58ca; color: white; font-size: 24px; flex-direction: column;">
                        <div style="margin-bottom: 20px;">🪟</div>
                        <div>Windows is shutting down...</div>
                        <div style="margin-top: 20px; font-size: 14px;">Thank you for visiting!</div>
                    </div>
                `;
                document.body.style.opacity = '1';
                
                setTimeout(() => {
                    location.reload();
                }, 3000);
            }, 1000);
        }
    }
};

function openImageViewer(imageSrc, imageName) {
    // Create image viewer window
    const viewer = document.createElement('div');
    viewer.id = 'image-viewer';
    viewer.className = 'secondary-window active';
    
    // Responsive centering with different sizes for different devices
    viewer.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: min(50vw, 400px);
        height: min(65vh, 650px);
    `;
    
    viewer.innerHTML = `
        <div class="title-bar">
            <div class="title-bar-text">
                <img src="assets/gallery.png" class="menu-icon-img" alt="Gallery">
                <span class="viewer-title">${imageName} - Windows Picture and Fax Viewer</span>
            </div>
            <div class="title-bar-controls">
                <button onclick="closeImageViewer()">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; background: #f0f0f0; display: flex; flex-direction: column; height: calc(100% - 27px);">
            <!-- Toolbar -->
            <div class="viewer-toolbar" style="background: #ece9d8; padding: 5px 10px; border-bottom: 1px solid #ccc; display: flex; gap: 5px; align-items: center; flex-wrap: wrap; min-height: 36px;">
                <button class="viewer-btn" onclick="event.stopPropagation(); rotateImage(-90)" title="Rotate Left">
                    <span>↶</span>
                </button>
                <button class="viewer-btn" onclick="event.stopPropagation(); rotateImage(90)" title="Rotate Right">
                    <span>↷</span>
                </button>
                <div class="viewer-separator" style="width: 1px; height: 20px; background: #999; margin: 0 5px;"></div>
                <button class="viewer-btn" onclick="event.stopPropagation(); zoomImage('in')" title="Zoom In">
                    <span>🔍+</span>
                </button>
                <button class="viewer-btn" onclick="event.stopPropagation(); zoomImage('out')" title="Zoom Out">
                    <span>🔍-</span>
                </button>
                <button class="viewer-btn" onclick="event.stopPropagation(); zoomImage('fit')" title="Best Fit">
                    <span>⊡</span>
                </button>
                <button class="viewer-btn" onclick="event.stopPropagation(); zoomImage('actual')" title="Actual Size">
                    <span>1:1</span>
                </button>
                <div style="margin-left: auto; font-size: 11px; color: #666;">
                    <span id="zoom-level">100%</span>
                </div>
            </div>
            
            <!-- Image Container -->
            <div style="flex: 1; overflow: auto; display: flex; align-items: center; justify-content: center; background: #808080; position: relative;">
                <img id="viewer-image" src="${imageSrc}" alt="${imageName}" 
                     style="max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.3s ease;"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ccc%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23666%22 font-size=%2220%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E'">
            </div>
            
            <!-- Status Bar -->
            <div class="viewer-status" style="background: #ece9d8; padding: 5px 10px; border-top: 1px solid #ccc; font-size: 10px; color: #000; display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0;">${imageName}</span>
                <span id="image-info" style="flex-shrink: 0;">Loading...</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(viewer);
    
    // Make window draggable
    makeWindowDraggable(viewer);
    
    // Re-center on window resize or orientation change
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (document.getElementById('image-viewer') && !viewer.dataset.dragged) {
                centerViewer();
            }
        }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Load image info
    const img = document.getElementById('viewer-image');
    img.onload = function() {
        const infoElement = document.getElementById('image-info');
        if (infoElement) {
            infoElement.textContent = `${this.naturalWidth} × ${this.naturalHeight}px`;
        }
    };
}

// Close image viewer and clean up
function closeImageViewer() {
    const viewer = document.getElementById('image-viewer');
    if (viewer) {
        viewer.remove();
        // Clean up event listeners
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
    }
}

// Center viewer on screen
function centerViewer() {
    const viewer = document.getElementById('image-viewer');
    if (!viewer) return;
    
    viewer.style.left = '50%';
    viewer.style.top = '50%';
    viewer.style.transform = 'translate(-50%, -50%)';
    delete viewer.dataset.dragged;
}

// Updated makeWindowDraggable with centering support
function makeWindowDraggable(windowElement) {
    const titleBar = windowElement.querySelector('.title-bar');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    titleBar.addEventListener('mousedown', dragStart);
    titleBar.addEventListener('touchstart', dragStart, { passive: false });
    
    function dragStart(e) {
        if (e.target.tagName === 'BUTTON') return;
        
        e.preventDefault();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Calculate offset from current position
        const rect = windowElement.getBoundingClientRect();
        initialX = clientX - rect.left;
        initialY = clientY - rect.top;
        
        // Remove transform to enable absolute positioning
        windowElement.style.transform = 'none';
        windowElement.style.left = rect.left + 'px';
        windowElement.style.top = rect.top + 'px';
        windowElement.dataset.dragged = 'true';
        
        isDragging = true;
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        currentX = clientX - initialX;
        currentY = clientY - initialY;
        
        // Keep window within viewport
        const maxX = window.innerWidth - windowElement.offsetWidth;
        const maxY = window.innerHeight - windowElement.offsetHeight;
        
        currentX = Math.max(0, Math.min(currentX, maxX));
        currentY = Math.max(0, Math.min(currentY, maxY));
        
        windowElement.style.left = currentX + 'px';
        windowElement.style.top = currentY + 'px';
    }
    
    function dragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);
    }
}

// Improved zoom function with container constraints
function zoomImage(action) {
    const img = document.getElementById('viewer-image');
    const zoomLevel = document.getElementById('zoom-level');
    const container = document.getElementById('image-container');
    
    if (!img) return;
    
    switch(action) {
        case 'in':
            currentZoom = Math.min(currentZoom * 1.25, 3); // Reduced max zoom
            img.style.maxWidth = 'none';
            img.style.maxHeight = 'none';
            img.style.width = 'auto';
            img.style.height = 'auto';
            if (container) {
                container.style.overflow = 'auto';
            }
            break;
        case 'out':
            currentZoom = Math.max(currentZoom / 1.25, 0.2);
            if (currentZoom <= 1) {
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                if (container) {
                    container.style.overflow = 'hidden';
                }
            }
            break;
        case 'fit':
            currentZoom = 1;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.width = 'auto';
            img.style.height = 'auto';
            if (container) {
                container.style.overflow = 'hidden';
            }
            break;
        case 'actual':
            currentZoom = 1;
            img.style.maxWidth = 'none';
            img.style.maxHeight = 'none';
            img.style.width = 'auto';
            img.style.height = 'auto';
            if (container) {
                container.style.overflow = 'auto';
            }
            break;
    }
    
    img.style.transform = `rotate(${currentRotation}deg) scale(${currentZoom})`;
    
    if (zoomLevel) {
        zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    }
}

// Improved rotate function
function rotateImage(degrees) {
    currentRotation += degrees;
    const img = document.getElementById('viewer-image');
    if (img) {
        img.style.transform = `rotate(${currentRotation}deg) scale(${currentZoom})`;
    }
}