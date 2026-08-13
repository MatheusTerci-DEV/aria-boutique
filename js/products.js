/*
 * Conteúdo centralizado para facilitar a substituição pelos dados oficiais.
 * As fotografias são oficiais; nomes, preços e condições comerciais são demonstrativos.
 */
window.STORE_CONFIG = {
  name: "Ária Boutique",
  tagline: "Looks que unem estilo e confiança",
  whatsappUrl: "https://api.whatsapp.com/message/CRKKR5NUOMX2M1?autoload=1&app_absent=0&utm_source=ig",
  instagramUrl: "https://www.instagram.com/aria.boutiqueoficial?igsh=MTQ5NnVxcHA3cmgzcg%3D%3D",
  instagramHandle: "@aria.boutiqueoficial",
  address: "R. Francisco Rodrigues dos Santos, 14 — Loja 3 — Horto Florestal, Sorocaba — SP, 18072-383",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=R.%20Francisco%20Rodrigues%20dos%20Santos%2C%2014%20-%20Horto%20Florestal%2C%20Sorocaba%20-%20SP%2C%2018072-383",
  hours: {
    weekdays: { label: "Segunda a sexta", value: "11h às 19h" },
    saturday: { label: "Sábado", value: "10h30 às 15h" },
    sunday: { label: "Domingo", value: "Fechado" }
  },
  shipping: {
    short: "Entrega em Sorocaba • Consulte seu bairro",
    benefit: "Consulte prazo e valor para o seu bairro.*",
    details: "Entrega local estimada em 1–3 dias úteis, com valor conforme o bairro."
  },
  payment: {
    pixDiscount: 5,
    installments: 6,
    short: "5% no Pix • Até 6x sem juros",
    benefit: "5% no Pix ou até 6x sem juros.*",
    details: "Pagamento demonstrativo com 5% no Pix ou cartão em até 6x sem juros."
  },
  isCommercialDataProvisional: true
};

const official = (file) => `assets/images/official/${file}`;

