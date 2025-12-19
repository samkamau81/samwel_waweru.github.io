// Window management system
const WindowManager = {
    open: function(windowId) {
        const window = document.getElementById(windowId);
        if (window) {
            window.classList.add('active');
        }
        
        // Close start menu when opening window
        const startMenu = document.getElementById('startMenu');
        if (startMenu) {
            startMenu.classList.remove('active');
        }
    },

    close: function(windowId) {
        const window = document.getElementById(windowId);
        if (window) {
            window.classList.remove('active');
        }
    },

    minimize: function(windowId) {
        const window = document.getElementById(windowId);
        if (window) {
            window.classList.remove('active');
        }
    }
};