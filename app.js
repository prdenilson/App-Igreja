// ======================================================
// CAD CHURCH - APP.JS
// ======================================================

// ======================================================
// CONFIGURAÇÃO DO SUPABASE
// ======================================================

const SUPABASE_URL =
  'https://qnaohnaagsliiuthtvil.supabase.co';

const SUPABASE_KEY =
  'sb_publishable_9nwrjALfmbp5JWQZdqgFYw_g2sAPfwA';

let supabaseClient = null;


// ======================================================
// INICIALIZAR SUPABASE
// ======================================================

function iniciarSupabase() {

  if (supabaseClient) {
    return supabaseClient;
  }

  if (
    !window.supabase ||
    typeof window.supabase.createClient !== 'function'
  ) {

    console.error(
      'Biblioteca do Supabase não foi carregada.'
    );

    return null;
  }

  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

  return supabaseClient;
}


// ======================================================
// FUNÇÃO AUXILIAR
// ======================================================

function $(id) {
  return document.getElementById(id);
}


// ======================================================
// ENTRAR
// ======================================================

async function entrar() {

  const cliente = iniciarSupabase();

  if (!cliente) {

    alert(
      'Não foi possível iniciar o CAD CHURCH.\n\n' +
      'A conexão com o sistema de acesso não foi carregada.'
    );

    return;
  }

  const email = prompt(
    'Digite seu e-mail:'
  );

  if (!email) {
    return;
  }

  const senha = prompt(
    'Digite sua senha:'
  );

  if (!senha) {
    return;
  }

  const {
    data,
    error
  } =
    await cliente.auth.signInWithPassword({

      email: email.trim(),

      password: senha

    });


  if (error) {

    alert(
      'Não foi possível entrar.\n\n' +
      error.message
    );

    return;
  }


  if (!data || !data.user) {

    alert(
      'Usuário não encontrado.'
    );

    return;
  }


  await carregarCadastroUsuario(
    data.user.id
  );
}


// ======================================================
// PRIMEIRO ACESSO
// ======================================================

function primeiroAcesso() {

  $('splash').classList.add('hidden');

  $('cadastro').classList.remove('hidden');

  $('home').classList.add('hidden');

  $('cadNome').value = '';

  $('cadTelefone').value = '';

  $('cadNome').focus();
}


// ======================================================
// SALVAR CADASTRO
// ======================================================

async function salvarCadastro(event) {

  event.preventDefault();

  const cliente = iniciarSupabase();

  if (!cliente) {

    alert(
      'Não foi possível conectar ao sistema.'
    );

    return;
  }


  const nome =
    $('cadNome').value.trim();

  const telefone =
    $('cadTelefone').value.trim();


  if (!nome) {

    alert(
      'Digite seu nome completo.'
    );

    return;
  }


  const {
    data: dadosUsuario,
    error: erroUsuario
  } =
    await cliente.auth.getUser();


  const user =
    dadosUsuario
      ? dadosUsuario.user
      : null;


  if (erroUsuario && erroUsuario.message) {

    console.warn(
      'Usuário ainda não conectado.'
    );
  }


  // ==================================================
  // PRIMEIRO ACESSO
  // ==================================================

  if (!user) {

    const email = prompt(
      'Agora digite o e-mail que será usado para entrar no CAD CHURCH:'
    );

    if (!email) {
      return;
    }


    const senha = prompt(
      'Crie uma senha para o seu acesso:\n\n' +
      'Use pelo menos 6 caracteres.'
    );

    if (!senha) {
      return;
    }


    if (senha.length < 6) {

      alert(
        'A senha precisa ter pelo menos 6 caracteres.'
      );

      return;
    }


    // ==================================================
    // CRIAR USUÁRIO NO AUTH
    // ==================================================

    const {
      data: cadastroAuth,
      error: erroAuth
    } =
      await cliente.auth.signUp({

        email: email.trim(),

        password: senha

      });


    if (erroAuth) {

      alert(
        'Não foi possível criar seu acesso.\n\n' +
        erroAuth.message
      );

      return;
    }


    if (
      !cadastroAuth ||
      !cadastroAuth.user
    ) {

      alert(
        'Não foi possível criar o usuário.'
      );

      return;
    }


    // ==================================================
    // CONFIRMAÇÃO DE E-MAIL
    // ==================================================

    if (!cadastroAuth.session) {

      alert(
        'Seu cadastro foi criado.\n\n' +
        'É necessário confirmar o e-mail antes de entrar no aplicativo.'
      );

      voltarSplash();

      return;
    }


    // ==================================================
    // CRIAR MEMBRO
    // ==================================================

    const {
      error: erroMembro
    } =
      await cliente
        .from('membros')
        .insert({

          auth_id:
            cadastroAuth.user.id,

          nome:
            nome,

          telefone:
            telefone,

          tipo_acesso:
            'MEMBRO',

          funcao_lideranca:
            null,

          status:
            'ATIVO'

        });


    if (erroMembro) {

      alert(
        'O usuário foi criado, mas houve um problema ao salvar o cadastro.\n\n' +
        erroMembro.message
      );

      return;
    }


    alert(
      'Cadastro realizado com sucesso!\n\n' +
      'Bem-vindo ao CAD CHURCH.'
    );


    await carregarCadastroUsuario(
      cadastroAuth.user.id
    );

    return;
  }


  // ==================================================
  // ATUALIZAÇÃO DO PERFIL
  // ==================================================

  const {
    error: erroAtualizacao
  } =
    await cliente
      .from('membros')
      .update({

        nome:
          nome,

        telefone:
          telefone

      })
      .eq(
        'auth_id',
        user.id
      );


  if (erroAtualizacao) {

    alert(
      'Não foi possível atualizar seus dados.\n\n' +
      erroAtualizacao.message
    );

    return;
  }


  alert(
    'Seus dados foram atualizados.'
  );


  await carregarCadastroUsuario(
    user.id
  );
}


