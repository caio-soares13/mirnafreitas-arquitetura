// Para adicionar ou trocar projetos, edite apenas esta lista.
// "categoria" é Residencial, Comercial ou Interiores; aparece como "Categoria - Nome".
// "frase" é a mensagem de destaque exibida junto às imagens do projeto.
const projetos = [
  {
    categoria: 'Residencial',
    nome: 'Caminho das Marinas II',
    frase: 'Soluções projetuais com foco no bem estar dos usuários',
    imagens: ['caminho-das-marinas-imagem1.webp', 'caminho-das-marinas-imagem2.webp', 'caminho-das-marinas-imagem3.webp'],
  },
  {
    categoria: 'Residencial',
    nome: 'Mosaico Ponta Negra',
    frase: 'Respeito e valorização de diferentes formas de viver',
    imagens: ['mosaico-ponta-negra-imagem1.webp', 'mosaico-ponta-negra-imagem2.webp', 'mosaico-ponta-negra-imagem3.webp'],
  },
  {
    categoria: 'Residencial',
    nome: 'Quinta das Marinas',
    frase: 'Integração entre o ambiente construído e o natural',
    imagens: ['quinta-das-marinas-imagem1.webp', 'quinta-das-marinas-imagem2.webp', 'quinta-das-marinas-imagem3.webp'],
  },
  {
    categoria: 'Residencial',
    nome: 'Chácaras Rio Negro',
    frase: 'Funcionalidade, conforto e custo acessível',
    imagens: ['chacaras-rio-negro-imagem1.webp', 'chacaras-rio-negro-imagem2.webp'],
  },
  {
    categoria: 'Residencial',
    nome: 'Reserva do Parque',
    frase: 'Eficiência e bom desempenho do ambiente construído',
    imagens: ['reserva-do-parque-imagem1.webp'],
  },
  {
    categoria: 'Residencial',
    nome: 'Chácaras Rio Negro II',
    frase: 'Eficiência e bom desempenho do ambiente construído',
    imagens: ['chacaras-rio-negro2-imagem1.webp'],
  },
  {
    categoria: 'Interiores',
    nome: 'Apartamento Marcia Lira',
    frase: 'Soluções personalizadas para diferentes necessidades e espaços',
    imagens: ['apartamento-marcia-lira-imagem1.webp', 'apartamento-marcia-lira-imagem2.webp'],
  },
  {
    categoria: 'Comercial',
    nome: 'Revistaria Página 7',
    frase: 'Foco na experiência dos usuários',
    imagens: ['revistaria-pagina-7-imagem1.webp', 'revistaria-pagina-7-imagem2.webp', 'revistaria-pagina-7-imagem3.webp'],
  },
];

const INTERVALO = 5000; // tempo de cada imagem (ms)
const TRANSICAO = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--duracao')) || 0;

const slides = projetos.flatMap(p =>
  p.imagens.map(img => ({ src: `img/${img}`, nome: `${p.categoria} - ${p.nome}`, frase: p.frase }))
);

const faixa = document.querySelector('.faixa');
const caixa = document.querySelector('.faixa-imagem');
const fotos = document.querySelectorAll('.foto');
const projeto = document.getElementById('projeto');
const frase = document.getElementById('frase');
const tira = document.getElementById('miniaturas');

// Pré-carrega as imagens para a troca não "piscar"
slides.forEach(s => { new Image().src = s.src; });

// O zoom dura a exibição inteira, incluindo a troca seguinte
caixa.style.setProperty('--tempo-zoom', `${INTERVALO + TRANSICAO * 2}ms`);

// Miniaturas: um respiro maior separa um projeto do outro
const minis = slides.map((s, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'mini' + (i === 0 || slides[i - 1].nome !== s.nome ? ' inicio-projeto' : '');
  b.title = s.nome;
  b.setAttribute('aria-label', `${s.nome} — imagem ${i + 1}`);
  b.innerHTML = `<img src="${s.src}" alt="" loading="lazy">`;
  b.addEventListener('click', () => { ir(i); reiniciar(); });
  tira.appendChild(b);
  return b;
});

function marcarMiniatura() {
  minis.forEach((b, i) => b.setAttribute('aria-current', String(i === atual)));
  // mantém a miniatura ativa visível sem rolar a página
  const b = minis[atual];
  tira.scrollTo({ left: b.offsetLeft - tira.clientWidth / 2 + b.offsetWidth / 2 });
}

let atual = 0;
let visivel = 0; // qual das duas <img> está na frente
let timer = null;
let trocando = false;

function ajustarProporcao(img) {
  if (img.naturalWidth) caixa.style.setProperty('--proporcao', img.naturalWidth / img.naturalHeight);
}

function trocarTexto(el, texto) {
  if (el.textContent === texto) return;
  el.classList.add('saindo');
  setTimeout(() => { el.textContent = texto; el.classList.remove('saindo'); }, TRANSICAO / 2);
}

function ir(i) {
  const novo = (i + slides.length) % slides.length;
  if (novo === atual || trocando) return;
  trocando = true;

  const s = slides[novo];
  const entra = fotos[1 - visivel];
  const sai = fotos[visivel];
  entra.src = s.src;
  entra.alt = s.nome;
  sai.alt = '';

  const mostrar = () => {
    atual = novo;
    visivel = 1 - visivel;
    ajustarProporcao(entra);
    // reinicia o zoom da foto que entra; a que sai continua até sumir
    entra.classList.remove('zoom');
    void entra.offsetWidth;
    entra.classList.add('zoom', 'ativa');
    sai.classList.remove('ativa');

    trocarTexto(projeto, s.nome);
    trocarTexto(frase, s.frase);
    marcarMiniatura();
    setTimeout(() => { trocando = false; }, TRANSICAO);
  };
  entra.decode ? entra.decode().then(mostrar, mostrar) : mostrar();
}

function iniciar() {
  parar();
  faixa.classList.remove('pausado');
  timer = setInterval(() => ir(atual + 1), INTERVALO);
}
function parar() { clearInterval(timer); timer = null; faixa.classList.add('pausado'); }
function reiniciar() { if (timer) iniciar(); }

document.querySelector('.anterior').addEventListener('click', () => { ir(atual - 1); reiniciar(); });
document.querySelector('.proxima').addEventListener('click', () => { ir(atual + 1); reiniciar(); });

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { ir(atual + 1); reiniciar(); }
  if (e.key === 'ArrowLeft') { ir(atual - 1); reiniciar(); }
});

// Deslizar no celular
let toqueX = null;
faixa.addEventListener('touchstart', e => { toqueX = e.touches[0].clientX; }, { passive: true });
faixa.addEventListener('touchend', e => {
  if (toqueX === null) return;
  const dx = e.changedTouches[0].clientX - toqueX;
  if (Math.abs(dx) > 40) { ir(atual + (dx < 0 ? 1 : -1)); reiniciar(); }
  toqueX = null;
});

// Pausa quando o mouse está sobre a faixa ou a aba está oculta
faixa.addEventListener('mouseenter', parar);
faixa.addEventListener('mouseleave', iniciar);
document.addEventListener('visibilitychange', () => (document.hidden ? parar() : iniciar()));

fotos[0].decode?.().then(() => ajustarProporcao(fotos[0]), () => {});
marcarMiniatura();
iniciar();
