// =====================================================
// BOLETIM DIGITAL — 8º ANO — TURMA 8A — Nº 13
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
// 0) CONFIGURAÇÃO FIXA DO ALUNO
// Turma e número de chamada ficam fixos neste projeto.
// Não podem ser alterados pela página.
// =====================================================
const CONFIG_ALUNO = {
  turma: "8A",
  numeroChamada: 13,
  apiUrl: "https://boletim-api.profbt.com.br"
};

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
// 7) ESTADO DA APLICAÇÃO
// =====================================================
// Sessão: guarda o PIN apenas em memória (nunca em localStorage/sessionStorage)
let pinSessao = null;

// Lista atual de disciplinas exibidas (pode vir dos dados locais ou da API)
let disciplinasAtuais = [];

// Modo de edição ativo ou não
let modoEdicao = false;

// =====================================================
// 8) PROCESSAR UMA LISTA BRUTA DE DISCIPLINAS
// Normaliza notas, calcula média e soma faltas.
// Aceita o formato local (faltas: [a,b,c]) e o formato da API
// (faltas1, faltas2, faltas3), quando existir.
// =====================================================
function processarDisciplinas(listaBruta) {
  return listaBruta.map(function (item) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia([n1, n2, n3]);

    // Faltas: aceita array [a,b,c] ou campos separados faltas1/faltas2/faltas3
    let f1 = 0, f2 = 0, f3 = 0;
    if (Array.isArray(item.faltas)) {
      f1 = Number(item.faltas[0]) || 0;
      f2 = Number(item.faltas[1]) || 0;
      f3 = Number(item.faltas[2]) || 0;
    } else {
      f1 = Number(item.faltas1) || 0;
      f2 = Number(item.faltas2) || 0;
      f3 = Number(item.faltas3) || 0;
    }

    const totalFaltas = f1 + f2 + f3;
    const situacao = definirSituacao(media);

    return {
      disciplina: item.disciplina,
      tri1: n1,
      tri2: n2,
      tri3: n3,
      media: media,
      faltas1: f1,
      faltas2: f2,
      faltas3: f3,
      faltas: totalFaltas,
      situacao: situacao
    };
  });
}

// =====================================================
// 9) RENDERIZAR A TABELA (limpa antes de reconstruir)
// =====================================================
const corpoTabela = document.getElementById("corpo-tabela");

function renderizarTabela() {
  // Limpa a tabela para não duplicar linhas
  corpoTabela.textContent = "";

  disciplinasAtuais.forEach(function (d) {
    const linha = document.createElement("tr");

    // Coluna disciplina (textContent por segurança)
    const tdDisciplina = document.createElement("td");
    tdDisciplina.textContent = d.disciplina;
    linha.appendChild(tdDisciplina);

    // Colunas de notas (1º, 2º, 3º tri)
    const chavesNotas = ["tri1", "tri2", "tri3"];
    chavesNotas.forEach(function (chave) {
      const td = document.createElement("td");
      if (modoEdicao) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "campo-edicao";
        input.dataset.disciplina = d.disciplina;
        input.dataset.campo = chave;
        input.value = d[chave] === null ? "" : formatarNota(d[chave]);
        td.appendChild(input);
      } else {
        td.textContent = d[chave] === null ? "Ainda não lançada" : formatarNota(d[chave]);
      }
      linha.appendChild(td);
    });

    // Coluna média
    const tdMedia = document.createElement("td");
    tdMedia.textContent = d.media === null ? "—" : formatarNota(d.media);
    linha.appendChild(tdMedia);

    // Coluna faltas
    const tdFaltas = document.createElement("td");
    if (modoEdicao) {
      const inputFaltas = document.createElement("input");
      inputFaltas.type = "text";
      inputFaltas.className = "campo-edicao";
      inputFaltas.dataset.disciplina = d.disciplina;
      inputFaltas.dataset.campo = "faltas";
      inputFaltas.value = String(d.faltas1) + "," + String(d.faltas2) + "," + String(d.faltas3);
      tdFaltas.appendChild(inputFaltas);
    } else {
      tdFaltas.textContent = d.faltas;
    }
    linha.appendChild(tdFaltas);

    // Coluna situação
    const tdSituacao = document.createElement("td");
    tdSituacao.className = classeSituacao(d.situacao);
    tdSituacao.textContent = d.situacao;
    linha.appendChild(tdSituacao);

    corpoTabela.appendChild(linha);
  });
}