// ======================================================
// CARREGAR CADASTRO
// ======================================================

async function carregarCadastroUsuario(
  authId
) {

  const cliente =
    iniciarSupabase();

  if (!cliente) {
    return;
  }


  const {
    data: membro,
    error
  } =
    await cliente
      .from('membros')
      .select('*')
      .eq(
        'auth_id',
        authId
      )
      .single();


  if (error) {

    console.error(error);

    alert(
      'Não foi possível carregar seu cadastro.\n\n' +
      error.message
    );

    return;
  }


  if (!membro) {

    alert(
      'Seu usuário existe, mas seu cadastro de membro não foi encontrado.'
    );

    return;
  }


  // ==================================================
  // VERIFICAR STATUS
  // ==================================================

  if (
    membro.status !==
    'ATIVO'
  ) {

    alert(
      'Seu acesso está inativo.\n\n' +
      'Procure o administrador da igreja.'
    );

    await cliente.auth.signOut();

    voltarSplash();

    return;
  }


  // ==================================================
  // NOME
  // ==================================================

  $('nome').textContent =
    membro.nome ||
    'Membro';


  // ==================================================
  // TRILHO
  // ==================================================

  atualizarTrilho(
    membro
  );


  // ==================================================
  // ÁREA ADMINISTRATIVA
  // ==================================================

  mostrarAreaCorreta(
    membro
  );


  // ==================================================
  // MOSTRAR HOME
  // ==================================================

  $('splash').classList.add(
    'hidden'
  );

  $('cadastro').classList.add(
    'hidden'
  );

  $('home').classList.remove(
    'hidden'
  );


  fecharModulo();
}


// ======================================================
// TRILHO MINISTERIAL
// ======================================================

function atualizarTrilho(
  membro
) {

  let nivel =
    'VISITANTE';

  let progresso =
    10;

  let etiqueta =
    'AZUL';


  if (
    membro.tipo_acesso ===
    'MEMBRO'
  ) {

    nivel =
      'MEMBRO';

    progresso =
      35;

    etiqueta =
      'VERDE';
  }


  if (
    membro.tipo_acesso ===
    'LIDER'
  ) {

    nivel =
      'LÍDER';

    progresso =
      70;

    etiqueta =
      'DOURADO';
  }


  if (
    membro.tipo_acesso ===
    'ADMINISTRADOR'
  ) {

    nivel =
      'ADMINISTRADOR';

    progresso =
      100;

    etiqueta =
      'ADMIN';
  }


  $('trilhoNivel').textContent =
    nivel;

  $('trilhoCor').textContent =
    etiqueta;

  $('progresso').style.width =
    progresso + '%';

  $('progressoTexto').textContent =
    'Seu nível atual no CAD CHURCH: ' +
    nivel;
}


// ======================================================
// ÁREA ADMINISTRATIVA
// ======================================================

function mostrarAreaCorreta(
  membro
) {

  const adminArea =
    $('adminArea');

  if (!adminArea) {
    return;
  }


  if (
    membro.tipo_acesso ===
    'ADMINISTRADOR'
  ) {

    adminArea.classList.remove(
      'hidden'
    );

  } else {

    adminArea.classList.add(
      'hidden'
    );
  }
}


