/* Curi Biodiversidade — analytics próprio, anônimo e sem cookies.
   Guarda só o que o Alexandre precisa para decidir: quantas pessoas
   chegaram, o que olharam e quantas mandaram pedido. Nenhum dado pessoal,
   nenhum cookie, nenhum IP, nada compartilhado com terceiros. */

const Analytics = {
  // Id aleatório que vive só nesta aba. Serve para ligar "visitou" a
  // "mandou pedido" na mesma visita. Some quando a aba fecha.
  sessao() {
    try {
      let s = sessionStorage.getItem("curi_sessao");
      if (!s) {
        s = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem("curi_sessao", s);
      }
      return s;
    } catch { return null; }
  },

  ligado() {
    // Respeita "não me rastreie" do navegador.
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return false;
    // Em desenvolvimento não polui os números reais (use ?analytics=1 para testar).
    const local = ["localhost", "127.0.0.1", ""].includes(location.hostname);
    if (local && !location.search.includes("analytics=1")) return false;
    return true;
  },

  dispositivo() {
    return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
  },

  // Só o domínio de quem indicou, quando vem de fora. Navegação interna não conta.
  origem() {
    try {
      if (!document.referrer) return null;
      const h = new URL(document.referrer).hostname;
      return h === location.hostname ? null : h.slice(0, 200);
    } catch { return null; }
  },

  registrar(tipo, dados = {}) {
    if (!this.ligado()) return;
    const corpo = {
      tipo,
      pagina: (location.pathname.split("/").pop() || "index.html").slice(0, 120),
      sessao: this.sessao(),
      dispositivo: this.dispositivo(),
      ...dados,
    };
    if (tipo === "pageview") corpo.referrer = this.origem();

    try {
      // keepalive garante o envio mesmo se a pessoa sair da página no clique.
      fetch(SUPA.rest + "eventos", {
        method: "POST",
        headers: { ...SUPA.headers, Prefer: "return=minimal" },
        body: JSON.stringify(corpo),
        keepalive: true,
      }).catch(() => {});
    } catch { /* analytics nunca pode quebrar o site */ }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Analytics.registrar("pageview");

  // Cliques que valem dinheiro ou relacionamento
  document.body.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.includes("wa.me"))            Analytics.registrar("clique_whatsapp");
    else if (href.includes("airbnb"))      Analytics.registrar("clique_airbnb");
    else if (href.includes("instagram"))   Analytics.registrar("clique_instagram");
  });
});
