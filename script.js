const elementos = {
  iconePesquisa: document.querySelector("#icone-pesquisa"),
  inputPesquisa: document.querySelector(".input-pesquisa"),
  imagemPerfil: document.querySelector(".imagem-perfil"),
  username: document.querySelector(".username"),
  bio: document.querySelector(".bio-perfil"),
  quantidadeRepositorios: document.querySelector(".quantidade-repos"),
  quantidadeSeguidores: document.querySelector(".seguidores"),
};

elementos.iconePesquisa.addEventListener("click", preencherDadosGithub);

async function obterDadosGithub(usuario) {
  try {
    const username = checarPesquisaUsuario(usuario);

    const dadosUrl = `https://api.github.com/users/${username}`;
    const resposta = await fetch(dadosUrl);
    const dados = await resposta.json();

    return dados;
  } catch (err) {
    alert(err);
  }
}

function checarPesquisaUsuario(usuario) {
  const username = usuario === "" ? "zx2c4" : usuario;
  return username;
}

async function obterTodosRepositorios(usuario) {
  try {
    const username = checarPesquisaUsuario(usuario);

    const dadosRepositorios = `https://api.github.com/users/${username}/repos`;
    const resposta = await fetch(dadosRepositorios);
    const dadosRepos = await resposta.json();

    return dadosRepos;
  } catch (err) {
    alert(err);
  }
}

async function obterDadosRepositorios(usuario) {
  try {
    const username = checarPesquisaUsuario(usuario);
    const dadosRepositorios = await obterTodosRepositorios(username);

    const dadosImportantesRepositorios = [];

    dadosRepositorios.forEach((repositorio) => {
      dadosImportantesRepositorios.push({
        nome: repositorio.name,
        url: repositorio.html_url,
      });
    });

    return dadosImportantesRepositorios;
  } catch (err) {
    alert(err);
  }
}

async function preencherNomesRepositorios() {
  try {
    const dadosRepositorios = await obterDadosRepositorios(elementos.inputPesquisa.value);
    const repositoriosExistentes = document.querySelector(".dados-links");
    const elementoRepositorios = document.querySelector(".links-repositorios");
    elementoRepositorios.innerHTML = "";

    let dadosHtml = "";

    Object.entries(dadosRepositorios).forEach((chave) => {
      dadosHtml += `<a class="dados-links" href="${chave[1].url}">${chave[1].nome}</a><br />\n`;
    });

    const dadosGithub = document.createElement("div");

    dadosGithub.classList.add("dados-links");
    elementoRepositorios.appendChild(dadosGithub);
    dadosGithub.innerHTML = dadosHtml;
  } catch (err) {
    alert(err);
  }
}

async function preencherDadosGithub() {
  try {
    const dadosPerfil = await obterDadosGithub(elementos.inputPesquisa.value);
    if (dadosPerfil === null) return;

    elementos.imagemPerfil.src = dadosPerfil.avatar_url;
    elementos.username.innerHTML = `<strong>Username:</strong> ${dadosPerfil.login}`;

    if (dadosPerfil.bio === null) {
      elementos.bio.innerHTML = `<strong>Bio:</strong> Sem bio preenchida`;
    } else {
      elementos.bio.innerHTML = `<strong>Bio:</strong> ${dadosPerfil.bio}`;
    }
    elementos.quantidadeSeguidores.innerHTML = `<strong>Seguidores: </strong>${dadosPerfil.followers}`;
    if (dadosPerfil.public_repos === 0) {
      elementos.quantidadeRepositorios.innerHTML = `<strong>Quantidade repositorios</strong>: 0`;
    } else {
      elementos.quantidadeRepositorios.innerHTML = `<strong>Quantidade repositorios:</strong> ${dadosPerfil.public_repos}, sendo eles:`;
    }

    preencherNomesRepositorios();
  } catch (err) {
    alert(err);
  }
}

async function obterDadosPesquisa() {
  try {
    const elementoPesquisa = document.querySelector(".input-pesquisa");

    const urlPesquisa = "https://api.github.com/search/";
    const pesquisaInserida = elementoPesquisa.value;
    const resposta = await fetch(urlPesquisa + pesquisaInserida);
    const dados = await resposta.json();

    return dados;
  } catch (err) {
    alert(err);
  }
}

async function preencherDadosPesquisa() {
  const dadosPesquisa = await obterDadosPesquisa();
}

preencherDadosGithub();
