/* Curi Biodiversidade — carrinho e pedido via WhatsApp
   O site não processa pagamento: organiza o pedido (itens, endereço,
   frete estimado, total) e envia tudo pronto para o WhatsApp da Curi. */

const Cart = {
  KEY: "curi_cart_v1",

  read() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || {}; }
    catch { return {}; }
  },

  write(cart) {
    localStorage.setItem(this.KEY, JSON.stringify(cart));
    this.refreshBadge();
  },

  add(slug, qty = 1) {
    const cart = this.read();
    cart[slug] = (cart[slug] || 0) + qty;
    this.write(cart);
    if (typeof Analytics !== "undefined") Analytics.registrar("add_carrinho", { produto: slug, itens: qty });
  },

  setQty(slug, qty) {
    const cart = this.read();
    if (qty <= 0) delete cart[slug];
    else cart[slug] = qty;
    this.write(cart);
  },

  remove(slug) { this.setQty(slug, 0); },

  clear() { this.write({}); },

  items() {
    const cart = this.read();
    return Object.entries(cart)
      .map(([slug, qty]) => {
        const p = PRODUTOS.find((x) => x.slug === slug);
        return p ? { ...p, qty } : null;
      })
      .filter(Boolean);
  },

  count() {
    return Object.values(this.read()).reduce((a, b) => a + b, 0);
  },

  subtotal() {
    return this.items().reduce((s, i) => s + i.preco * i.qty, 0);
  },

  refreshBadge() {
    const el = document.getElementById("cart-count");
    if (!el) return;
    const n = this.count();
    el.textContent = n;
    el.classList.toggle("on", n > 0);
  },
};

/* ---------- Página do carrinho / checkout ---------- */

// Peso embalado do pedido, em kg (produtos + caixa e proteção).
function pesoCarrinho() {
  const produtos = Cart.items().reduce((s, i) => s + (i.peso || 0) * i.qty, 0);
  return produtos > 0 ? produtos + CURI.pesoEmbalagem : 0;
}

// Faixa cobrada pelos Correios: arredonda o peso para cima, mínimo 1 kg.
function faixaPeso(peso) {
  return Math.max(1, Math.ceil(peso));
}

// Frete = base do estado (1ª faixa) + acréscimo por quilo extra.
function freteEstimado(uf) {
  if (!uf) return null;
  const base = CURI.frete[uf.toUpperCase()];
  if (typeof base !== "number") return null;

  const peso = pesoCarrinho();
  if (peso <= 0) return null;

  const kg = faixaPeso(peso);
  return Math.round(base + (kg - 1) * base * CURI.adicionalPorKg);
}

function pesoFormatado(kg) {
  return kg.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " kg";
}

function renderCartPage() {
  const box = document.getElementById("cart-items");
  if (!box) return; // não estamos na página do carrinho

  const items = Cart.items();
  const checkout = document.getElementById("checkout-area");

  if (!items.length) {
    box.innerHTML = `
      <div class="empty-state">
        ${ICONS.cart}
        <h2 class="h2">Seu carrinho está vazio</h2>
        <p class="lead" style="margin:0 auto 20px">Nosso mel, própolis e velas saem daqui da Mata Atlântica para todo o Brasil.</p>
        <a class="btn btn-primary" href="loja.html">Conheça a loja</a>
      </div>`;
    if (checkout) checkout.style.display = "none";
    return;
  }
  if (checkout) checkout.style.display = "";

  box.innerHTML = items.map((i) => `
    <div class="cart-item">
      <img src="${i.img}" alt="${i.nome}">
      <div>
        <div class="ci-name">${i.nome}</div>
        <div class="ci-price">${brl(i.preco)} <span class="muted" style="font-weight:400">/ un.</span></div>
      </div>
      <div class="ci-actions">
        <div class="qty-stepper">
          <button data-qty="${i.slug}:-1" aria-label="Diminuir quantidade">–</button>
          <span>${i.qty}</span>
          <button data-qty="${i.slug}:1" aria-label="Aumentar quantidade">+</button>
        </div>
        <button class="remove-btn" data-remove="${i.slug}">remover</button>
      </div>
    </div>`).join("");

  updateSummary();
}

function updateSummary() {
  const sub = Cart.subtotal();
  const uf = (document.getElementById("f-uf") || {}).value || "";
  const frete = freteEstimado(uf);

  const peso = pesoCarrinho();

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set("sum-subtotal", brl(sub));
  set("sum-peso", peso > 0 ? `${pesoFormatado(peso)} · faixa de ${faixaPeso(peso)} kg` : "—");
  set("sum-frete", frete === null ? "informe o CEP" : `~ ${brl(frete)}`);
  set("sum-total", frete === null ? brl(sub) + " + frete" : `~ ${brl(sub + frete)}`);
}

