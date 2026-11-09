import { carregarCandidatos, carregarVagaSalva, salvarVaga } from "./dados.js";
import { configurarFormulario, exibirCandidatos, exibirStatus } from "./ui.js";
import { analisarCandidatos } from "./motor.js";

// O main.js coordena os dados, as regras e a interface.
async function iniciarAplicacao() {
  exibirStatus("loading");
  try {
    const candidatos = await carregarCandidatos();
    const vagaSalva = carregarVagaSalva();
    if (vagaSalva) {
      document.querySelector("#cargo").value = vagaSalva.cargo;
      document.querySelector("#area").value = vagaSalva.area;
      document.querySelector("#requisitos").value = vagaSalva.requisitos.join(", ");
      document.querySelector("#experiencia").value = vagaSalva.experienciaMinimaMeses;
      const resultados = analisarCandidatos(vagaSalva, candidatos);
      exibirCandidatos(resultados, vagaSalva);
    } else {
      exibirStatus("empty");
    }

    configurarFormulario((vaga) => {
      salvarVaga(vaga);
      const resultados = analisarCandidatos(vaga, candidatos);
      exibirCandidatos(resultados, vaga);
    });
  } catch (erro) {
    exibirStatus("error", erro.message);
  }
}

iniciarAplicacao();
