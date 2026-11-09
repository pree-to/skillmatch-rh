
// Classe principal dos candidatos
export class Candidato {
  constructor(dados) {
    this.id = dados.id;
    this.nome = dados.nome;
    this.area = dados.area;
    this.habilidades = dados.habilidades;
    this.experienciaMeses = dados.experienciaMeses;
    this.cidade = dados.cidade;
  }

  // Compara as habilidades do candidato com os requisitos da vaga
  calcularCompatibilidade(requisitos) {
    const habilidadesNormalizadas = this.habilidades.map(
      habilidade => habilidade.toLowerCase().trim()
    );

    const atendidos = requisitos.filter(requisito =>
      habilidadesNormalizadas.includes(
        requisito.toLowerCase().trim()
      )
    );

    const faltantes = requisitos.filter(requisito =>
      !habilidadesNormalizadas.includes(
        requisito.toLowerCase().trim()
      )
    );

    const percentual = Math.round(
      (atendidos.length / requisitos.length) * 100
    );

    return {
      atendidos,
      faltantes,
      percentual
    };
  }

  obterPerfil() {
    return "Candidato profissional";
  }
}

// Classe especializada para candidatos em estágio
export class CandidatoEstagio extends Candidato {
  constructor(dados) {
    super(dados);
    this.curso = dados.curso;
  }

  // Sobrescreve o método da classe principal
  obterPerfil() {
    return `Estagiário · ${this.curso}`;
  }
}

// Classifica o nível de compatibilidade
function classificarCandidato(percentual) {
  if (percentual >= 80) {
    return "Alta";
  } else if (percentual >= 50) {
    return "Média";
  } else {
    return "Baixa";
  }
}

// Motor principal: compara uma vaga com todos os candidatos
export function analisarCandidatos(vaga, dadosCandidatos) {

  // Transforma os dados do JSON em objetos das classes
  const candidatos = dadosCandidatos.map(dados => {
    if (dados.tipo === "estagio") {
      return new CandidatoEstagio(dados);
    }

    return new Candidato(dados);
  });

  // Calcula a compatibilidade de cada candidato
  const resultados = candidatos.map(candidato => {
    const analise = candidato.calcularCompatibilidade(
      vaga.requisitos
    );

    return {
      ...candidato,
      ...analise,
      classificacao: classificarCandidato(analise.percentual),
      perfil: candidato.obterPerfil()
    };
  });

  // Ordena do maior para o menor percentual
  resultados.sort((a, b) =>
    b.percentual - a.percentual
  );

  // Encontra o melhor candidato usando reduce
  const melhorCandidato = resultados.reduce((melhor, atual) => {
    if (atual.percentual > melhor.percentual) {
      return atual;
    }

    if (
      atual.percentual === melhor.percentual &&
      atual.experienciaMeses > melhor.experienciaMeses
    ) {
      return atual;
    }

    return melhor;
  });

  // Mantém a lista e disponibiliza o melhor candidato
  resultados.melhorCandidato = melhorCandidato;

  return resultados;
}
