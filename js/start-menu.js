// Start menu functionality
const StartMenu = {
    init: function() {
        const startButton = document.getElementById('startButton');
        const startMenu = document.getElementById('startMenu');

        if (startButton && startMenu) {
            startButton.addEventListener('click', () => {
                startMenu.classList.toggle('active');
            });

            // Close start menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.start-button') && !e.target.closest('.start-menu')) {
                    startMenu.classList.remove('active');
                }
            });
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    StartMenu.init();
});