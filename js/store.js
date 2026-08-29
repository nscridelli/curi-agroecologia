/* ============================================================
   Curi Biodiversidade — CONFIGURAÇÃO DA LOJA
   Este é o único arquivo que precisa ser editado no dia a dia:
   preços, produtos, frete e número do WhatsApp ficam aqui.
   ============================================================ */

const CURI = {
  // WhatsApp que recebe os pedidos (só números, com DDI 55)
  whatsapp: "5547988971715",

  instagram: "https://www.instagram.com/curi.biodiversidade/",
  airbnb: "https://www.airbnb.com.br/rooms/13135898",
  email: "curi.agroecologia@gmail.com",

  // Frete: estimativa. O valor final é confirmado no WhatsApp antes
  // do pagamento — o site deixa isso claro em toda tela.
  //
  // Como o cálculo funciona:
  //   peso do pedido = soma do peso de cada produto + pesoEmbalagem
  //   faixa cobrada  = peso arredondado para cima, mínimo 1 kg (como nos Correios)
  //   frete          = base do estado + (faixa - 1) × base × adicionalPorKg
  //
  // Os valores de `frete` abaixo valem para a primeira faixa (até 1 kg).
  frete: {
    SC: 15,
    PR: 20, RS: 20,
    SP: 25, RJ: 28, MG: 28, ES: 28,
    DF: 32, GO: 32, MS: 32, MT: 35,
    BA: 38, SE: 38, AL: 38, PE: 38, PB: 38, RN: 38, CE: 38, PI: 38, MA: 40,
    TO: 40, PA: 42, AP: 45, RR: 48, AM: 45, RO: 42, AC: 48,
  },
  // Peso da caixa + plástico-bolha usados para proteger o vidro (kg).
  pesoEmbalagem: 0.15,

  // Quanto cada quilo extra acrescenta, como fração do frete base do estado.
  // 0.25 = cada quilo a mais soma 25% do valor base. Suba se os Correios
  // estiverem cobrando mais nas faixas altas.
  adicionalPorKg: 0.25,

  freteObs: "Estimativa via Correios, calculada pelo peso do pedido. Confirmamos o valor exato no WhatsApp antes do pagamento.",
};

const PRODUTOS = [
  {
    slug: "mel-450",
    nome: "Mel silvestre 450g",
    preco: 34.00,
    peso: 0.70,          // kg embalado — 450g de mel + pote de vidro e tampa
    img: "assets/img/produto-mel-450.jpg",
    resumo: "Mel multifloral da Mata Atlântica, safra única, envasado à mão.",
    descricao: "Nosso mel multifloral é produzido a partir do néctar de espécies nativas da Mata Atlântica. Cada safra é única, com sabor e aroma que variam conforme as floradas e o clima do período. Cru, sem pasteurização — o pólen e a própolis ficam no mel.",
    ficha: {
      "Florada": "Silvestre, multifloral",
      "Origem": "Mata recuperada · Estrada Rio do Júlio, Joinville/SC",
      "Peso": "450g · pote de vidro",
      "Processamento": "Mínimo — cru, sem pasteurização",
      "Conservação": "Local seco e fresco; cristalizar é natural",
      "Produção": "Envasado à mão · Selo Arte",
    },
    seloArte: true,
    destaque: true,
  },
  {
    slug: "mel-750",
    nome: "Mel silvestre 750g",
    preco: 42.00,
    peso: 1.05,          // kg embalado — 750g de mel + pote de vidro e tampa
    img: "assets/img/produto-mel-750.jpg",
    resumo: "O mesmo mel da floresta viva, no pote família.",
    descricao: "Nosso mel multifloral é produzido a partir do néctar de espécies nativas da Mata Atlântica. Cada safra é única, com sabor e aroma que variam conforme as floradas e o clima do período. O pote de 750g rende mais e é o preferido de quem já conhece.",
    ficha: {
      "Florada": "Silvestre, multifloral",
      "Origem": "Mata recuperada · Estrada Rio do Júlio, Joinville/SC",
      "Peso": "750g · pote de vidro",
      "Processamento": "Mínimo — cru, sem pasteurização",
      "Conservação": "Local seco e fresco; cristalizar é natural",
      "Produção": "Envasado à mão · Selo Arte",
    },
    seloArte: true,
    destaque: true,
  },
  {
    slug: "propolis",
    nome: "Extrato de própolis",
    preco: 35.00,
    peso: 0.09,          // kg embalado — frasco de vidro com conta-gotas
    img: "assets/img/produto-propolis-extrato.jpg",
    resumo: "Produção própria e artesanal, do nosso apiário.",
    descricao: "Produção própria e artesanal, com matéria-prima de alta qualidade vinda do nosso apiário. É um produto natural, seguro e eficaz para reforçar a imunidade.",
    ficha: {
      "Origem": "Apiário próprio · Mata Atlântica",
      "Embalagem": "Vidro com conta-gotas",
      "Produção": "Artesanal, em pequenos lotes",
      "Uso": "Algumas gotas em água ou mel",
    },
    seloArte: false,
    destaque: true,
  },
  {
    slug: "velas",
    nome: "Velas de cera de abelha (jogo c/ 2)",
    preco: 36.00,
    peso: 0.18,          // kg embalado — par de velas + caixa kraft
    img: "assets/img/produto-velas.jpg",
    resumo: "Cera pura e pavio de rami. Biodegradável, aroma suave.",
    descricao: "Vela artesanal feita com cera de abelha e pavio de rami. É biodegradável, não emite gases tóxicos e tem aroma suave da cera natural.",
    ficha: {
      "Material": "Cera de abelha pura + pavio de rami",
      "Conteúdo": "Jogo com 2 velas · caixa kraft",
      "Queima": "Limpa, sem gases tóxicos",
      "Aroma": "Suave, da própria cera",
    },
    seloArte: false,
    destaque: true,
  },
];

// Sazonais: aparecem na loja como "sob consulta" (sem carrinho)
const SAZONAIS = [
  { nome: "Azeite de pimenta", resumo: "Feito aqui na Curi, conforme a estação." },
  { nome: "Cúrcuma desidratada", resumo: "Colhida e desidratada na propriedade." },
  { nome: "Geleias da estação", resumo: "Frutas da época, em pequenos lotes." },
];
