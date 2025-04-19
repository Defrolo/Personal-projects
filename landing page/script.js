document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked (optional)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // Form Validation
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const successMessage = document.getElementById('form-success-message');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission
            let isValid = true;

            // Reset previous errors and success message
            resetValidation();

            // Validate Name
            if (nameInput.value.trim() === '') {
                showError(nameInput, nameError, 'El nombre es obligatorio.');
                isValid = false;
            }

            // Validate Email
            if (emailInput.value.trim() === '') {
                showError(emailInput, emailError, 'El email es obligatorio.');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, emailError, 'Por favor, introduce un email válido.');
                isValid = false;
            }

            // Validate Message
            if (messageInput.value.trim() === '') {
                showError(messageInput, messageError, 'El mensaje es obligatorio.');
                isValid = false;
            }

            // If form is valid, show success message (and potentially submit data)
            if (isValid) {
                successMessage.style.display = 'block';
                form.reset(); // Clear the form fields
                // In a real application, you would send the data to a server here
                console.log('Formulario válido, enviando datos...');

                // Hide success message after a few seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }
        });
    }

    function showError(inputElement, errorElement, message) {
        if (inputElement && errorElement) {
            inputElement.classList.add('invalid');
            errorElement.textContent = message;
        }
    }

    function clearError(inputElement, errorElement) {
         if (inputElement && errorElement) {
            inputElement.classList.remove('invalid');
            errorElement.textContent = '';
         }
    }

    function resetValidation() {
        clearError(nameInput, nameError);
        clearError(emailInput, emailError);
        clearError(messageInput, messageError);
        if (successMessage) {
            successMessage.style.display = 'none';
        }
    }

    function isValidEmail(email) {
        // Simple regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Optional: Real-time validation feedback as user types
    if (nameInput) nameInput.addEventListener('input', () => clearError(nameInput, nameError));
    if (emailInput) emailInput.addEventListener('input', () => clearError(emailInput, emailError));
    if (messageInput) messageInput.addEventListener('input', () => clearError(messageInput, messageError));

});
