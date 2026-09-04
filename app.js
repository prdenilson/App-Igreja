/* ======================================================
   CAD CHURCH - APP.JS (SISTEMA DE PÁGINAS INDEPENDENTES)
====================================================== */

// Função auxiliar para navegar entre as páginas usando a classe 'active'
function irParaPagina(idPagina) {
  const paginas = document.querySelectorAll('.page');
  paginas.forEach(p => p.classList.remove('active'));

  const paginaAlvo = document.getElementById(idPagina);
  if (paginaAlvo) {
    paginaAlvo.classList.add('active');
  }
}

// Ação do botão ENTRAR na Splash
function entrar() {
  const usuarioLogado = localStorage.getItem('cad_usuario');
  if (usuarioLogado) {
    const usuario = JSON.parse(usuarioLogado);
    const nomeEl = document.getElementById('nome');
    if (nomeEl) nomeEl.innerText = usuario.nome || 'Membro';
  }
  irParaPagina('home');
}

// Navegação rápida
function primeiroAcesso() {
  irParaPagina('cadastro');
}

function voltarSplash() {
  irParaPagina('splash');
}

function mostrarHome() {
  irParaPagina('home');
}

// Abertura e preenchimento da PÁGINA INDEPENDENTE DO MÓDULO
function abrirModulo(modulo) {
  const tituloEl = document.getElementById('moduloTitulo');
  const textoEl = document.getElementById('moduloTexto');
  const pedOracaoEl = document.getElementById('pedidoOracao');

  // Oculta a área de oração por padrão
  if (pedOracaoEl) pedOracaoEl.classList.add('hidden');

  switch (modulo) {
    case 'trilho':
      tituloEl.innerText = 'Seu Trilho Ministerial';
      textoEl.innerHTML = '<p>Acompanhe aqui o seu crescimento e avanço na jornada espiritual da CAD CHURCH.</p>';
      break;
    case 'agenda':
      tituloEl.innerText = 'Agenda da Igreja';
      textoEl.innerHTML = '<p>Confira os próximos eventos, cultos especiais e reuniões programadas.</p>';
      break;
    case 'oracao':
      tituloEl.innerText = 'Pedidos de Oração';
      textoEl.innerHTML = '<p>Envie suas intenções e motivos de oração para que nossa equipe pastoral possa interceder por você.</p>';
      if (pedOracaoEl) pedOracaoEl.classList.remove('hidden');
      break;
    case 'estudos':
      tituloEl.innerText = 'Estudos Bíblicos';
      textoEl.innerHTML = '<p>Acesse aqui o material de estudo, lições de células e devocionais da semana.</p>';
      break;
    case 'contribuicoes':
      tituloEl.innerText = 'Contribuições';
      textoEl.innerHTML = '<p>Faça suas contribuições, dízimos e ofertas com segurança e praticidade via PIX.</p>';
      break;
    case 'cultos':
      tituloEl.innerText = 'Horários dos Cultos';
      textoEl.innerHTML = '<p><b>Culto de Celebração:</b> Domingos às 18h<br><b>Culto de Ensino:</b> Quartas-feiras às 19h30</p>';
      break;
    case 'avisos':
      tituloEl.innerText = 'Avisos da Semana';
      textoEl.innerHTML = '<p>Fique por dentro de todas as novidades e comunicados importantes da liderança.</p>';
      break;
    case 'ministerios':
      tituloEl.innerText = 'Ministérios';
      textoEl.innerHTML = '<p>Conheça nossas frentes de serviço e descubra como colocar seus dons em prática.</p>';
      break;
    case 'perfil':
      tituloEl.innerText = 'Meu Perfil';
      textoEl.innerHTML = '<p>Gerencie seus dados pessoais, telefone e preferências da conta.</p>';
      break;
    case 'adminMembros':
      tituloEl.innerText = 'Gerenciar Membros';
      textoEl.innerHTML = '<p>Painel de administração para consulta e acompanhamento dos membros cadastrados.</p>';
      break;
    case 'adminAgenda':
      tituloEl.innerText = 'Gerenciar Agenda';
      textoEl.innerHTML = '<p>Painel de administração para criar, alterar e excluir eventos do calendário.</p>';
      break;
    case 'adminAvisos':
      tituloEl.innerText = 'Gerenciar Avisos';
      textoEl.innerHTML = '<p>Painel de administração para criar e publicar novos comunicados.</p>';
      break;
    default:
      tituloEl.innerText = 'CAD CHURCH';
      textoEl.innerText = 'Conteúdo em desenvolvimento.';
  }

  // Exibe a página do módulo
  irParaPagina('modulo');
}

// Salva cadastro e redireciona para a Home
function salvarCadastro(event) {
  event.preventDefault();
  const nome = document.getElementById('cadNome').value;
  const telefone = document.getElementById('cadTelefone').value;

  const dados = { nome, telefone };
  localStorage.setItem('cad_usuario', JSON.stringify(dados));

  const nomeEl = document.getElementById('nome');
  if (nomeEl) nomeEl.innerText = nome;

  irParaPagina('home');
}

// Envio do pedido de oração para o WhatsApp
function enviarPedidoOracao() {
  const campoTexto = document.getElementById('textoOracao');
  if (!campoTexto) return;

  const texto = campoTexto.value;
  if (!texto.trim()) {
    alert('Por favor, digite seu pedido de oração antes de enviar.');
    return;
  }

  const mensagemFormatada = `🙏 *Pedido de Oração - CAD CHURCH*\n\n${texto}`;
  const url = `https://wa.me/?text=${encodeURIComponent(mensagemFormatada)}`;
  window.open(url, '_blank');
}
