#!/usr/bin/env node
// Gera dist/ do pacote convertize-icons a partir de svg/*.svg. Sem dependências.
//   dist/icons/<nome>.js  um ícone por arquivo (carregue só os que usar)
//   dist/core.js          carregador + os ícones usados pelo Convertize Design System
//   dist/all.js           carregador + todos os ícones (pesado: use só se precisar de tudo)
//   dist/loader.js        só o carregador
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SVG = path.join(ROOT, 'svg');
const DIST = path.join(ROOT, 'dist');
const pkg = require(path.join(ROOT, 'package.json'));

// Ícones que o kit do design system usa (nome da biblioteca)
const CORE = ['search', 'add', 'minus', 'x', 'check', 'chevron-down', 'chevron-up', 'chevron-left', 'chevron-right',
  'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'arrow-up-right', 'arrows-sort', 'menu-2', 'layout-sidebar',
  'home', 'shopping-bag', 'users', 'user-circle', 'adjustments-horizontal', 'bell', 'heart', 'star', 'trash', 'pencil',
  'copy', 'download', 'upload', 'filter', 'dots', 'dots-vertical', 'eye', 'eye-off', 'info-circle', 'alert-triangle',
  'circle-check', 'circle-x', 'help-circle', 'calendar', 'clock', 'mail', 'lock', 'logout', 'send', 'paperclip',
  'message-circle', 'layout-grid', 'list', 'sun', 'moon', 'refresh', 'external-link', 'photo', 'file-text', 'folder',
  'sparkles', 'percentage', 'map-pin', 'player-stop', 'thumb-up', 'thumb-down', 'phone', 'world', 'shield-check',
  'gift', 'qrcode', 'barcode', 'stack-2', 'wand', 'chart-bar', 'trending-up', 'headset', 'bolt', 'cart', 'category',
  'arrow-back-up', 'truck', 'package', 'tag', 'plug', 'building-store', 'device-desktop', 'credit-card-2',
  'settings-automation', 'category-plus', 'plug-connected-x', 'truck-delivery'];

function clean(s) {
  s = s.replace(/<\?xml[\s\S]*?\?>|<!--[\s\S]*?-->|<metadata[\s\S]*?<\/metadata>|<sodipodi:namedview[\s\S]*?\/>|<defs[^>]*\/>/g, '');
  s = s.replace(/\s(style|id|version|xmlns:\w+|\w+:docname|inkscape:[\w-]+|sodipodi:[\w-]+|ns\d:[\w-]+|width|height)="[^"]*"/g, '');
  s = s.replace(/>\s+</g, '><').trim();
  // forma opaca na cor do texto
  s = s.replace(/<svg([^>]*?)\sfill="none"/, '<svg$1').replace('<svg ', '<svg fill="currentColor" ');
  return s;
}

const LOADER = `/*! convertize-icons ${pkg.version} | MIT */
(function (w, d) {
  'use strict';
  if (w.ConvertizeIcons && w.ConvertizeIcons.add) return;
  var reg = {}, CDN = /cdn\\.jsdelivr\\.net\\/gh\\/izaqueotaviano\\/icons@[^/]+\\/svg\\/([a-z0-9-]+)\\.svg/;
  function url(n) { return reg[n] ? 'url("data:image/svg+xml,' + encodeURIComponent(reg[n]) + '")' : null; }
  // Troca <i data-icon="nome"> pelo SVG e reescreve --icon:url(<link do jsDelivr>) para o ícone já carregado.
  function render(root) {
    root = root || d;
    var els = root.querySelectorAll ? root.querySelectorAll('[data-icon],[style*="--icon"]') : [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i], n = el.getAttribute('data-icon');
      if (n && reg[n] && !el.__czi) {
        el.__czi = 1; el.innerHTML = reg[n];
        var svg = el.firstChild; svg.setAttribute('aria-hidden', 'true');
        svg.style.width = svg.style.height = '1em'; svg.style.verticalAlign = '-0.125em';
        continue;
      }
      var v = el.style.getPropertyValue('--icon'), m = v && v.match(CDN);
      if (m && reg[m[1]]) el.style.setProperty('--icon', url(m[1]));
    }
  }
  var queued = 0;
  function schedule() { if (queued) return; queued = 1; (w.requestAnimationFrame || setTimeout)(function () { queued = 0; render(); }); }
  w.ConvertizeIcons = {
    version: '${pkg.version}',
    add: function (n, svg) { reg[n] = svg; schedule(); },
    get: function (n) { return reg[n] || null; },
    url: url, render: render,
    names: function () { return Object.keys(reg); }
  };
  function start() {
    render();
    if (w.MutationObserver) new MutationObserver(schedule).observe(d.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'data-icon'] });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})(window, document);
`;

const icons = {};
for (const f of fs.readdirSync(SVG).filter(f => f.endsWith('.svg')).sort()) icons[f.slice(0, -4)] = clean(fs.readFileSync(path.join(SVG, f), 'utf8'));
const missing = CORE.filter(n => !icons[n]);
if (missing.length) { console.error('faltam no núcleo:', missing.join(', ')); process.exit(1); }

const add = (n) => 'ConvertizeIcons.add(' + JSON.stringify(n) + ',' + JSON.stringify(icons[n]) + ');';
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'icons'), { recursive: true });
fs.writeFileSync(path.join(DIST, 'loader.js'), LOADER);
fs.writeFileSync(path.join(DIST, 'core.js'), LOADER + CORE.map(add).join('\n') + '\n');
fs.writeFileSync(path.join(DIST, 'all.js'), LOADER + Object.keys(icons).map(add).join('\n') + '\n');
// Cada arquivo traz o carregador (que não se repete se já existir), então funciona sozinho.
for (const n of Object.keys(icons)) fs.writeFileSync(path.join(DIST, 'icons', n + '.js'), LOADER + add(n) + '\n');
const kb = f => Math.round(fs.statSync(path.join(DIST, f)).size / 1024) + ' KB';
console.log(`${Object.keys(icons).length} ícones · core.js ${kb('core.js')} · all.js ${kb('all.js')} · loader.js ${kb('loader.js')}`);
