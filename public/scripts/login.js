document.addEventListener('DOMContentLoaded', () => {
  // Verifica se está na rota principal '/'
  if (window.location.pathname === '/') {
    // Limpa o token e os detalhes do usuário do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const email = formData.get('username');
    const password = formData.get('password');

    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;

        // Armazena o token e os detalhes do usuário no localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redireciona para o chat.html
        window.location.href = '../pages/chat.html';
      } else {
        console.error('Erro ao fazer login:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  });
});
