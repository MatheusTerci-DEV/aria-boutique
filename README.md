# Ária Boutique — protótipo de e-commerce

Home demonstrativa, responsiva e funcional criada para apresentar a proposta visual e comercial da Ária Boutique, em Sorocaba/SP.

## Como visualizar

O projeto não possui processo de build nem dependências. Para evitar restrições do navegador ao abrir arquivos diretamente, sirva a pasta com um servidor HTTP local. Exemplos:

```powershell
python -m http.server 8000
```

Depois, acesse `http://localhost:8000/`.

## Publicar no GitHub Pages

1. Extraia `aria-boutique-github-pages.zip`.
2. Envie **o conteúdo extraído** para a raiz do repositório, mantendo `index.html`, `assets`, `css` e `js` no primeiro nível.
3. No GitHub, abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**, a branch `main` e a pasta `/ (root)`.

O arquivo `.nojekyll` já está incluído e o projeto não requer build.

## Estrutura

- `index.html`: conteúdo e estrutura semântica da página.
- `css/style.css`: identidade visual e responsividade.
- `js/products.js`: catálogo e todas as informações comerciais/configurações.
- `js/app.js`: interações, favoritos, sacola, modal e WhatsApp.
- `assets/images/`: fotografias autorizadas da Ária.
- `assets/logo/`: arquivo original e versão quadrada com transparência, preparada a partir da arte fornecida pela cliente.

Todos os caminhos internos são relativos e compatíveis com publicação em um subdiretório do GitHub Pages.

## Funcionalidades

- Arquitetura visual mobile-first, com composição própria para telas pequenas.
- Chamada de abertura da campanha Sale, com arte oficial, fechamento acessível e CTA direto para o WhatsApp.
- Arte da campanha reconstruída em 1254 × 1254 px e catálogo renovado com 21 fotografias oficiais em alta resolução otimizadas em WebP.
- Menu móvel em gaveta com foco controlado, clique externo e tecla Escape.
- Pesquisa instantânea por produto.
- Painel móvel “Filtrar e ordenar”, com fechar/aplicar e filtros integrados no desktop.
- Visualização rápida com galeria, tamanho e cor.
- Favoritos persistidos no `localStorage`.
- Sacola lateral com quantidades, remoção, subtotal e persistência.
- Mensagem de pedido montada para revisão e envio pelo WhatsApp.
- Confirmações visuais, navegação por teclado e foco visível.
- Suporte a `prefers-reduced-motion`.
- Links oficiais de Instagram, WhatsApp e localização.

## Responsividade validada

O protótipo foi inspecionado em 320, 360, 390, 412, 768, 1024, 1366 e 1440 px, além de 667 × 375 px em orientação horizontal. Também foi revisado em uma largura equivalente a desktop com zoom de 200%.

- Catálogo com 2 colunas no celular, 3 em telas intermediárias e 4 em telas grandes.
- Modal quase completo no celular e centralizado no desktop.
- Sacola com 100% da largura no celular e máximo de 420 px no desktop.
- Áreas de toque mínimas de 44 × 44 px nos controles visíveis.
- Nenhum breakpoint apresentou `scrollWidth` maior que `clientWidth`.
- Não é utilizado `overflow-x: hidden` para mascarar problemas de layout.

Não há conta, checkout, backend ou transação financeira. A conclusão do pedido acontece no WhatsApp.

## Dados provisórios a substituir

Os nomes, preços, grades de tamanho e condições abaixo foram criados apenas para a apresentação e estão centralizados em `js/products.js`:

- Nomes e preços de todos os produtos.
- Disponibilidade de tamanhos e cores.
- Desconto demonstrativo de 5% no Pix.
- Parcelamento demonstrativo em até 6x sem juros.
- Entrega demonstrativa em Sorocaba, estimada entre 1 e 3 dias úteis, com valor conforme o bairro.
- Políticas detalhadas de troca e devolução.

O endereço, horário, Instagram, link oficial de WhatsApp e fotografias foram fornecidos pela cliente.
