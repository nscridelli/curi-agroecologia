/* Admin Curi Biodiversidade
   SPA estática: autentica e fala direto com o Supabase. O que protege os
   dados é o RLS do banco, não o endereço desta página. */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const URL_SUPA = "https://toblqihvfvdlvatvnswa.supabase.co";
const KEY_SUPA = "sb_publishable_TBqycd_fLqcTFwss8II_Bg_nqVPLfec";
const sb = createClient(URL_SUPA, KEY_SUPA);

const $  = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR",
             "PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const brl = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const num = (v) => Number(v || 0).toLocaleString("pt-BR");
const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);

let avisoTimer;
function aviso(msg, ruim = false) {
  const el = $("#aviso");
  el.textContent = msg;
  el.classList.toggle("ruim", ruim);
  el.classList.add("on");
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => el.classList.remove("on"), 3200);
}

/* ==================== AUTENTICAÇÃO ==================== */

$("#form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("#btn-entrar");
  btn.disabled = true; btn.textContent = "Entrando…";
  $("#login-erro").textContent = "";

  const { error } = await sb.auth.signInWithPassword({
    email: $("#login-email").value.trim(),
    password: $("#login-senha").value,
  });

  btn.disabled = false; btn.textContent = "Entrar";
  if (error) {
    $("#login-erro").textContent =
      error.message.includes("Invalid") ? "E-mail ou senha incorretos." : error.message;
    return;
  }
  iniciar();
});

$("#btn-sair").addEventListener("click", async () => {
  await sb.auth.signOut();
  location.reload();
});

$("#btn-senha").addEventListener("click", async () => {
  const nova = prompt("Nova senha (mínimo 8 caracteres):");
  if (!nova) return;
  if (nova.length < 8) return aviso("A senha precisa de pelo menos 8 caracteres.", true);
  const { error } = await sb.auth.updateUser({ password: nova });
  aviso(error ? error.message : "Senha trocada.", !!error);
});

async function iniciar() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) { $("#tela-login").hidden = false; $("#app").hidden = true; return; }
  $("#tela-login").hidden = true;
  $("#app").hidden = false;
  $("#quem").textContent = user.email;
  carregarPainel(30);
  carregarProdutos();
  carregarTextos();
  carregarConfig();
}

/* ==================== ABAS ==================== */

$$(".abas button").forEach((b) => b.addEventListener("click", () => {
  $$(".abas button").forEach((x) => x.classList.toggle("ativo", x === b));
  ["painel","produtos","textos","config"].forEach((a) => {
    $("#aba-" + a).hidden = a !== b.dataset.aba;
  });
}));

$$(".periodo button").forEach((b) => b.addEventListener("click", () => {
  $$(".periodo button").forEach((x) => x.classList.toggle("ativo", x === b));
  carregarPainel(Number(b.dataset.dias));
}));

/* ==================== PAINEL ==================== */

async function carregarPainel(dias) {
  $("#cards-kpi").innerHTML = '<p class="carregando">Carregando…</p>';
  const { data, error } = await sb.rpc("analytics_resumo", { dias });
  if (error) { $("#cards-kpi").innerHTML = `<p class="vazio">Erro: ${error.message}</p>`; return; }

  const f = data.funil, t = data.totais;
  const conversao = pct(f.enviaram_pedido, f.visitantes);

  $("#cards-kpi").innerHTML = `
    ${cardKpi(num(f.visitantes), "pessoas visitaram")}
    ${cardKpi(num(t.visitas), "páginas abertas")}
    ${cardKpi(num(f.enviaram_pedido), "pedidos enviados", true)}
    ${cardKpi(brl(t.receita), "em pedidos enviados", true)}
    ${cardKpi(brl(t.ticket_medio), "ticket médio")}
    ${cardKpi(conversao + "%", "viraram pedido")}
  `;

  // Funil
  const etapas = [
    ["Visitaram o site", f.visitantes],
    ["Colocaram algo no carrinho", f.adicionaram],
    ["Abriram o carrinho", f.abriram_carrinho],
    ["Enviaram o pedido no WhatsApp", f.enviaram_pedido],
  ];
  const topo = etapas[0][1] || 1;
  $("#funil").innerHTML = etapas.map(([rotulo, v], i) => {
    const anterior = i > 0 ? etapas[i-1][1] : null;
    const queda = anterior && anterior > 0
      ? `<div class="etapa-queda">${pct(v, anterior)}% de quem chegou na etapa anterior${anterior - v > 0 ? ` · ${num(anterior - v)} desistiram aqui` : ""}</div>`
      : "";
    return `<div class="etapa">
      <div class="etapa-topo"><span>${rotulo}</span><b>${num(v)}</b></div>
      <div class="etapa-barra"><span style="width:${Math.max(pct(v, topo), v > 0 ? 2 : 0)}%"></span></div>
      ${queda}
    </div>`;
  }).join("");

  // Gráfico por dia
  const dias_ = data.por_dia || [];
  if (!dias_.length) {
    $("#grafico").innerHTML = '<p class="vazio">Ainda sem movimento neste período.</p>';
  } else {
    const maxV = Math.max(...dias_.map(d => d.visitas), 1);
    const maxP = Math.max(...dias_.map(d => d.pedidos), 1);
    $("#grafico").innerHTML = `
      <div class="graf">${dias_.map(d => `
        <div class="graf-col" title="${d.dia}: ${d.visitas} visitas, ${d.pedidos} pedidos">
          <div class="p" style="height:${(d.pedidos / maxP) * 40}px"></div>
          <div class="v" style="height:${(d.visitas / maxV) * 95}px"></div>
        </div>`).join("")}</div>
      <div class="graf-legenda">
        <span><i style="background:var(--verde-mata)"></i>visitas</span>
        <span><i style="background:var(--mel)"></i>pedidos enviados</span>
      </div>`;
  }

  tabela("#tab-paginas",      data.paginas,      ["Página","Visitas"],   (r) => [r.pagina, num(r.visitas)]);
  tabela("#tab-produtos",     data.produtos,     ["Produto","Adições"],  (r) => [r.produto, num(r.adicoes)]);
  tabela("#tab-estados",      data.estados,      ["Estado","Pedidos","Valor"], (r) => [r.uf, num(r.pedidos), brl(r.receita)]);
  tabela("#tab-origens",      data.origens,      ["Origem","Visitas"],   (r) => [r.origem, num(r.visitas)]);
  tabela("#tab-dispositivos", data.dispositivos, ["Aparelho","Visitas"], (r) => [r.dispositivo === "mobile" ? "Celular" : "Computador", num(r.visitas)]);
}

