# Ícones Convertize

4.967 ícones SVG da Convertize. Lista de nomes em `icons.json` e `ICONS.md`.

## Por link (GitHub, via jsDelivr)

```
https://cdn.jsdelivr.net/gh/izaqueotaviano/icons@main/svg/<nome>.svg
```

## Pacote npm `convertize-icons`

Scripts que colocam os ícones na página. Funcionam também em artifacts do claude.ai, que só aceitam scripts de CDN (imagens de fora são bloqueadas).

| Arquivo | Tamanho | Uso |
| --- | --- | --- |
| `dist/core.js` | ~95 KB | Os ícones usados pelo Convertize Design System |
| `dist/icons/<nome>.js` | ~1 KB cada | Um ícone; carregue só os que usar |
| `dist/all.js` | ~7 MB | Todos os ícones; evite em produção |

```html
<script src="https://cdn.jsdelivr.net/npm/convertize-icons@1/dist/core.js"></script>
<script src="https://cdn.jsdelivr.net/npm/convertize-icons@1/dist/icons/rocket.js"></script>

<i data-icon="truck"></i>  <!-- vira o SVG, 1em, na cor do texto -->
```

Com o script carregado, elementos que usam o link do jsDelivr como máscara
(`style="--icon:url(https://cdn.jsdelivr.net/gh/izaqueotaviano/icons@main/svg/cart.svg)"`, o formato do
Convertize Design System) passam a usar o ícone embutido. Conteúdo inserido depois é atualizado sozinho.

API: `ConvertizeIcons.get(nome)` (SVG), `ConvertizeIcons.url(nome)` (`url("data:...")` para CSS),
`ConvertizeIcons.render(elemento)`, `ConvertizeIcons.names()`.

## Publicar uma versão

1. Ajuste `version` em `package.json`.
2. Crie a tag: `git tag v1.0.1 && git push --tags`. A action **Publicar no npm** gera `dist/` e publica.

A action precisa do segredo `NPM_TOKEN` (token de automação do npmjs.com) em
Settings › Secrets and variables › Actions. Sem a action: `npm login` e `npm publish --access public`.
