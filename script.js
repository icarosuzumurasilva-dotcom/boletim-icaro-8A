// =====================================================
// BOLETIM DIGITAL — 8º ANO
// Dados fictícios para demonstração
// =====================================================

// ---------- CONCEITOS BÁSICOS (leia os comentários) ----------
// variável: uma "caixinha" onde guardamos um valor (ex.: const nome = "Ana")
// array: uma lista de valores (ex.: [1, 2, 3])
// objeto: um conjunto de informações com nomes (ex.: { disciplina: "Matemática", nota: 8 })
// função: um bloco de código que faz uma tarefa e pode ser chamado várias vezes
// if: usado para tomar decisões (se algo for verdade, faça isso)
// forEach: percorre cada item de um array e executa uma ação
// DOM: é a representação da página HTML que o JavaScript consegue ler e modificar

// =====================================================
// 1) DADOS BRUTOS (fictícios) — EXATAMENTE como combinado
// =====================================================
const dadosBrutos = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

// Média mínima de referência
const MEDIA_MINIMA = 6.0;

// =====================================================
// 2) FUNÇÃO: normalizarNota(valor)
// Converte qualquer formato de nota para a escala 0–10.
// Retorna null quando a nota ainda não foi lançada ou é inválida.
// =====================================================
function normalizarNota(valor) {
  // Vazio, null ou undefined = ainda não lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for texto, troca vírgula por ponto para poder converter em número
  let numero;
  if (typeof valor === "string") {
    numero = Number(valor.replace(",", "."));
  } else {
    numero = Number(valor);
  }

  // Se não for um número válido, retorna null
  if (isNaN(numero)) {
    return null;
  }

  // Regras de conversão para a escala 0–10
  if (numero >= 0 && numero <= 10) {
    return numero;                 // já está na escala
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;            // 82 -> 8,2 | 100 -> 10,0
  }

  // Fora das regras = inválida
  return null;
}

// =====================================================
// 3) FUNÇÃO: formatarNota(nota)
// Mostra a nota com 1 casa decimal usando vírgula (ex.: 8,2)
// =====================================================
function formatarNota(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace(".", ",");
}

// =====================================================
// 4) FUNÇÃO: calcularMedia(notas)
// Calcula a média apenas com as notas disponíveis (ignora null)
// =====================================================
function calcularMedia(notas) {
  const validas = notas.filter(function (n) { return n !== null; });
  if (validas.length === 0) return null;

  const soma = validas.reduce(function (acc, n) { return acc + n; }, 0);
  return soma / validas.length;
}

// =====================================================
// 5) FUNÇÃO: definirSituacao(media)
// Retorna o texto da situação conforme a média
// =====================================================
function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  if (media >= MEDIA_MINIMA) return "Bom desempenho";
  return "Atenção";
}

// =====================================================
// 6) FUNÇÃO: classeSituacao(situacao)
// Retorna a classe CSS que colore a situação na tabela
// =====================================================
function classeSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-sem-nota";
}

// =====================================================
// 7) PROCESSAR DADOS
// Para cada disciplina: normaliza notas, calcula média e soma faltas
// =====================================================
const disciplinasProcessadas = dadosBrutos.map(function (item) {
  // Normaliza cada trimestre
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  // Média usando apenas as notas disponíveis
  const media = calcularMedia([n1, n2, n3]);

  // Soma das faltas dos 3 trimestres
  const totalFaltas = item.faltas.reduce(function (acc, f) { return acc + f; }, 0);

  // Situação
  const situacao = definirSituacao(media);

  return {
    disciplina: item.disciplina,
    tri1: n1,
    tri2: n2,
    tri3: n3,
    media: media,
    faltas: totalFaltas,
    situacao: situacao
  };
});

// =====================================================
// 8) PREENCHER A TABELA (DOM)
// =====================================================
const corpoTabela = document.getElementById("corpo-tabela");

disciplinasProcessadas.forEach(function (d) {
  // Cria uma linha <tr>
  const linha = document.createElement("tr");

  // Monta o HTML da linha com as notas formatadas
  linha.innerHTML =
    "<td>" + d.disciplina + "</td>" +
    "<td>" + (d.tri1 === null ? "Ainda não lançada" : formatarNota(d.tri1)) + "</td>" +
    "<td>" + (d.tri2 === null ? "Ainda não lançada" : formatarNota(d.tri2)) + "</td>" +
    "<td>" + (d.tri3 === null ? "Ainda não lançada" : formatarNota(d.tri3)) + "</td>" +
    "<td>" + (d.media === null ? "—" : formatarNota(d.media)) + "</td>" +
    "<td>" + d.faltas + "</td>" +
    "<td class='" + classeSituacao(d.situacao) + "'>" + d.situacao + "</td>";

  // Adiciona a linha ao corpo da tabela
  corpoTabela.appendChild(linha);
});

// =====================================================
// 9) CARDS DE RESUMO
// =====================================================

// Média geral: média das médias disponíveis (ignora disciplinas sem nota)
const mediasDisponiveis = disciplinasProcessadas
  .map(function (d) { return d.media; })
  .filter(function (m) { return m !== null; });

let mediaGeral = null;
if (mediasDisponiveis.length > 0) {
  const somaMedias = mediasDisponiveis.reduce(function (acc, m) { return acc + m; }, 0);
  mediaGeral = somaMedias / mediasDisponiveis.length;
}

document.getElementById("media-geral").textContent =
  mediaGeral === null ? "—" : formatarNota(mediaGeral);

// Total de faltas (soma de todas as disciplinas)
const totalFaltasGeral = disciplinasProcessadas.reduce(function (acc, d) {
  return acc + d.faltas;
}, 0);
document.getElementById("total-faltas").textContent = totalFaltasGeral;

// Quantidade de disciplinas com bom desempenho
const qtdBom = disciplinasProcessadas.filter(function (d) {
  return d.situacao === "Bom desempenho";
}).length;
document.getElementById("qtd-bom").textContent = qtdBom;

// Quantidade de disciplinas que precisam de atenção
const qtdAtencao = disciplinasProcessadas.filter(function (d) {
  return d.situacao === "Atenção";
}).length;
document.getElementById("qtd-atencao").textContent = qtdAtencao;

// Frequência demonstrativa (APENAS FICTÍCIA nesta versão)
// Este percentual é apenas ilustrativo e será tratado de outra forma no futuro.
const frequenciaDemonstrativa = 92;
document.getElementById("frequencia").textContent = frequenciaDemonstrativa + "%";
document.getElementById("frequencia-status").textContent = "Frequência adequada";