const cardKpi = (n, r, destaque) =>
  `<div class="card-kpi${destaque ? " destaque" : ""}"><div class="n">${n}</div><div class="r">${r}</div></div>`;

function tabela(sel, linhas, cabecalho, mapear) {
  const el = $(sel);
  if (!linhas || !linhas.length) { el.innerHTML = '<p class="vazio">Sem dados ainda.</p>'; return; }
  el.innerHTML = `<table><thead><tr>${
    cabecalho.map((c, i) => `<th${i ? ' class="num"' : ""}>${c}</th>`).join("")
  }</tr></thead><tbody>${
    linhas.map((r) => `<tr>${mapear(r).map((c, i) => `<td${i ? ' class="num"' : ""}>${c}</td>`).join("")}</tr>`).join("")
  }</tbody></table>`;
}

/* ==================== PRODUTOS ==================== */

async function carregarProdutos() {
  const { data, error } = await sb.from("produtos").select("*").order("ordem");
  const el = $("#lista-produtos");
  if (error) { el.innerHTML = `<p class="vazio">Erro: ${error.message}</p>`; return; }

  el.innerHTML = data.map((p) => `
    <div class="item" data-slug="${p.slug}">
      <div class="item-topo">
        <img src="../${p.img}" alt="" onerror="this.style.visibility='hidden'">
        <div><b>${p.nome}</b><div class="slug">${p.slug}</div></div>
      </div>
      <div class="linha-campos">
        <label class="campo">Nome<input data-c="nome" value="${esc(p.nome)}"></label>
      </div>
      <div class="linha-campos quatro">
        <label class="campo">Preço (R$)
          <input data-c="preco" type="number" step="0.01" min="0" value="${p.preco}">
        </label>
        <label class="campo">Peso embalado (kg)
          <input data-c="peso" type="number" step="0.005" min="0" value="${p.peso}">
          <span class="ajuda">produto + vidro</span>
        </label>
        <label class="campo">Ordem
          <input data-c="ordem" type="number" step="1" value="${p.ordem}">
        </label>
        <label class="campo">Imagem
          <input data-c="img" value="${esc(p.img)}">
        </label>
      </div>
      <div class="linha-campos">
        <label class="campo">Resumo <span class="ajuda">frase curta no card da loja</span>
          <input data-c="resumo" value="${esc(p.resumo)}">
        </label>
        <label class="campo">Descrição <span class="ajuda">texto da página do produto</span>
          <textarea data-c="descricao">${esc(p.descricao)}</textarea>
        </label>
      </div>
      <div class="chaves">
        <label class="chave"><input type="checkbox" data-c="ativo" ${p.ativo ? "checked" : ""}> À venda</label>
        <label class="chave"><input type="checkbox" data-c="destaque" ${p.destaque ? "checked" : ""}> Destaque na home</label>
        <label class="chave"><input type="checkbox" data-c="selo_arte" ${p.selo_arte ? "checked" : ""}> Selo Arte</label>
      </div>
      <div class="item-acoes">
        <button class="btn btn-primary" data-salvar>Salvar</button>
        <span class="salvo">salvo ✓</span>
      </div>
    </div>`).join("");

  el.querySelectorAll("[data-salvar]").forEach((btn) => btn.addEventListener("click", async () => {
    const item = btn.closest(".item");
    const campos = {};
    item.querySelectorAll("[data-c]").forEach((i) => {
      const c = i.dataset.c;
      campos[c] = i.type === "checkbox" ? i.checked
                : i.type === "number"   ? Number(i.value)
                : i.value;
    });
    btn.disabled = true;
    const { error } = await sb.from("produtos").update(campos).eq("slug", item.dataset.slug);
    btn.disabled = false;
    if (error) return aviso("Não salvou: " + error.message, true);
    const s = item.querySelector(".salvo");
    s.classList.add("on"); setTimeout(() => s.classList.remove("on"), 1800);
    aviso("Produto atualizado. Já está no ar.");
  }));
}

