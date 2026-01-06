// --- BOTÃO VOLTAR AO TOPO ---
console.log("Script carregado");

window.addEventListener('scroll', function() {
  const btn = document.getElementById('btnTopo');
  if (!btn) return;
  if (window.scrollY > 300) btn.style.display = 'block';
  else btn.style.display = 'none';
});

function voltarAoTopo() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- THEME TOGGLE (com persistência) ---
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  // Aplica tema salvo no carregamento
  const saved = localStorage.getItem('theme') || '';
  if (saved === 'dark') {
    document.body.classList.add('dark-theme');
    themeBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-theme');
    themeBtn.textContent = '🌙';
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// --- SCROLL REVEAL SIMPLES: adiciona .visible nas .container quando entram na viewport ---
function revealOnScroll() {
  const items = document.querySelectorAll('.container');
  const windowH = window.innerHeight;
  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    if (rect.top < windowH - 80) { // quando estiver 80px dentro da viewport
      item.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== Validação do formulário de contato (client-side) =====
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const errName = document.getElementById('error-name');
  const errEmail = document.getElementById('error-email');
  const errMessage = document.getElementById('error-message');
  const successBox = document.getElementById('form-success');
  const btnReset = document.getElementById('btn-reset');

  // Regex simples para validar e-mail
  function isValidEmail(email) {
    // regex simples e segura suficiente para validação básica
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearErrors() {
    errName.textContent = '';
    errEmail.textContent = '';
    errMessage.textContent = '';
    successBox.style.display = 'none';
  }

  // Remover erro ao digitar
  [nameInput, emailInput, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      clearErrors();
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('SUBIT DISPARADO'); //Checkpoint para achar erros
    clearErrors();

    let valid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
      errName.textContent = 'Por favor, insira seu nome.';
      valid = false;
    }

    if (!email) {
      errEmail.textContent = 'Por favor, insira seu e-mail.';
      valid = false;
    } else if (!isValidEmail(email)) {
      errEmail.textContent = 'Informe um e-mail válido (ex.: voce@exemplo.com).';
      valid = false;
    }

    if (!message) {
      errMessage.textContent = 'A mensagem não pode ficar vazia.';
      valid = false;
    } else if (message.length < 8) {
      errMessage.textContent = 'Escreva uma mensagem um pouco mais longa (mínimo 8 caracteres).';
      valid = false;
    }

    if (!valid) {
      // foco no primeiro erro detectado
      const firstError = document.querySelector('.error:not(:empty)');
      if (firstError) {
        const related = firstError.previousElementSibling || firstError;
        if (related && related.focus) related.focus();
      }
      return;

    }

fetch('https://curriculo-backend-h8a5.onrender.com/contato', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: name,
    email: email,
    mensagem: message
  })
})
.then(res => res.json())
.then(data => {
  console.log(data);
  successBox.style.display = 'block';
  successBox.textContent = '✔ Mensagem enviada com sucesso!';
  form.reset();
})
.catch(err => {
  console.error(err);
  alert('Erro ao enviar mensagem');
});

  });

  // limpar formulário ao clicar no botão "Limpar"
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      form.reset();
      clearErrors();
    });
  }
})();
