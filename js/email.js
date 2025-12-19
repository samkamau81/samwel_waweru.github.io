// Email functionality
const EmailHandler = {
    send: function() {
        const name = document.getElementById('sender-name').value;
        const email = document.getElementById('sender-email').value;
        const subject = document.getElementById('email-subject').value;
        const message = document.getElementById('email-message').value;

        // Validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields!');
            return;
        }

        // Create mailto link
        const mailtoLink = `mailto:samuelwawerukamau01@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        
        window.location.href = mailtoLink;
        alert('Opening your email client...');
    }
};