// ======================================================
// ABRIR MÓDULO (CORRIGIDA)
// ======================================================

function abrirModulo(modulo) {

  // Esconde a div de oração preventivamente para qualquer módulo
  const pedidoOracao = $('pedidoOracao');
  if (pedidoOracao) {
    pedidoOracao.classList.add('hidden');
  }

  if (modulo === 'adminMembros') {
    abrirAdminMembros();
    return;
  }

  if (modulo === 'adminAgenda') {
    abrirAdminAgenda();
    return;
  }

  if (modulo === 'adminAvisos') {
    abrirAdminAvisos();
    return;
  }

  if (modulo === 'perfil') {
    abrirPerfil();
    return;
  }

  const titulos = {
    agenda: 'Agenda',
    oracao: 'Oração',
    estudos: 'Estudos',
    contribuicoes: 'Contribuições',
    cultos: 'Cultos',
    avisos: 'Avisos',
    ministerios: 'Ministérios',
    perfil: 'Meu Perfil',
    trilho: 'Seu Trilho Ministerial'
  };

  const textos = {
    agenda: 'Aqui ficarão as programações e eventos da igreja.',
    oracao: 'Compartilhe seu pedido de oração conosco. Escreva abaixo e envie pelo WhatsApp.',
    estudos: 'Aqui estarão os estudos bíblicos e materiais para crescimento espiritual.',
    contribuicoes: 'Aqui ficarão as informações sobre dízimos e ofertas.',
    cultos: 'Aqui estarão os horários e informações dos cultos.',
    avisos: 'Aqui aparecerão os comunicados importantes da igreja.',
    ministerios: 'Aqui estarão os ministérios e áreas de serviço da igreja.',
    trilho: 'Aqui você poderá acompanhar sua caminhada e seu desenvolvimento ministerial.'
  };

  $('moduloTitulo').textContent = titulos[modulo] || 'CAD CHURCH';
  $('moduloTexto').innerHTML = textos[modulo] || 'Este módulo será desenvolvido em seguida.';

  // Exibe a div do pedido de oração se o módulo for 'oracao'
  if (modulo === 'oracao' && pedidoOracao) {
    pedidoOracao.classList.remove('hidden');
  }

  $('modulo').classList.remove('hidden');
}
// ======================================================
// PERFIL
// ======================================================

async function abrirPerfil() {

  const cliente =
    iniciarSupabase();

  if (!cliente) {
    return;
  }


  const {
    data: {
      user
    }
  } =
    await cliente.auth.getUser();


  if (!user) {

    alert(
      'Você precisa estar conectado.'
    );

    return;
  }


  const {
    data: membro,
    error
  } =
    await cliente
      .from('membros')
      .select('*')
      .eq(
        'auth_id',
        user.id
      )
      .single();


  if (error) {

    alert(
      'Erro ao carregar perfil.\n\n' +
      error.message
    );

    return;
  }


  $('moduloTitulo').textContent =
    'Meu Perfil';


  $('moduloTexto').innerHTML = `

    <div class="perfil-box">

      <p>
        <strong>Nome:</strong><br>
        ${escapar(
          membro.nome || ''
        )}
      </p>

      <p>
        <strong>Telefone:</strong><br>
        ${escapar(
          membro.telefone ||
          'Não informado'
        )}
      </p>

      <p>
        <strong>Nível de acesso:</strong><br>
        ${escapar(
          membro.tipo_acesso ||
          'MEMBRO'
        )}
      </p>

      <p>
        <strong>Função de liderança:</strong><br>
        ${escapar(
          membro.funcao_lideranca ||
          'Não definida'
        )}
      </p>

      <p>
        <strong>Status:</strong><br>
        ${escapar(
          membro.status ||
          'ATIVO'
        )}
      </p>

      <button onclick="editarPerfil()">
        ✏️ Editar meus dados
      </button>

      <button onclick="sair()">
        🚪 Sair
      </button>

    </div>

  `;


  $('modulo').classList.remove(
    'hidden'
  );
}


// ======================================================
// EDITAR PERFIL
// ======================================================

