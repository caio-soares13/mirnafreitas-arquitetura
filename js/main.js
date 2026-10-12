// Para adicionar ou trocar projetos, edite apenas esta lista.
// "frase" é a mensagem de destaque exibida junto às imagens do projeto.
const projetos = [
  {
    nome: 'Residência Caminho das Marinas II',
    frase: 'Soluções projetuais com foco no bem estar dos usuários',
    imagens: ['caminho-das-marinas-imagem1.png', 'caminho-das-marinas-imagem2.png', 'caminho-das-marinas-imagem3.png'],
  },
  {
    nome: 'Residência Mosaico Ponta Negra',
    frase: 'Respeito e valorização de diferentes formas de viver',
    imagens: ['mosaico-ponta-negra-imagem1.png', 'mosaico-ponta-negra-imagem2.png', 'mosaico-ponta-negra-imagem3.png'],
  },
  {
    nome: 'Residência Quinta das Marinas',
    frase: 'Integração entre o ambiente construído e o natural',
    imagens: ['quinta-das-marinas-imagem1.png', 'quinta-das-marinas-imagem2.png', 'quinta-das-marinas-imagem3.png'],
  },
  {
    nome: 'Residência Chácaras Rio Negro',
    frase: 'Funcionalidade, conforto e custo acessível',
    imagens: ['chacaras-rio-negro-imagem1.png', 'chacaras-rio-negro-imagem2.png'],
  },
  {
    nome: 'Residência Reserva do Parque',
    frase: 'Eficiência e bom desempenho do ambiente construído',
    imagens: ['reserva-do-parque-imagem1.png'],
  },
  {
    nome: 'Residência Chácaras Rio Negro II',
    frase: 'Eficiência e bom desempenho do ambiente construído',
    imagens: ['chacaras-rio-negro2-imagem1.png'],
  },
  {
    nome: 'Interiores - Apartamento Marcia Lira',
    frase: 'Soluções personalizadas para diferentes necessidades e espaços',
    imagens: ['apartamento-marcia-lira-imagem1.png', 'apartamento-marcia-lira-imagem2.png'],
  },
  {
    nome: 'Revistaria Página 7',
    frase: 'Foco na experiência dos usuários',
    imagens: ['revistaria-pagina-7-imagem1.png', 'revistaria-pagina-7-imagem2.png', 'revistaria-pagina-7-imagem3.png'],
  },
];

const INTERVALO = 5000; // tempo de cada imagem (ms)
const TRANSICAO = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--duracao')) || 0;

const slides = projetos.flatMap(p =>
  p.imagens.map(img => ({ src: `img/${img}`, nome: p.nome, frase: p.frase }))
);

const faixa = document.querySelector('.faixa');
const foto = document.getElementById('foto');
const projeto = document.getElementById('projeto');
const frase = document.getElementById('frase');
const pontos = document.getElementById('pontos');

// Pré-carrega as imagens para a troca não "piscar"
slides.forEach(s => { new Image().src = s.src; });

const botoes = slides.map((s, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('role', 'tab');
  b.setAttribute('aria-label', `${s.nome} — imagem ${i + 1}`);
  b.addEventListener('click', () => { ir(i); reiniciar(); });
  pontos.appendChild(b);
  return b;
});

let atual = 0;
let timer = null;
let trocando = false;

function marcarPonto() {
  botoes.forEach((b, i) => b.setAttribute('aria-selected', String(i === atual)));
}

function ir(i) {
  const novo = (i + slides.length) % slides.length;
  if (novo === atual || trocando) return;
  const s = slides[novo];
  const mudaTexto = s.frase !== slides[atual].frase;
  const mudaNome = s.nome !== slides[atual].nome;

  trocando = true;
  frase.classList.toggle('muda', mudaTexto);
  projeto.classList.toggle('muda', mudaNome);
  faixa.classList.add('trocando');

  setTimeout(() => {
    atual = novo;
    foto.src = s.src;
    foto.alt = s.nome;
    projeto.textContent = s.nome;
    frase.textContent = s.frase;
    marcarPonto();
    const mostrar = () => { faixa.classList.remove('trocando'); trocando = false; };
    foto.decode ? foto.decode().then(mostrar, mostrar) : mostrar();
  }, TRANSICAO);
}

function iniciar() { parar(); timer = setInterval(() => ir(atual + 1), INTERVALO); }
function parar() { clearInterval(timer); timer = null; }
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

marcarPonto();
iniciar();