// =====================================================
// 10) RENDERIZAR OS CARDS DE RESUMO
// =====================================================

// Média geral: média das médias disponíveis (ignora disciplinas sem nota)
function renderizarCards() {
  const mediasDisponiveis = disciplinasAtuais
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
  const totalFaltasGeral = disciplinasAtuais.reduce(function (acc, d) {
    return acc + d.faltas;
  }, 0);
  document.getElementById("total-faltas").textContent = totalFaltasGeral;

  // Quantidade de disciplinas com bom desempenho
  const qtdBom = disciplinasAtuais.filter(function (d) {
    return d.situacao === "Bom desempenho";
  }).length;
  document.getElementById("qtd-bom").textContent = qtdBom;

  // Quantidade de disciplinas que precisam de atenção
  const qtdAtencao = disciplinasAtuais.filter(function (d) {
    return d.situacao === "Atenção";
  }).length;
  document.getElementById("qtd-atencao").textContent = qtdAtencao;

  // Frequência demonstrativa (APENAS FICTÍCIA nesta versão)
  // Este percentual é apenas ilustrativo e será tratado de outra forma no futuro.
  const frequenciaDemonstrativa = 92;
  document.getElementById("frequencia").textContent = frequenciaDemonstrativa + "%";
  document.getElementById("frequencia-status").textContent = "Frequência adequada";
}

// =====================================================
// 11) RENDERIZAÇÃO COMPLETA
// =====================================================
function renderizarTudo() {
  renderizarTabela();
  renderizarCards();
}

// =====================================================
// 12) TELA DE ACESSO (PIN)
// =====================================================
const campoPin = document.getElementById("campo-pin");
const btnEntrar = document.getElementById("btn-entrar");
const acessoMensagem = document.getElementById("acesso-mensagem");
const acessoSection = document.getElementById("acesso");
const conteudoBoletim = document.getElementById("conteudo-boletim");

function definirMensagemAcesso(texto, tipo) {
  acessoMensagem.textContent = texto || "";
  acessoMensagem.className = "acesso-mensagem" + (tipo ? " " + tipo : "");
}

// Abre o boletim na API
async function abrirBoletim() {
  const pinDigitado = campoPin.value.trim();

  if (pinDigitado === "") {
    definirMensagemAcesso("Digite o PIN.", "erro");
    return;
  }

  definirMensagemAcesso("Conectando...", "");
  btnEntrar.disabled = true;

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/abrir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      definirMensagemAcesso("Turma, chamada ou PIN inválidos.", "erro");
      btnEntrar.disabled = false;
      return;
    }

    if (resposta.status === 429) {
      definirMensagemAcesso("Muitas tentativas. Aguarde um minuto e tente novamente.", "erro");
      btnEntrar.disabled = false;
      return;
    }

    if (!resposta.ok) {
      definirMensagemAcesso("Não foi possível conectar ao servidor. Tente novamente.", "erro");
      btnEntrar.disabled = false;
      return;
    }

    const dados = await resposta.json();

    // Guarda o PIN apenas em memória durante a sessão
    pinSessao = pinDigitado;

    // Limpa o campo do PIN
    campoPin.value = "";

    // Decide os dados iniciais:
    // - Se a API retornar "dados" não nulo, usamos exatamente esses dados.
    // - Se "dados" for null (novo ou não), usamos os dados fictícios locais.
    if (dados && dados.dados && Array.isArray(dados.dados.disciplinas)) {
      disciplinasAtuais = processarDisciplinas(dados.dados.disciplinas);
    } else {
      disciplinasAtuais = processarDisciplinas(dadosBrutos);
    }

    // Mostra o boletim e esconde a tela de acesso
    acessoSection.classList.add("oculto");
    conteudoBoletim.classList.remove("oculto");

    // Renderiza
    modoEdicao = false;
    atualizarBotoes();
    renderizarTudo();
    atualizarGraficos();

  } catch (erro) {
    definirMensagemAcesso("Não foi possível conectar ao servidor. Tente novamente.", "erro");
    btnEntrar.disabled = false;
  }
}

btnEntrar.addEventListener("click", abrirBoletim);

// Permite Enter no campo do PIN
campoPin.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    abrirBoletim();
  }
});

