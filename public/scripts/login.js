document.addEventListener('DOMContentLoaded', () => {
  // Limpa sessão quando entra na tela de login
  if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

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

  /* ── Login form ── */
  const loginForm = document.getElementById('login-form');
  const btnLogin = document.getElementById('btn-login');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const email = formData.get('username');
    const password = formData.get('password');

    if (!email || !password) {
      showToast('Preencha todos os campos.', 'error');
      return;
    }

    // Loading state
    btnLogin.disabled = true;
    btnLogin.querySelector('.btn-text').style.display = 'none';
    btnLogin.querySelector('.btn-loader').style.display = 'flex';

    try {
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        showToast('Login realizado com sucesso!', 'success');
        setTimeout(() => { window.location.href = '../pages/chat.html'; }, 600);
      } else {
        const err = await response.json().catch(() => null);
        showToast(err?.message || 'E-mail ou senha incorretos.', 'error');
      }
    } catch (error) {
      showToast('Erro de conexão com o servidor.', 'error');
    } finally {
      btnLogin.disabled = false;
      btnLogin.querySelector('.btn-text').style.display = 'inline';
      btnLogin.querySelector('.btn-loader').style.display = 'none';
    }
  });
});
