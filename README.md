# Site Curi Agroecologia

Site institucional + vitrine de produtos da Curi Agroecologia (Mata Atlântica, Joinville/SC).
Estático, sem backend: o carrinho organiza o pedido e envia tudo pronto para o WhatsApp da Curi.

## Como editar

- **Preços, produtos, frete e WhatsApp**: tudo em [`js/store.js`](js/store.js) — é o único arquivo do dia a dia.
- **Fotos**: em `assets/img/` (JPEG ~1600px). Os nomes seguem o padrão `produto-*`, `home-*`, `hospedagem-*`.
- **Textos**: direto nos arquivos `.html` de cada página.

## Publicação

Hospedado no GitHub Pages. Qualquer push na branch `main` publica automaticamente.

Feito com base no design aprovado no Claude Design (projeto "Curi", arquivo Nosso Mel)
e no brand kit do manual da marca (Umbu Estúdio).