// =====================================================
// 13) EDIÇÃO E SALVAMENTO
// =====================================================
const btnAlterar = document.getElementById("btn-alterar");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");
const edicaoMensagem = document.getElementById("edicao-mensagem");

function definirMensagemEdicao(texto, tipo) {
  edicaoMensagem.textContent = texto || "";
  edicaoMensagem.className = "edicao-mensagem" + (tipo ? " " + tipo : "");
}

function atualizarBotoes() {
  if (modoEdicao) {
    btnAlterar.classList.add("oculto");
    btnSalvar.classList.remove("oculto");
    btnCancelar.classList.remove("oculto");
  } else {
    btnAlterar.classList.remove("oculto");
    btnSalvar.classList.add("oculto");
    btnCancelar.classList.add("oculto");
  }
}

// Entra no modo de edição
btnAlterar.addEventListener("click", function () {
  modoEdicao = true;
  definirMensagemEdicao("", "");
  atualizarBotoes();
  renderizarTabela();
});

// Cancela a edição
btnCancelar.addEventListener("click", function () {
  modoEdicao = false;
  definirMensagemEdicao("", "");
  atualizarBotoes();
  renderizarTabela();
});

// =====================================================
// 14) VALIDAÇÃO DE NOTAS E FALTAS NO EDITOR
// Notas: número entre 0 e 10, ponto ou vírgula, ou vazio (= null).
// Faltas: inteiro >= 0. Faltas vazias são inválidas.
// =====================================================
function validarNotaEditor(texto) {
  const t = texto.trim();
  if (t === "") return { ok: true, valor: null };

  // Aceita apenas número com ponto ou vírgula decimal
  if (!/^[0-9]+([.,][0-9]+)?$/.test(t)) {
    return { ok: false };
  }

  const numero = Number(t.replace(",", "."));
  if (isNaN(numero) || numero < 0 || numero > 10) {
    return { ok: false };
  }
  return { ok: true, valor: numero };
}

function validarFaltasEditor(texto) {
  const t = texto.trim();
  if (t === "") return { ok: false };
  if (!/^[0-9]+$/.test(t)) return { ok: false };
  const numero = Number(t);
  if (!Number.isInteger(numero) || numero < 0) return { ok: false };
  return { ok: true, valor: numero };
}

// Coleta os valores dos campos de edição e valida
function coletarEdicoes() {
  const inputs = corpoTabela.querySelectorAll("input.campo-edicao");
  const porDisciplina = {};

  let invalido = false;

  inputs.forEach(function (input) {
    const disc = input.dataset.disciplina;
    const campo = input.dataset.campo;

    if (!porDisciplina[disc]) {
      porDisciplina[disc] = { tri1: null, tri2: null, tri3: null, faltas1: 0, faltas2: 0, faltas3: 0 };
    }

    if (campo === "faltas") {
      // Esperado: "f1,f2,f3"
      const partes = input.value.split(",");
      if (partes.length !== 3) {
        input.classList.add("invalido");
        invalido = true;
        return;
      }
      const v1 = validarFaltasEditor(partes[0]);
      const v2 = validarFaltasEditor(partes[1]);
      const v3 = validarFaltasEditor(partes[2]);
      if (!v1.ok || !v2.ok || !v3.ok) {
        input.classList.add("invalido");
        invalido = true;
        return;
      }
      input.classList.remove("invalido");
      porDisciplina[disc].faltas1 = v1.valor;
      porDisciplina[disc].faltas2 = v2.valor;
      porDisciplina[disc].faltas3 = v3.valor;
    } else {
      const resultado = validarNotaEditor(input.value);
      if (!resultado.ok) {
        input.classList.add("invalido");
        invalido = true;
        return;
      }
      input.classList.remove("invalido");
      porDisciplina[disc][campo] = resultado.valor;
    }
  });

  return { invalido: invalido, porDisciplina: porDisciplina };
}

