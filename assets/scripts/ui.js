// Este módulo cuida dos eventos do formulário e da criação dos cards no DOM.

export function configurarFormulario(aoEnviar) {
  const formulario = document.querySelector("#job-form");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const feedback = document.querySelector("#form-feedback");
    const cargo = document.querySelector("#cargo").value.trim();
    const area = document.querySelector("#area").value;
    const requisitos = document.querySelector("#requisitos").value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    const experienciaMinimaMeses = Number(
      document.querySelector("#experiencia").value
    );

    if (
      !cargo ||
      !area ||
      requisitos.length === 0 ||
      !Number.isFinite(experienciaMinimaMeses) ||
      experienciaMinimaMeses < 0
    ) {
      feedback.textContent =
        "Preencha o cargo, a área, ao menos um requisito e uma experiência válida.";
      return;
    }

    // Evita requisitos repetidos, sem diferenciar maiúsculas/minúsculas.
    const requisitosUnicos = [...new Map(
      requisitos.map((item) => [item.toLowerCase(), item])
    ).values()];

    feedback.textContent = "";
    aoEnviar({
      cargo,
      area,
      requisitos: requisitosUnicos,
      experienciaMinimaMeses
    });
  });
}

export function exibirStatus(tipo, mensagem = "") {
  const status = document.querySelector("#results-status");
  const icone = document.createElement("div");
  icone.className = "empty-icon";
  icone.setAttribute("aria-hidden", "true");

  const titulo = document.createElement("h3");
  const descricao = document.createElement("p");

  if (tipo === "loading") {
    icone.textContent = "◌";
    titulo.textContent = "Carregando candidatos…";
    descricao.textContent = "Aguarde enquanto buscamos os perfis.";
  } else if (tipo === "error") {
    icone.textContent = "!";
    titulo.textContent = "Não foi possível carregar os candidatos";
    descricao.textContent = mensagem || "Verifique os arquivos e tente novamente.";
  } else {
    icone.textContent = "◎";
    titulo.textContent = "Aguardando sua vaga";
    descricao.textContent = "Cadastre uma vaga para começar a análise.";
  }

  status.replaceChildren(icone, titulo, descricao);
  status.hidden = false;
}

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function atualizarResumo(vaga) {
  const resumo = document.querySelector("#job-summary");
  const conteudo = document.createElement("div");
  const titulo = criarElemento("strong", "", vaga.cargo);
  const descricao = criarElemento(
    "p",
    "",
    `${vaga.area} · ${vaga.requisitos.length} requisito(s) · Experiência mínima: ${vaga.experienciaMinimaMeses} mês(es)`
  );

  conteudo.append(titulo, descricao);
  const icone = criarElemento("span", "summary-icon", "✦");
  icone.setAttribute("aria-hidden", "true");
  resumo.replaceChildren(icone, conteudo);
}

function criarCard(candidato, vaga) {
  const card = criarElemento("article", "candidate-card");
  const topo = criarElemento("div", "candidate-card-top");
  const nome = criarElemento("h3", "candidate-name", candidato.nome);
  const percentual = criarElemento(
    "span",
    `match-score match-${candidato.classificacao.toLowerCase()}`,
    `${candidato.percentual}%`
  );
  topo.append(nome, percentual);

  const perfil = criarElemento("p", "candidate-meta",
    `${candidato.perfil} · ${candidato.cidade}`);
  const area = criarElemento("p", "candidate-meta",
    `Área: ${candidato.area}${candidato.area === vaga.area ? " · Compatível" : " · Área diferente"}`);
  const experienciaAtendida =
    candidato.experienciaMeses >= vaga.experienciaMinimaMeses;
  const experiencia = criarElemento(
    "p",
    `candidate-meta ${experienciaAtendida ? "requirement-ok" : "requirement-missing"}`,
    `Experiência: ${candidato.experienciaMeses} mês(es) — ${
      experienciaAtendida ? "atende ao mínimo" : "abaixo do mínimo exigido"
    }`
  );

  const habilidades = criarElemento("div", "skills-list");
  candidato.atendidos.forEach((habilidade) => {
    habilidades.append(criarElemento("span", "skill skill-ok", habilidade));
  });
  candidato.faltantes.forEach((habilidade) => {
    habilidades.append(criarElemento("span", "skill skill-missing", habilidade));
  });

  const faltantes = criarElemento(
    "p",
    "candidate-recommendation",
    candidato.faltantes.length
      ? `Sugestão de desenvolvimento: estudar ${candidato.faltantes.join(", ")}.`
      : "O candidato atende a todos os requisitos informados."
  );

  const classificacao = criarElemento(
    "span",
    "classification",
    `Compatibilidade ${candidato.classificacao}`
  );

  card.append(topo, perfil, area, experiencia, classificacao, habilidades, faltantes);
  return card;
}

export function exibirCandidatos(resultados, vaga) {
  const status = document.querySelector("#results-status");
  const lista = document.querySelector("#candidate-list");
  const destaque = document.querySelector("#best-candidate");

  atualizarResumo(vaga);
  lista.replaceChildren();
  destaque.replaceChildren();

  if (resultados.length === 0) {
    destaque.hidden = true;
    lista.hidden = true;
    exibirStatus("empty");
    return;
  }

  status.hidden = true;
  lista.hidden = false;
  destaque.hidden = false;

  const melhor = resultados.melhorCandidato || resultados[0];
  const titulo = criarElemento("p", "eyebrow", "MELHOR COMPATIBILIDADE");
  const nome = criarElemento("h3", "", melhor.nome);
  const descricao = criarElemento(
    "p",
    "muted",
    `${melhor.percentual}% de compatibilidade · ${melhor.classificacao} · ${melhor.experienciaMeses} mês(es) de experiência`
  );
  destaque.append(titulo, nome, descricao);

  resultados.forEach((candidato) => {
    lista.append(criarCard(candidato, vaga));
  });
}
