document.addEventListener('DOMContentLoaded', () => {
  /* ── Toast helper ── */
  function showToast(message, type = 'error') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-exit');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3500);
  }

  /* ── Toggle password visibility ── */
  const toggleBtn = document.querySelector('.toggle-password');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const input = document.getElementById('password');
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggleBtn.querySelector('.eye-open').style.display = isPassword ? 'none' : 'block';
      toggleBtn.querySelector('.eye-closed').style.display = isPassword ? 'block' : 'none';
    });
  }

  /* ── Register form ── */
  const registerForm = document.getElementById('register-form');
  const btnRegister = document.getElementById('btn-register');

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(registerForm);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');

    if (!firstName || !lastName || !email || !password) {
      showToast('Preencha todos os campos.', 'error');
      return;
    }

    // Loading state
    btnRegister.disabled = true;
    btnRegister.querySelector('.btn-text').style.display = 'none';
    btnRegister.querySelector('.btn-loader').style.display = 'flex';

    try {
      const response = await fetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });

      if (response.ok) {
        showToast('Conta criada com sucesso!', 'success');
        setTimeout(() => { window.location.href = '/'; }, 1000);
      } else {
        const err = await response.json().catch(() => null);
        showToast(err?.message || 'Erro ao criar conta.', 'error');
      }
    } catch (error) {
      showToast('Erro de conexão com o servidor.', 'error');
    } finally {
      btnRegister.disabled = false;
      btnRegister.querySelector('.btn-text').style.display = 'inline';
      btnRegister.querySelector('.btn-loader').style.display = 'none';
    }
  });
});