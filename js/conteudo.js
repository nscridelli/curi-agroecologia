/* Curi Biodiversidade — carrega conteúdo editável do admin.

   Regra de ouro: o site nunca depende disto para funcionar. Os valores de
   js/store.js são o padrão; o que vem do banco apenas sobrescreve. Se o
   Supabase estiver fora do ar ou lento, o site abre igual, com os valores
   embutidos. */

const Conteudo = {
  TIMEOUT: 2500,

  async buscar(caminho) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), this.TIMEOUT);
    try {
      const r = await fetch(SUPA.rest + caminho, { headers: SUPA.headers, signal: ctrl.signal });
      return r.ok ? await r.json() : null;
    } catch { return null; }
    finally { clearTimeout(t); }
  },

  aplicarProdutos(linhas) {
    if (!Array.isArray(linhas) || !linhas.length) return;
    const novos = linhas.map((p) => ({
      slug: p.slug,
      nome: p.nome,
      preco: Number(p.preco),
      peso: Number(p.peso),
      img: p.img,
      resumo: p.resumo,
      descricao: p.descricao,
      ficha: p.ficha || {},
      seloArte: p.selo_arte,
      destaque: p.destaque,
    }));
    PRODUTOS.length = 0;
    PRODUTOS.push(...novos);
  },

  aplicarConfig(linhas) {
    if (!Array.isArray(linhas)) return;
    for (const { chave, valor } of linhas) {
      if (chave in CURI) CURI[chave] = valor;
    }
  },

  // Troca textos marcados no HTML com data-texto="chave"
  aplicarTextos(linhas) {
    if (!Array.isArray(linhas)) return;
    const mapa = Object.fromEntries(linhas.map((t) => [t.chave, t.valor]));
    document.querySelectorAll("[data-texto]").forEach((el) => {
      const v = mapa[el.dataset.texto];
      if (typeof v === "string" && v.trim()) el.textContent = v;
    });
  },

  async carregar() {
    const [produtos, config, textos] = await Promise.all([
      this.buscar("produtos?select=*&ativo=eq.true&order=ordem.asc"),
      this.buscar("config?select=chave,valor"),
      this.buscar("textos?select=chave,valor"),
    ]);
    this.aplicarProdutos(produtos);
    this.aplicarConfig(config);
    this._textos = textos;
  },

  // chamado depois que o DOM existe
  pintarTextos() { this.aplicarTextos(this._textos); },
};

// Promessa que o resto do site espera antes de desenhar as grades de produto.
const conteudoPronto = Conteudo.carregar();