// Salva os dados na API
async function salvarDados() {
  if (!pinSessao) return;

  const coleta = coletarEdicoes();
  if (coleta.invalido) {
    definirMensagemEdicao("Há campos inválidos. Corrija os valores destacados.", "erro");
    return;
  }

  // Monta a nova lista de disciplinas com os valores editados
  const novasDisciplinas = disciplinasAtuais.map(function (d) {
    const ed = coleta.porDisciplina[d.disciplina] || {};
    const tri1 = ed.tri1 !== undefined ? ed.tri1 : d.tri1;
    const tri2 = ed.tri2 !== undefined ? ed.tri2 : d.tri2;
    const tri3 = ed.tri3 !== undefined ? ed.tri3 : d.tri3;
    const f1 = ed.faltas1 !== undefined ? ed.faltas1 : d.faltas1;
    const f2 = ed.faltas2 !== undefined ? ed.faltas2 : d.faltas2;
    const f3 = ed.faltas3 !== undefined ? ed.faltas3 : d.faltas3;

    const media = calcularMedia([tri1, tri2, tri3]);
    const situacao = definirSituacao(media);

    return {
      disciplina: d.disciplina,
      tri1: tri1,
      tri2: tri2,
      tri3: tri3,
      faltas1: f1,
      faltas2: f2,
      faltas3: f3,
      faltas: f1 + f2 + f3,
      media: media,
      situacao: situacao
    };
  });

  definirMensagemEdicao("Salvando...", "");
  btnSalvar.disabled = true;

  // Envia os dados no formato esperado pela API
  const dadosParaEnviar = {
    disciplinas: novasDisciplinas.map(function (d) {
      return {
        disciplina: d.disciplina,
        tri1: d.tri1,
        tri2: d.tri2,
        tri3: d.tri3,
        faltas: [d.faltas1, d.faltas2, d.faltas3]
      };
    })
  };

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/salvar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: dadosParaEnviar
      })
    });

    if (resposta.status === 401) {
      definirMensagemEdicao("Sessão inválida. Entre novamente.", "erro");
      btnSalvar.disabled = false;
      return;
    }

    if (resposta.status === 429) {
      definirMensagemEdicao("Muitas tentativas. Aguarde um minuto e tente novamente.", "erro");
      btnSalvar.disabled = false;
      return;
    }

    if (!resposta.ok) {
      definirMensagemEdicao("Não foi possível salvar. Tente novamente.", "erro");
      btnSalvar.disabled = false;
      return;
    }

    // Sucesso: atualiza os dados em memória e sai do modo de edição
    disciplinasAtuais = novasDisciplinas;
    modoEdicao = false;
    atualizarBotoes();
    renderizarTudo();
    definirMensagemEdicao("Dados salvos com sucesso.", "sucesso");
    atualizarGraficos();

  } catch (erro) {
    definirMensagemEdicao("Não foi possível salvar. Tente novamente.", "erro");
    btnSalvar.disabled = false;
  }
}

btnSalvar.addEventListener("click", salvarDados);

// =====================================================
// 15) GRÁFICOS — camada SOMENTE LEITURA
// Utiliza exclusivamente `disciplinasAtuais` já carregado.
// Nunca escreve em notas, faltas, disciplinas ou no estado.
// Nunca faz requisição à API.
// =====================================================

// Instâncias dos gráficos (recriadas a cada atualização)
let graficoMedias = null;
let graficoEvolucao = null;
let graficoFaltas = null;

// Referência interna de risco (NÃO é exibida na interface)
const REFERENCIA_INTERNA_FALTAS = 350;

// Paleta derivada do CSS existente (dark mode)
const COR_VERMELHO = "#EF4444";
const COR_VERDE = "#22C55E";
const COR_LARANJA = "#F59E0B";
const COR_CINZA = "#9CA3AF";
const COR_GRADE = "#1F2937";
const COR_TEXTO = "#E5E7EB";

// Configurações globais do Chart.js (legibilidade no dark mode)
function configurarChartDefaults() {
  if (typeof Chart === "undefined") return;
  Chart.defaults.color = COR_TEXTO;
  Chart.defaults.borderColor = COR_GRADE;
  Chart.defaults.font.family = "Arial, Helvetica, sans-serif";
}