async function buscaCep(cep) {
  cep = cep.replace(/\D/g, "");
  if (cep.length !== 8) return;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const d = await r.json();
    if (d.erro) return;
    const fill = (id, v) => { const el = document.getElementById(id); if (el && v) el.value = v; };
    fill("f-endereco", d.logradouro);
    fill("f-bairro", d.bairro);
    fill("f-cidade", d.localidade);
    fill("f-uf", d.uf);
    updateSummary();
  } catch { /* sem internet ou ViaCEP fora — segue manual */ }
}

function montarMensagem() {
  const v = (id) => (document.getElementById(id) || {}).value?.trim() || "";
  const items = Cart.items();
  const sub = Cart.subtotal();
  const uf = v("f-uf");
  const frete = freteEstimado(uf);

  const linhas = [];
  linhas.push("🍯 *Novo pedido pelo site — Curi Biodiversidade*");
  linhas.push("");
  linhas.push("*Itens:*");
  items.forEach((i) => {
    linhas.push(`• ${i.qty}× ${i.nome} — ${brl(i.preco * i.qty)}`);
  });
  linhas.push("");
  linhas.push(`Subtotal: ${brl(sub)}`);
  const peso = pesoCarrinho();
  linhas.push(`Peso estimado: ${pesoFormatado(peso)} (faixa de ${faixaPeso(peso)} kg)`);
  linhas.push(frete === null
    ? "Frete: a calcular"
    : `Frete estimado (${uf.toUpperCase()}): ${brl(frete)}`);
  linhas.push(`*Total${frete === null ? "" : " estimado"}: ${brl(sub + (frete || 0))}*`);
  linhas.push("");
  linhas.push("*Entrega:*");
  linhas.push(`Nome: ${v("f-nome")}`);
  const num = v("f-numero"), comp = v("f-complemento");
  linhas.push(`Endereço: ${v("f-endereco")}${num ? ", " + num : ""}${comp ? " — " + comp : ""}`);
  linhas.push(`Bairro: ${v("f-bairro")}`);
  linhas.push(`Cidade/UF: ${v("f-cidade")}/${uf.toUpperCase()} · CEP ${v("f-cep")}`);
  const obs = v("f-obs");
  if (obs) { linhas.push(""); linhas.push(`Obs: ${obs}`); }
  linhas.push("");
  linhas.push("Pode confirmar o frete e me passar o pagamento? 😊");

  return linhas.join("\n");
}

function validarCheckout() {
  const obrigatorios = ["f-nome", "f-cep", "f-endereco", "f-numero", "f-bairro", "f-cidade", "f-uf"];
  let ok = true;
  obrigatorios.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const vazio = !el.value.trim();
    el.classList.toggle("field-error", vazio);
    if (vazio) ok = false;
  });
  return ok;
}

document.addEventListener("DOMContentLoaded", async () => {
  try { await conteudoPronto; } catch {}
  renderCartPage();

  if (document.getElementById("cart-items") && Cart.count() > 0 && typeof Analytics !== "undefined") {
    Analytics.registrar("abriu_carrinho", { itens: Cart.count(), valor: Cart.subtotal() });
  }

  document.body.addEventListener("click", (e) => {
    const q = e.target.closest("[data-qty]");
    if (q) {
      const [slug, delta] = q.dataset.qty.split(":");
      const cart = Cart.read();
      Cart.setQty(slug, (cart[slug] || 0) + Number(delta));
      renderCartPage();
      return;
    }
    const r = e.target.closest("[data-remove]");
    if (r) {
      Cart.remove(r.dataset.remove);
      renderCartPage();
    }
  });

  const cep = document.getElementById("f-cep");
  if (cep) {
    cep.addEventListener("blur", () => buscaCep(cep.value));
    cep.addEventListener("input", () => {
      cep.value = cep.value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
    });
  }
  const ufSel = document.getElementById("f-uf");
  if (ufSel) ufSel.addEventListener("change", updateSummary);

  const enviar = document.getElementById("btn-enviar-pedido");
  if (enviar) {
    enviar.addEventListener("click", () => {
      if (!Cart.count()) { toast("Seu carrinho está vazio."); return; }
      if (!validarCheckout()) {
        toast("Preencha os campos destacados para a entrega.");
        return;
      }
      const uf = (document.getElementById("f-uf") || {}).value || null;
      const frete = freteEstimado(uf);
      if (typeof Analytics !== "undefined") {
        Analytics.registrar("pedido_whatsapp", {
          itens: Cart.count(),
          valor: Cart.subtotal() + (frete || 0),
          peso: Number(pesoCarrinho().toFixed(3)),
          uf: uf ? uf.toUpperCase() : null,
        });
      }
      const url = "https://wa.me/" + CURI.whatsapp + "?text=" + encodeURIComponent(montarMensagem());
      window.open(url, "_blank", "noopener");
      toast("Pedido montado! Finalize o envio no WhatsApp.");
    });
  }
});
