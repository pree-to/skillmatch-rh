// Este módulo concentra o fetch do JSON e a persistência da vaga.

const CHAVE_VAGA = "skillmatch-vaga";

export async function carregarCandidatos() {
  const resposta = await fetch("./assets/dados/candidatos.json");
  if (!resposta.ok) {
    throw new Error("Verifique sua conexão local e tente novamente.");
  }
  const candidatos = await resposta.json();
  if (!Array.isArray(candidatos) || candidatos.length === 0) {
    throw new Error("O banco de candidatos está vazio.");
  }
  return candidatos;
}

export function salvarVaga(vaga) {
  localStorage.setItem(CHAVE_VAGA, JSON.stringify(vaga));
}

export function carregarVagaSalva() {
  const vaga = localStorage.getItem(CHAVE_VAGA);
  return vaga ? JSON.parse(vaga) : null;
}
