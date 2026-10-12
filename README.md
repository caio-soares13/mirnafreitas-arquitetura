# Mirna Freitas Arquitetura — site

Site estático (HTML, CSS e JavaScript puro, sem build).

```
index.html     estrutura da página
css/style.css  visual (cores, tamanhos, versão celular)
js/main.js     lista de projetos e funcionamento da faixa
img/           imagens dos projetos
```

## Rodar localmente

```bash
python -m http.server 8080
```

Depois abra http://localhost:8080. (Abrir o `index.html` direto no navegador também funciona.)

## Editar projetos

Tudo fica na lista `projetos` no início de `js/main.js`: nome, frase e imagens.
Para adicionar um projeto, coloque as imagens em `img/` e acrescente um bloco na lista.
O tempo de cada imagem é `INTERVALO` (em milissegundos).

## Publicar

Basta enviar `index.html`, `css/`, `js/` e `img/` para qualquer hospedagem estática
(GitHub Pages, Netlify, Vercel, Cloudflare Pages). O arquivo `.pptx` não precisa ir junto.