async function editarPerfil() {

  const cliente =
    iniciarSupabase();

  if (!cliente) {
    return;
  }


  const {
    data: {
      user
    }
  } =
    await cliente.auth.getUser();


  if (!user) {

    alert(
      'Você precisa estar conectado.'
    );

    return;
  }


  const {
    data: membro
  } =
    await cliente
      .from('membros')
      .select('*')
      .eq(
        'auth_id',
        user.id
      )
      .single();


  if (!membro) {
    return;
  }


  $('moduloTitulo').textContent =
    'Editar meu perfil';


  $('moduloTexto').innerHTML = `

    <form onsubmit="salvarPerfil(event)">

      <label>
        Nome completo
      </label>

      <input
        id="perfilNome"
        value="${escapar(
          membro.nome || ''
        )}"
        required
      >

      <label>
        Telefone
      </label>

      <input
        id="perfilTelefone"
        value="${escapar(
          membro.telefone || ''
        )}"
        type="tel"
      >

      <button type="submit">
        SALVAR
      </button>

    </form>

  `;


  $('modulo').classList.remove(
    'hidden'
  );
}


// ======================================================
// SALVAR PERFIL
// ======================================================

async function salvarPerfil(
  event
) {

  event.preventDefault();

  const cliente =
    iniciarSupabase();

  if (!cliente) {
    return;
  }


  const nome =
    $('perfilNome')
      .value
      .trim();


  const telefone =
    $('perfilTelefone')
      .value
      .trim();


  const {
    data: {
      user
    }
  } =
    await cliente.auth.getUser();


  if (!user) {

    alert(
      'Sessão encerrada.'
    );

    return;
  }


  const {
    error
  } =
    await cliente
      .from('membros')
      .update({

        nome:
          nome,

        telefone:
          telefone

      })
      .eq(
        'auth_id',
        user.id
      );


  if (error) {

    alert(
      'Não foi possível salvar.\n\n' +
      error.message
    );

    return;
  }


  alert(
    'Perfil atualizado com sucesso.'
  );


  await carregarCadastroUsuario(
    user.id
  );
}


// ======================================================
// ADMINISTRADOR - MEMBROS
// ======================================================

async function abrirAdminMembros() {

  const cliente =
    iniciarSupabase();

  if (!cliente) {
    return;
  }


  const {
    data: {
      user
    }
  } =
    await cliente.auth.getUser();


  if (!user) {

    alert(
      'Você precisa estar conectado.'
    );

    return;
  }


  const {
    data: administrador
  } =
    await cliente
      .from('membros')
      .select(
        'tipo_acesso,status'
      )
      .eq(
        'auth_id',
        user.id
      )
      .single();


  if (
    !administrador ||
    administrador.tipo_acesso !==
      'ADMINISTRADOR' ||
    administrador.status !==
      'ATIVO'
  ) {

    alert(
      'Acesso restrito ao administrador.'
    );

    return;
  }


  const {
    data: membros,
    error
  } =
    await cliente
      .from('membros')
      .select('*')
      .order('nome');


  if (error) {

    alert(
      'Erro ao carregar membros.\n\n' +
      error.message
    );

    return;
  }


  let html = `

    <h3>
      👥 Membros cadastrados
    </h3>

    <p>
      Aqui o administrador poderá controlar
      os acessos dos membros.
    </p>

  `;


  if (
    !membros ||
    membros.length === 0
  ) {

    html +=
      '<p>Nenhum membro cadastrado.</p>';

  } else {

    membros.forEach(
      function(membro) {

        html += `

          <div class="membro-admin">

            <strong>
              ${escapar(
                membro.nome ||
                'Sem nome'
              )}
            </strong>

            <small>
              Acesso:
              ${escapar(
                membro.tipo_acesso ||
                ''
              )}
            </small>

            <small>
              Status:
              ${escapar(
                membro.status ||
                ''
              )}
            </small>

            <small>
              Função:
              ${escapar(
                membro.funcao_lideranca ||
                'Nenhuma'
              )}
            </small>

          </div>

        `;

      }
    );

  }


  $('moduloTitulo').textContent =
    'Gerenciar Membros';

  $('moduloTexto').innerHTML =
    html;

  $('modulo').classList.remove(
    'hidden'
  );
}


// ======================================================
// ADMINISTRADOR - AGENDA
// ======================================================

function abrirAdminAgenda() {

  $('moduloTitulo').textContent =
    'Gerenciar Agenda';


  $('moduloTexto').innerHTML = `

    <p>
      Esta área será usada para criar,
      editar e organizar os eventos da igreja.
    </p>

    <button onclick="alert('Módulo de agenda será desenvolvido.')">
      ➕ Criar evento
    </button>

  `;


  $('modulo').classList.remove(
    'hidden'
  );
}


// ======================================================
// ADMINISTRADOR - AVISOS
// ======================================================