/* ==================== TEXTOS ==================== */

async function carregarTextos() {
  const { data, error } = await sb.from("textos").select("*").order("grupo").order("ordem");
  const el = $("#lista-textos");
  if (error) { el.innerHTML = `<p class="vazio">Erro: ${error.message}</p>`; return; }

  const grupos = {};
  data.forEach((t) => (grupos[t.grupo] ||= []).push(t));

  el.innerHTML = Object.entries(grupos).map(([grupo, itens]) => `
    <h3 class="grupo-titulo">${grupo}</h3>
    ${itens.map((t) => `
      <div class="item" data-chave="${t.chave}">
        <label class="campo">${esc(t.rotulo || t.chave)}
          ${t.ajuda ? `<span class="ajuda">${esc(t.ajuda)}</span>` : ""}
          ${t.multilinha
            ? `<textarea data-v>${esc(t.valor)}</textarea>`
            : `<input data-v value="${esc(t.valor)}">`}
        </label>
        <div class="item-acoes" style="margin-top:12px">
          <button class="btn btn-primary" data-salvar>Salvar</button>
          <span class="salvo">salvo ✓</span>
        </div>
      </div>`).join("")}
  `).join("");

  el.querySelectorAll("[data-salvar]").forEach((btn) => btn.addEventListener("click", async () => {
    const item = btn.closest(".item");
    btn.disabled = true;
    const { error } = await sb.from("textos")
      .update({ valor: item.querySelector("[data-v]").value })
      .eq("chave", item.dataset.chave);
    btn.disabled = false;
    if (error) return aviso("Não salvou: " + error.message, true);
    const s = item.querySelector(".salvo");
    s.classList.add("on"); setTimeout(() => s.classList.remove("on"), 1800);
    aviso("Texto atualizado. Já está no ar.");
  }));
}

/* ==================== CONFIGURAÇÕES ==================== */

async function carregarConfig() {
  const { data, error } = await sb.from("config").select("*").order("chave");
  const el = $("#lista-config");
  if (error) { el.innerHTML = `<p class="vazio">Erro: ${error.message}</p>`; return; }

  const frete = data.find((c) => c.chave === "frete");
  const simples = data.filter((c) => c.chave !== "frete");

  el.innerHTML = simples.map((c) => `
    <div class="item" data-chave="${c.chave}">
      <label class="campo">${esc(c.rotulo || c.chave)}
        ${c.ajuda ? `<span class="ajuda">${esc(c.ajuda)}</span>` : ""}
        <input data-v value="${esc(typeof c.valor === "string" ? c.valor : JSON.stringify(c.valor))}">
      </label>
      <div class="item-acoes" style="margin-top:12px">
        <button class="btn btn-primary" data-salvar>Salvar</button>
        <span class="salvo">salvo ✓</span>
      </div>
    </div>`).join("");

  el.querySelectorAll("[data-salvar]").forEach((btn) => btn.addEventListener("click", async () => {
    const item = btn.closest(".item");
    const bruto = item.querySelector("[data-v]").value;
    // número vira número; o resto vira texto
    const valor = bruto.trim() !== "" && !isNaN(Number(bruto)) ? Number(bruto) : bruto;
    btn.disabled = true;
    const { error } = await sb.from("config").update({ valor }).eq("chave", item.dataset.chave);
    btn.disabled = false;
    if (error) return aviso("Não salvou: " + error.message, true);
    const s = item.querySelector(".salvo");
    s.classList.add("on"); setTimeout(() => s.classList.remove("on"), 1800);
    aviso("Configuração atualizada.");
  }));

  const tabela = frete?.valor || {};
  $("#grade-frete").innerHTML = UFS.map((uf) => `
    <div class="uf-campo">
      <label for="uf-${uf}">${uf}</label>
      <input id="uf-${uf}" type="number" step="1" min="0" value="${tabela[uf] ?? ""}">
    </div>`).join("");

  $("#btn-salvar-frete").addEventListener("click", async () => {
    const novo = {};
    UFS.forEach((uf) => {
      const v = Number($("#uf-" + uf).value);
      if (v > 0) novo[uf] = v;
    });
    const btn = $("#btn-salvar-frete");
    btn.disabled = true;
    const { error } = await sb.from("config").update({ valor: novo }).eq("chave", "frete");
    btn.disabled = false;
    aviso(error ? "Não salvou: " + error.message : "Tabela de frete atualizada.", !!error);
  }, { once: true });
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
                                 .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ==================== START ==================== */
iniciar();