// ---------- Gráfico 1: Média por disciplina ----------
function atualizarGraficoMedias() {
  const canvas = document.getElementById("graficoMediasDisciplinas");
  if (!canvas || typeof Chart === "undefined") return;

  // Cópia defensiva — não mutamos o estado original
  const copia = disciplinasAtuais.map(function (d) {
    return { disciplina: d.disciplina, media: d.media };
  });

  const labels = copia.map(function (d) { return d.disciplina; });
  const valores = copia.map(function (d) {
    return d.media === null ? null : d.media;
  });

  // Cor por barra: verde se média >= MEDIA_MINIMA, laranja caso contrário
  const cores = copia.map(function (d) {
    if (d.media === null) return COR_CINZA;
    if (d.media >= MEDIA_MINIMA) return COR_VERDE;
    return COR_LARANJA;
  });

  if (graficoMedias) {
    graficoMedias.destroy();
    graficoMedias = null;
  }

  graficoMedias = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Média",
        data: valores,
        backgroundColor: cores,
        borderColor: cores,
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              if (ctx.raw === null) return ctx.label + ": —";
              return ctx.label + ": " + Number(ctx.raw).toFixed(1).replace(".", ",");
            }
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 10,
          ticks: { color: COR_TEXTO, stepSize: 1 },
          grid: { color: COR_GRADE }
        },
        y: {
          ticks: { color: COR_TEXTO, autoSkip: false },
          grid: { color: COR_GRADE }
        }
      }
    }
  });
}

// ---------- Gráfico 2: Evolução da média geral ----------
function atualizarGraficoEvolucao() {
  const canvas = document.getElementById("graficoEvolucaoTrimestres");
  if (!canvas || typeof Chart === "undefined") return;

  // Para cada trimestre, reúne as notas válidas e calcula a média
  const notasTri1 = [];
  const notasTri2 = [];
  const notasTri3 = [];

  disciplinasAtuais.forEach(function (d) {
    if (d.tri1 !== null) notasTri1.push(d.tri1);
    if (d.tri2 !== null) notasTri2.push(d.tri2);
    if (d.tri3 !== null) notasTri3.push(d.tri3);
  });

  const mediaTri1 = calcularMedia(notasTri1);
  const mediaTri2 = calcularMedia(notasTri2);
  const mediaTri3 = calcularMedia(notasTri3);

  if (graficoEvolucao) {
    graficoEvolucao.destroy();
    graficoEvolucao = null;
  }

  graficoEvolucao = new Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Média geral",
        data: [mediaTri1, mediaTri2, mediaTri3],
        borderColor: COR_VERMELHO,
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        pointBackgroundColor: COR_VERMELHO,
        pointBorderColor: "#FFFFFF",
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.25,
        spanGaps: false,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              if (ctx.raw === null) return ctx.label + ": —";
              return ctx.label + ": " + Number(ctx.raw).toFixed(1).replace(".", ",");
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: { color: COR_TEXTO, stepSize: 1 },
          grid: { color: COR_GRADE }
        },
        x: {
          ticks: { color: COR_TEXTO },
          grid: { color: COR_GRADE }
        }
      }
    }
  });
}

// ---------- Gráfico 3: Faltas por trimestre ----------
function atualizarGraficoFaltas() {
  const canvas = document.getElementById("graficoFaltasTrimestres");
  const cardFaltas = document.getElementById("grafico-card-faltas");
  const estadoFaltas = document.getElementById("estadoFaltas");
  if (!canvas || typeof Chart === "undefined") return;

  // Soma faltas de cada trimestre (somente leitura)
  let faltasTri1 = 0;
  let faltasTri2 = 0;
  let faltasTri3 = 0;

  disciplinasAtuais.forEach(function (d) {
    faltasTri1 += d.faltas1;
    faltasTri2 += d.faltas2;
    faltasTri3 += d.faltas3;
  });

  const totalInterno = faltasTri1 + faltasTri2 + faltasTri3;

  // Situação de perigo (referência interna, NUNCA exibida)
  const emPerigo = totalInterno >= REFERENCIA_INTERNA_FALTAS;

  // Atualiza card (badge e classe)
  if (cardFaltas) {
    cardFaltas.classList.toggle("perigo", emPerigo);
  }
  if (estadoFaltas) {
    if (emPerigo) {
      estadoFaltas.innerHTML = '<span class="badge-perigo">Perigo</span>';
    } else {
      estadoFaltas.innerHTML = "";
    }
  }

  if (graficoFaltas) {
    graficoFaltas.destroy();
    graficoFaltas = null;
  }

  graficoFaltas = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Faltas",
        data: [faltasTri1, faltasTri2, faltasTri3],
        backgroundColor: emPerigo ? COR_VERMELHO : COR_LARANJA,
        borderColor: emPerigo ? COR_VERMELHO : COR_LARANJA,
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,