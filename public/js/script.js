document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('accountPassword');
  const toggleButton = document.getElementById('togglePassword');

  if (passwordInput && toggleButton) {
    toggleButton.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      toggleButton.textContent = isPassword ? 'Hide' : 'Show';
    });
  }

  const loginPasswordInput = document.getElementById('loginPassword');
  const toggleLoginPassword = document.getElementById('toggleLoginPassword');

  if (loginPasswordInput && toggleLoginPassword) {
    toggleLoginPassword.addEventListener('click', () => {
      const isHidden = loginPasswordInput.type === 'password';
      loginPasswordInput.type = isHidden ? 'text' : 'password';
      toggleLoginPassword.textContent = isHidden ? 'Hide password' : 'Show password';
    });
  }

  const form = document.getElementById('addClassificationForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      const input = document.getElementById('classification_name').value;
      const regex = /^[A-Za-z0-9]+$/;
      if (!regex.test(input)) {
        alert('Classification name must contain only letters and numbers, no spaces or special characters.');
        e.preventDefault();
      }
    });
  }
});
