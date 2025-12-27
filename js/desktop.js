// Email Function
function sendEmail() {
    const name = document.getElementById('sender-name')?.value;
    const email = document.getElementById('sender-email')?.value;
    const subject = document.getElementById('email-subject')?.value;
    const message = document.getElementById('email-message')?.value;

    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields!');
        return;
    }

    // Create mailto link
    const mailtoLink = `mailto:samuelwawerukamau01@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
    window.location.href = mailtoLink;

    alert('Opening your email client...');
}

// Logout (with link version)
function logout() {
    if (confirm('Are you sure you want to log off?')) {
        document.body.style.transition = 'opacity 1s';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            document.body.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0a58ca; color: white; font-size: 24px; flex-direction: column; font-family: Tahoma, sans-serif;">
                    <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 30px;">
                        <div style="background: #d4d0c8; padding: 8px; border: 2px solid; border-color: #ffffff #808080 #808080 #ffffff; box-shadow: 3px 3px 6px rgba(0,0,0,0.3);">
                            <div style="border: 2px solid; border-color: #808080 #ffffff #ffffff #808080; padding: 2px; background: #fff;">
                                <img src="assets/random_meme.jpg" alt="Shutdown" style="width: 350px; height: auto; max-height: 400px; object-fit: cover; display: block;">
                            </div>
                        </div>
                    </div>
                    
                    <div style="font-weight: bold; margin-bottom: 10px;">Hope You Enjoyed Your Visit</div>        
                    <br>            
                    <a href="javascript:location.reload()" style="
                        color: white;
                        text-decoration: none;
                        font-size: 16px;
                        padding: 10px 20px;
                        border: 2px solid white;
                        border-radius: 5px;
                        transition: all 0.3s;
                        display: inline-block;
                    " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='transparent'">
                        ← Click here to return to portfolio
                    </a>
                </div>
            `;
            document.body.style.opacity = '1';
        }, 1000);
    }
}