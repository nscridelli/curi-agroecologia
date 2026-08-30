/* Curi Biodiversidade — infraestrutura das páginas
   Header, menu, rodapé, botão de WhatsApp e utilidades compartilhadas. */

const ICONS = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h2.5l2.2 12.2a1.5 1.5 0 0 0 1.5 1.3h9.4a1.5 1.5 0 0 0 1.5-1.2L21 7H5.3"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.2-.3.3-.5v-.5c0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.5 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/></svg>',
  bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 7v11M3 14h18v4M3 11h8v3M21 14v-3a3 3 0 0 0-3-3h-7"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21c.5-4.5 2.5-8 7-10"/><path d="M20 4c-1 8-4 13.5-11 13.5-2.5 0-4-1.5-4-4C5 8 10 4.5 20 4z"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3zM12 12l9-4.5M12 12v9M12 12L3 7.5"/></svg>',
  pix: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 2.5l4.2 4.2h2.1l3.2 3.2a3 3 0 0 1 0 4.2l-3.2 3.2h-2.1L12 21.5l-4.2-4.2H5.7l-3.2-3.2a3 3 0 0 1 0-4.2l3.2-3.2h2.1L12 2.5z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>',
  feather: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 4.8a6 6 0 0 0-8.5 0L5 11.5V19h7.5l6.7-6.7a6 6 0 0 0 0-8.5z"/><path d="M16 8L4 20M17.5 13H12"/></svg>',
  photo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M6 19l5-5 3 3 3-3 3 3"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>',
};

const NAV_LINKS = [
  ["loja.html", "Loja"],
  ["nosso-mel.html", "Nosso mel"],
  ["experiencias.html", "Experiências"],
  ["observacao-de-aves.html", "Aves"],
  ["sobre.html", "Sobre"],
  ["consultoria.html", "Consultoria"],
  ["diario.html", "Diário"],
  ["contato.html", "Contato"],
];

function waLink(text) {
  return "https://wa.me/" + CURI.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");
}

function brl(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderHeader() {
  const here = location.pathname.split("/").pop() || "index.html";
  const nav = NAV_LINKS.map(([href, label]) =>
    `<a href="${href}" ${here === href ? 'aria-current="page"' : ""}>${label}</a>`).join("");
  const el = document.createElement("header");
  el.className = "site-header";
  el.innerHTML = `
    <div class="bar">
      <a class="logo" href="index.html">Curi <small>biodiversidade</small></a>
      <nav class="main-nav" aria-label="principal">${nav}</nav>
      <div class="header-actions">
        <a class="icon-btn" href="carrinho.html" aria-label="Carrinho">
          ${ICONS.cart}<span class="cart-count" id="cart-count"></span>
        </a>
        <button class="icon-btn" id="menu-toggle" aria-label="Abrir menu">${ICONS.menu}</button>
      </div>
    </div>
    <div class="mobile-menu" id="mobile-menu">
      <div class="panel">
        <button class="close" aria-label="Fechar menu">${ICONS.close}</button>
        <a href="index.html">Início</a>${nav}
      </div>
    </div>`;
  document.body.prepend(el);

  const menu = el.querySelector("#mobile-menu");
  el.querySelector("#menu-toggle").addEventListener("click", () => menu.classList.add("open"));
  menu.querySelector(".close").addEventListener("click", () => menu.classList.remove("open"));
  menu.addEventListener("click", (e) => { if (e.target === menu) menu.classList.remove("open"); });
}

function renderFooter() {
  const el = document.createElement("footer");
  el.className = "site-footer";
  el.innerHTML = `
    <div class="wrap">
      <div class="cols">
        <div>
          <a class="logo" href="index.html">Curi</a>
          <p>Promovendo conexão com a natureza através de experiências únicas. Mel, própolis e observação de aves na Mata Atlântica — Estrada Rio do Júlio, município de Joinville/SC.</p>
          <img class="selo" src="assets/brand/selo-curicaca.svg" alt="Selo Curi — curicaca">
        </div>
        <div>
          <h4>Navegue</h4>
          <nav>
            ${NAV_LINKS.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}
          </nav>
        </div>
        <div>
          <h4>Fale com a gente</h4>
          <nav>
            <a href="${waLink("Olá! Vim pelo site da Curi.")}" target="_blank" rel="noopener">WhatsApp · (47) 9 8897 1715</a>
            <a href="${CURI.instagram}" target="_blank" rel="noopener">@curi.biodiversidade</a>
            <a href="${CURI.airbnb}?utm_source=site&utm_medium=footer" target="_blank" rel="noopener">Hospede-se · Airbnb</a>
            <a href="mailto:${CURI.email}">${CURI.email}</a>
          </nav>
          <div class="social">
            <a href="${CURI.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>
            <a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICONS.whatsapp}</a>
            <a href="${CURI.airbnb}?utm_source=site&utm_medium=footer" target="_blank" rel="noopener" aria-label="Airbnb">${ICONS.bed}</a>
          </div>
        </div>
      </div>
      <div class="fine">
        <span>© Curi Biodiversidade — Mata Atlântica, Joinville/SC</span>
        <a href="politica-de-privacidade.html">Política de privacidade</a>
      </div>
    </div>`;
  document.body.appendChild(el);
}

function renderWaFloat() {
  if (document.querySelector(".wa-float")) return;
  const a = document.createElement("a");
  a.className = "wa-float";
  a.href = waLink("Olá! Vim pelo site da Curi e queria tirar uma dúvida.");
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Conversar no WhatsApp");
  a.innerHTML = ICONS.whatsapp;
  document.body.appendChild(a);
}

let toastTimer;
function toast(html) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.innerHTML = html;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3400);
}

function productCard(p) {
  return `
  <article class="card product-card">
    <a class="img-link" href="produto.html?p=${p.slug}">
      <img src="${p.img}" alt="${p.nome}" loading="lazy">
    </a>
    <div class="card-body">
      <a class="name" href="produto.html?p=${p.slug}">${p.nome}</a>
      <span class="muted" style="font-size:13px">${p.resumo}</span>
      <div class="buy-row">
        <span class="price">${brl(p.preco)}</span>
        <button class="add-btn" data-add="${p.slug}" aria-label="Adicionar ${p.nome} ao carrinho">${ICONS.plus}</button>
      </div>
    </div>
  </article>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  renderHeader();
  renderFooter();
  renderWaFloat();
  Cart.refreshBadge();

  // Espera o conteúdo do admin (com timeout curto). Se falhar, segue com
  // os valores embutidos em store.js — o site nunca fica esperando.
  try { await conteudoPronto; Conteudo.pintarTextos(); } catch {}
  Cart.refreshBadge();

  // preencher grades de produto marcadas com data-products
  document.querySelectorAll("[data-products]").forEach((grid) => {
    const which = grid.dataset.products;
    const list =
      which === "destaque" ? PRODUTOS.filter((p) => p.destaque) :
      which === "mel" ? PRODUTOS.filter((p) => p.slug.startsWith("mel")) :
      PRODUTOS;
    grid.innerHTML = list.map(productCard).join("");
  });

  // botões "adicionar" (delegação, cobre conteúdo dinâmico)
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    Cart.add(btn.dataset.add, 1);
    const p = PRODUTOS.find((x) => x.slug === btn.dataset.add);
    toast(`${p ? p.nome : "Produto"} no carrinho · <a href="carrinho.html">fechar pedido</a>`);
  });
});