function abrirAdminAvisos() {

  $('moduloTitulo').textContent =
    'Gerenciar Avisos';


  $('moduloTexto').innerHTML = `

    <p>
      Esta área será usada para publicar
      comunicados para os membros.
    </p>

    <button onclick="alert('Módulo de avisos será desenvolvido.')">
      📢 Criar aviso
    </button>

  `;


  $('modulo').classList.remove(
    'hidden'
  );
}


// ======================================================
// FECHAR MÓDULO (CORRIGIDA)
// ======================================================

function fecharModulo() {

  if (!$('modulo')) {
    return;
  }

  $('modulo').classList.add(
    'hidden'
  );

  // Esconde o formulário de oração ao fechar o módulo
  const pedidoOracao = $('pedidoOracao');
  if (pedidoOracao) {
    pedidoOracao.classList.add('hidden');
  }

  $('moduloTitulo').textContent =
    '';

  $('moduloTexto').textContent =
    '';
}
// ======================================================
// MOSTRAR HOME
// ======================================================

function mostrarHome() {

  $('modulo').classList.add(
    'hidden'
  );

  $('home').classList.remove(
    'hidden'
  );

  $('splash').classList.add(
    'hidden'
  );

  $('cadastro').classList.add(
    'hidden'
  );
}


// ======================================================
// VOLTAR PARA SPLASH
// ======================================================

function voltarSplash() {

  $('splash').classList.remove(
    'hidden'
  );

  $('home').classList.add(
    'hidden'
  );

  $('cadastro').classList.add(
    'hidden'
  );

  fecharModulo();
}


// ======================================================
// SAIR
// ======================================================

async function sair() {

  const cliente =
    iniciarSupabase();

  if (cliente) {

    await cliente.auth.signOut();

  }


  voltarSplash();

  alert(
    'Você saiu do CAD CHURCH.'
  );
}


// ======================================================
// ESCAPAR TEXTO
// ======================================================

function escapar(texto) {

  return String(texto)

    .replace(
      /&/g,
      '&amp;'
    )

    .replace(
      /</g,
      '&lt;'
    )

    .replace(
      />/g,
      '&gt;'
    )

    .replace(
      /"/g,
      '&quot;'
    )

    .replace(
      /'/g,
      '&#039;'
    );
}


// ======================================================
// VERIFICAR SESSÃO
// ======================================================

async function verificarSessao() {

  const cliente =
    iniciarSupabase();

  if (!cliente) {
    return;
  }


  const {
    data: {
      session
    }
  } =
    await cliente.auth.getSession();


  if (
    session &&
    session.user
  ) {

    await carregarCadastroUsuario(
      session.user.id
    );

  } else {

    voltarSplash();

  }
}


// ======================================================
// PEDIDO DE ORAÇÃO - WHATSAPP
// ======================================================

function enviarPedidoOracao() {

  const campo =
    $('textoOracao');


  if (!campo) {
    return;
  }


  const pedido =
    campo.value.trim();


  if (!pedido) {

    alert(
      'Por favor, escreva seu pedido de oração antes de enviar.'
    );

    campo.focus();

    return;
  }


  const numeroWhatsApp =
    '5585988590024';


  const mensagem =
    '🙏 NOVO PEDIDO DE ORAÇÃO - CAD CHURCH\n\n' +
    'Olá! Gostaria de pedir oração:\n\n' +
    pedido;


  const url =
    'https://wa.me/' +
    numeroWhatsApp +
    '?text=' +
    encodeURIComponent(
      mensagem
    );


  window.open(
    url,
    '_blank'
  );


  campo.value =
    '';
}


// ======================================================
// DISPONIBILIZAR FUNÇÕES PARA O HTML
// ======================================================

window.entrar =
  entrar;

window.primeiroAcesso =
  primeiroAcesso;

window.salvarCadastro =
  salvarCadastro;

window.abrirModulo =
  abrirModulo;

window.fecharModulo =
  fecharModulo;

window.mostrarHome =
  mostrarHome;

window.voltarSplash =
  voltarSplash;

window.sair =
  sair;

window.editarPerfil =
  editarPerfil;

window.salvarPerfil =
  salvarPerfil;

window.abrirAdminMembros =
  abrirAdminMembros;

window.abrirAdminAgenda =
  abrirAdminAgenda;

window.abrirAdminAvisos =
  abrirAdminAvisos;

window.enviarPedidoOracao =
  enviarPedidoOracao;


// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener(
  'DOMContentLoaded',
  function() {

    verificarSessao();

  }
);