window.PRODUCTS = [
  {
    id: "conjunto-aurora",
    name: "Conjunto Aurora",
    subtitle: "Blusa estruturada e shorts",
    price: 389.9,
    category: "casual",
    categoryLabel: "Casual",
    order: 8,
    image: official("conjunto-aurora-01.webp"),
    position: "center 12%",
    gallery: [official("conjunto-aurora-01.webp"), official("conjunto-aurora-02.webp"), official("conjunto-aurora-03.webp")],
    alt: "Modelo veste conjunto off-white com blusa estruturada e shorts",
    description: "Leve e feminino, o conjunto off-white combina estrutura suave com praticidade para os dias de sol.",
    sizes: ["P", "M", "G"],
    colors: [{ name: "Off-white", value: "#eee8dc" }]
  },
  {
    id: "vestido-essenza",
    name: "Vestido Essenza",
    subtitle: "Vestido preto de gola alta",
    price: 319.9,
    category: "jantar",
    categoryLabel: "Jantar",
    order: 7,
    image: official("vestido-essenza-01.webp"),
    position: "center 10%",
    gallery: [official("vestido-essenza-01.webp"), official("vestido-essenza-02.webp"), official("vestido-essenza-03.webp")],
    alt: "Modelo veste vestido preto curto de gola alta dentro da Ária Boutique",
    description: "Uma silhueta limpa e elegante fotografada na própria boutique. Versátil para produções noturnas e eventos.",
    sizes: ["PP", "P", "M", "G"],
    colors: [{ name: "Preto", value: "#171513" }]
  },
  {
    id: "conjunto-denim",
    name: "Conjunto Denim",
    subtitle: "Corset e pantalona em denim",
    price: 449.9,
    category: "casual",
    categoryLabel: "Casual",
    order: 6,
    image: official("conjunto-denim-01.webp"),
    position: "center 10%",
    gallery: [official("conjunto-denim-01.webp"), official("conjunto-denim-02.webp")],
    alt: "Modelo veste corset e pantalona em denim azul",
    description: "O denim ganha uma leitura sofisticada no conjunto de corset ajustado e pantalona ampla.",
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "Denim", value: "#627786" }]
  },
  {
    id: "coordenado-terra",
    name: "Coordenado Terra",
    subtitle: "Colete e shorts em tons terrosos",
    price: 489.9,
    category: "eventos",
    categoryLabel: "Eventos",
    order: 5,
    image: official("coordenado-terra-01.webp"),
    position: "center 8%",
    gallery: [official("coordenado-terra-01.webp"), official("coordenado-terra-02.webp")],
    alt: "Modelo veste colete caramelo e shorts marrom",
    description: "Sobreposição alongada e shorts coordenados em uma composição rica em texturas e tons naturais.",
    sizes: ["P", "M", "G"],
    colors: [{ name: "Caramelo", value: "#a95821" }, { name: "Café", value: "#6c4a3b" }]
  },
  {
    id: "conjunto-nuit",
    name: "Conjunto Nuit",
    subtitle: "Corset e pantalona com brilho",
    price: 459.9,
    category: "trabalho",
    categoryLabel: "Trabalho",
    order: 4,
    image: official("conjunto-nuit-01.webp"),
    position: "center 10%",
    gallery: [official("conjunto-nuit-01.webp"), official("conjunto-nuit-02.webp")],
    alt: "Modelo veste corset e pantalona pretos com brilho sobre camisa branca",
    description: "Alfaiataria contemporânea com pontos de brilho. A camisa branca cria o contraste elegante da composição.",
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "Preto", value: "#171513" }, { name: "Off-white", value: "#f3f0e9" }]
  },
  {
    id: "look-ebano",
    name: "Look Ébano",
    subtitle: "Tule e saia de efeito couro",
    price: 369.9,
    category: "jantar",
    categoryLabel: "Jantar",
    order: 3,
    image: official("look-ebano-03.webp"),
    position: "center 12%",
    gallery: [official("look-ebano-03.webp"), official("look-ebano-01.webp"), official("look-ebano-02.webp")],
    alt: "Modelo veste look preto com tule e saia curta de efeito couro",
    description: "Transparência sutil, linhas firmes e uma composição monocromática para um visual noturno sofisticado.",
    sizes: ["PP", "P", "M", "G"],
    colors: [{ name: "Preto", value: "#171513" }]
  },
  {
    id: "conjunto-cacau",
    name: "Conjunto Cacau",
    subtitle: "Blusa estruturada e shorts",
    price: 399.9,
    category: "trabalho",
    categoryLabel: "Trabalho",
    order: 2,
    image: official("conjunto-cacau-01.webp"),
    position: "center 8%",
    gallery: [official("conjunto-cacau-01.webp"), official("conjunto-cacau-02.webp"), official("conjunto-cacau-03.webp")],
    alt: "Modelo veste conjunto marrom com blusa estruturada e shorts",
    description: "Alfaiataria feminina em tom cacau, com linhas precisas e uma proposta contemporânea para o dia.",
    sizes: ["P", "M", "G"],
    colors: [{ name: "Cacau", value: "#8b5743" }]
  },
  {
    id: "conjunto-lume",
    name: "Conjunto Lume",
    subtitle: "Top e pantalona com brilho",
    price: 439.9,
    category: "eventos",
    categoryLabel: "Eventos",
    order: 1,
    image: official("conjunto-lume-01.webp"),
    position: "center 10%",
    gallery: [official("conjunto-lume-01.webp")],
    alt: "Modelo veste conjunto preto de top e pantalona com brilho",
    description: "Textura luminosa e proporções alongadas definem este conjunto pensado para ocasiões especiais.",
    sizes: ["P", "M", "G"],
    colors: [{ name: "Preto", value: "#171513" }]
  }
];
