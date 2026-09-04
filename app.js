/* =====================================================
   CAD CHURCH — APP.JS
   Navegação principal e cadastro
===================================================== */


/* =====================================================
   ENTRAR
===================================================== */

function entrar() {

  const usuarioSalvo = localStorage.getItem("cad_usuario");

  if (usuarioSalvo) {

    try {

      const usuario = JSON.parse(usuarioSalvo);

      const nomeEl = document.getElementById("nome");

      if (nomeEl) {
        nomeEl.textContent = usuario.nome || "Membro";
      }

    } catch (erro) {

      console.error(
        "Erro ao recuperar cadastro:",
        erro
      );

    }

  }

  mostrarTela("home");
}


/* =====================================================
   PRIMEIRO ACESSO
===================================================== */

function primeiroAcesso() {

  mostrarTela("cadastro");

}


/* =====================================================
   VOLTAR PARA A TELA INICIAL
===================================================== */

function voltarSplash() {

  mostrarTela("splash");

}


/* =====================================================
   MOSTRAR HOME
===================================================== */

function mostrarHome() {

  carregarUsuario();

  mostrarTela("home");

}


/* =====================================================
   CONTROLE DAS TELAS
===================================================== */

function mostrarTela(idTela) {

  const telas = document.querySelectorAll(".screen");

  telas.forEach(function(tela) {

    tela.classList.remove("active");

  });


  const tela = document.getElementById(idTela);

  if (tela) {

    tela.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

  }

}


/* =====================================================
   SALVAR CADASTRO
===================================================== */

function salvarCadastro(event) {

  event.preventDefault();


  const nomeCampo =
    document.getElementById("cadNome");

  const telefoneCampo =
    document.getElementById("cadTelefone");


  if (!nomeCampo) {
    return;
  }


  const nome =
    nomeCampo.value.trim();

  const telefone =
    telefoneCampo
      ? telefoneCampo.value.trim()
      : "";


  if (!nome) {

    alert(
      "Digite seu nome completo."
    );

    nomeCampo.focus();

    return;
  }


  const usuario = {

    nome: nome,

    telefone: telefone

  };


  localStorage.setItem(
    "cad_usuario",
    JSON.stringify(usuario)
  );


  const nomeEl =
    document.getElementById("nome");


  if (nomeEl) {

    nomeEl.textContent =
      nome;

  }


  mostrarTela("home");

}


/* =====================================================
   CARREGAR USUÁRIO
===================================================== */

function carregarUsuario() {

  const usuarioSalvo =
    localStorage.getItem("cad_usuario");


  if (!usuarioSalvo) {
    return;
  }


  try {

    const usuario =
      JSON.parse(usuarioSalvo);


    const nomeEl =
      document.getElementById("nome");


    if (nomeEl) {

      nomeEl.textContent =
        usuario.nome || "Membro";

    }


  } catch (erro) {

    console.error(
      "Não foi possível carregar o usuário:",
      erro
    );

  }

}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    carregarUsuario();

    mostrarTela("splash");

  }
);
