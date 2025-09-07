// Objeto que define os animais e seus brinquedos favoritos
const animais = {
  Rex: ["RATO", "BOLA"],
  Mimi: ["BOLA", "LASER"],
  Fofo: ["BOLA", "RATO", "LASER"],
  Zero: ["RATO", "BOLA"],
  Bola: ["CAIXA", "NOVELO"],
  Bebe: ["LASER", "RATO", "BOLA"],
  Loco: ["SKATE", "RATO"]
};

class AbrigoAnimais {
  /**
   * Método principal para encontrar pessoas aptas a adotar animais.
   * @param {string} brinquedosPessoa1 - Brinquedos da primeira pessoa, separados por vírgula
   * @param {string} brinquedosPessoa2 - Brinquedos da segunda pessoa, separados por vírgula
   * @param {string} ordemAnimais - Ordem dos animais, separados por vírgula
   * @returns {Object} - { lista: [...], erro: null } ou { lista: null, erro: "mensagem" }
   */
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    // Transforma strings em arrays
    const brinquedosA = brinquedosPessoa1.split(",");
    const brinquedosB = brinquedosPessoa2.split(",");
    const nomes = ordemAnimais.split(",");

    // Lista de brinquedos válidos a partir do objeto animais
    const todosBrinquedosAnimais = Object.values(animais).flat();
    const brinquedosValidos = [...new Set(todosBrinquedosAnimais)];

    // Valida se algum brinquedo informado não existe
    for (let b of [...brinquedosA, ...brinquedosB]) {
      if (!brinquedosValidos.includes(b)) {
        return { lista: null, erro: "Brinquedo inválido" };
      }
    }

    // Valida duplicados em animais
    if (new Set(nomes).size !== nomes.length) {
      return { lista: null, erro: "Animal inválido" };
    }

    let lista = [];
    let pessoas = [brinquedosA, brinquedosB];
    let adotadosPorPessoa = [0, 0]; // contador de animais adotados por cada pessoa

    // Processa cada animal
    for (let nome of nomes) {
      if (!animais[nome]) {
        return { lista: null, erro: "Animal inválido" };
      }

      const preferencias = animais[nome];
      let adotadoPor = [];

      // Verifica se cada pessoa pode adotar o animal
      for (let i = 0; i < pessoas.length; i++) {
        if (this.podeAdotar(nome, preferencias, pessoas[i])) {
          if (adotadosPorPessoa[i] < 3) {
            adotadoPor.push(i);
          }
        }
      }

      // Aplica regras especiais
      if (adotadoPor.length === 0 || (adotadoPor.length === 2 && this.ehGato(nome))) {
        // Nenhuma pessoa pode adotar ou gato não compartilha
        lista.push(`${nome} - abrigo`);
      } else if (adotadoPor.length === 2) {
        // Dois podem adotar (não sendo gato), ninguém leva
        lista.push(`${nome} - abrigo`);
      } else {
        // Apenas uma pessoa pode adotar
        const pessoa = adotadoPor[0];
        lista.push(`${nome} - pessoa ${pessoa + 1}`);
        adotadosPorPessoa[pessoa]++;
      }
    }

    // Retorna lista em ordem alfabética
    return { lista: lista.sort(), erro: null };
  }

  /**
   * Verifica se uma pessoa pode adotar um animal
   * @param {string} nome - Nome do animal
   * @param {Array} preferencias - Brinquedos preferidos do animal
   * @param {Array} brinquedosPessoa - Brinquedos que a pessoa possui
   * @returns {boolean}
   */
  podeAdotar(nome, preferencias, brinquedosPessoa) {
    if (nome === "Loco") {
      // Loco não se importa com a ordem, precisa de pelo menos um brinquedo
      return preferencias.some(b => brinquedosPessoa.includes(b));
    }

    // Para os demais, verifica se os brinquedos estão na ordem correta
    let idx = 0;
    for (let brinquedo of brinquedosPessoa) {
      if (brinquedo === preferencias[idx]) {
        idx++;
        if (idx === preferencias.length) return true;
      }
    }
    return false;
  }

  /**
   * Verifica se o animal é um gato
   * @param {string} nome
   * @returns {boolean}
   */
  ehGato(nome) {
    return ["Mimi", "Fofo", "Zero"].includes(nome);
  }
}

// Export necessário para compatibilidade com os testes automáticos
export { AbrigoAnimais as AbrigoAnimais };
