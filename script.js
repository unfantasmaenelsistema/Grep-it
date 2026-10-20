/* script.js — Grep-it (Un Fantasma en el Sistema, MIT)
 * Construye un comando grep en directo. Todo en el navegador; solo idioma y tema van a localStorage. */
(function () {
  'use strict';

  // Opciones: [id, flag, es, en]
  var MATCH = [
    ['i', '-i', 'Ignorar mayúsculas/minúsculas', 'Ignore case'],
    ['w', '-w', 'Palabra completa', 'Whole word'],
    ['x', '-x', 'Línea completa', 'Whole line'],
    ['v', '-v', 'Invertir: líneas que NO coinciden', 'Invert: lines that do NOT match']
  ];
  var OUTPUT = [
    ['n', '-n', 'Número de línea', 'Line number'],
    ['c', '-c', 'Contar coincidencias', 'Count matches'],
    ['o', '-o', 'Solo la parte que coincide', 'Only the matching part'],
    ['l', '-l', 'Solo nombres de archivo con coincidencias', 'Only names of files with matches'],
    ['L', '-L', 'Archivos SIN coincidencias', 'Files WITHOUT matches'],
    ['H', '-H', 'Mostrar el nombre del archivo', 'Show the file name'],
    ['color', '--color=auto', 'Resaltar en color', 'Highlight in colour'],
    ['b', '-b', 'Posición en bytes', 'Byte offset']
  ];
  var REC = [
    ['r', '-r', 'Recursivo (sigue enlaces dados)', 'Recursive (follows given links)'],
    ['R', '-R', 'Recursivo siguiendo todos los enlaces', 'Recursive, following all links'],
    ['a', '-a', 'Tratar binarios como texto', 'Treat binary files as text'],
    ['s', '-s', 'Silenciar errores de archivos', 'Suppress file errors'],
    ['q', '-q', 'Silencioso: solo el código de salida', 'Quiet: exit code only']
  ];
  // Tipo de patrón (-E / -F / -P / básico): radios excluyentes
  var MODES = [
    ['basic', '', 'Básico (BRE)', 'Basic (BRE)'],
    ['E', '-E', 'Extendido (ERE): + ? | ( )', 'Extended (ERE): + ? | ( )'],
    ['P', '-P', 'Perl (PCRE): \\d \\w lookahead', 'Perl (PCRE): \\d \\w lookahead'],
    ['F', '-F', 'Texto literal (sin regex)', 'Literal text (no regex)']
  ];
  var CHEAT = [
    ['^error', 'Líneas que empiezan por «error»', 'Lines that start with “error”'],
    ['error$', 'Líneas que terminan en «error»', 'Lines ending in “error”'],
    ['^$', 'Líneas vacías', 'Empty lines'],
    ['[0-9]\\+', 'Uno o más dígitos (BRE)', 'One or more digits (BRE)'],
    ['[a-z]', 'Una letra minúscula', 'A lowercase letter'],
    ['\\<palabra\\>', 'La palabra exacta', 'The exact word'],
    ['.*', 'Cualquier cosa', 'Anything'],
    ['foo\\|bar', 'foo o bar (BRE)', 'foo or bar (BRE)'],
    ['[^#]', 'Cualquier carácter menos #', 'Any character except #'],
    ['\\.', 'Un punto literal', 'A literal dot']
  ];
  // Ejemplos: estado completo del formulario
  var EXAMPLES = [
    { es: 'Errores en un log, sin importar mayúsculas, con nº de línea', en: 'Errors in a log, case-insensitive, with line numbers',
      s: { pattern: 'error', files: 'registro.log', opts: ['i', 'n'] } },
    { es: 'IPv4 en todos los .log de una carpeta', en: 'IPv4 in every .log in a folder',
      s: { pattern: '([0-9]{1,3}\\.){3}[0-9]{1,3}', files: '/var/log', opts: ['r', 'o', 'color'], mode: 'E', include: '*.log' } },
    { es: 'Líneas que NO son comentarios ni están vacías', en: 'Lines that are not comments or blank',
      s: { pattern: '^\\s*($|#)', files: 'config.conf', opts: ['v'], mode: 'E' } },
    { es: 'TODO/FIXME en el código, con 2 líneas de contexto', en: 'TODO/FIXME in code, with 2 lines of context',
      s: { pattern: 'TODO|FIXME', files: '.', opts: ['r', 'n', 'color'], mode: 'E', ctxC: '2', exclude: '*.min.js' } },
    { es: 'Buscar una contraseña volcada en varios archivos', en: 'Find a leaked password across files',
      s: { pattern: 'password', files: '.', opts: ['r', 'i', 'l'] } }
  ];

  var I18N = {
    es: {
      title: 'Constructor de comandos grep',
      lead: 'Monta un comando <code>grep</code> marcando opciones y lo ves montarse en directo. Con chuleta de expresiones regulares y ejemplos listos para copiar.',
      copy: 'Copiar', copied: '¡Copiado!',
      basics: 'Lo básico', patternLbl: 'Patrón de búsqueda', fileLbl: 'Archivo o ruta',
      fileNote: 'Si lo dejas vacío, grep lee de la entrada estándar (útil con tuberías: …| grep …).',
      match: 'Coincidencia', regexMode: 'Tipo de patrón', output: 'Salida', context: 'Contexto',
      ctxBefore: 'Antes (-B)', ctxAfter: 'Después (-A)', ctxBoth: 'Ambos (-C)',
      recursive: 'Recursivo y filtros', includeLbl: 'Solo archivos (--include)', excludeLbl: 'Excluir archivos (--exclude)', maxLbl: 'Máximo de coincidencias (-m)',
      cheatTitle: 'Chuleta de patrones', cheatNote: 'Pulsa uno para ponerlo como patrón. Algunos usan sintaxis básica (BRE); con el tipo «Extendido» se escriben sin las barras.',
      exTitle: 'Ejemplos listos', emptyCmd: 'Escribe un patrón para empezar…',
      fLocal: 'Todo funciona en tu navegador', themeTitle: 'Cambiar tema', langTitle: 'English'
    },
    en: {
      title: 'grep command builder',
      lead: 'Build a <code>grep</code> command by ticking options and watch it assemble live. With a regular-expression cheat sheet and ready-to-copy examples.',
      copy: 'Copy', copied: 'Copied!',
      basics: 'Basics', patternLbl: 'Search pattern', fileLbl: 'File or path',
      fileNote: 'Leave it empty and grep reads from standard input (handy with pipes: …| grep …).',
      match: 'Matching', regexMode: 'Pattern type', output: 'Output', context: 'Context',
      ctxBefore: 'Before (-B)', ctxAfter: 'After (-A)', ctxBoth: 'Both (-C)',
      recursive: 'Recursive and filters', includeLbl: 'Only files (--include)', excludeLbl: 'Exclude files (--exclude)', maxLbl: 'Max matches (-m)',
      cheatTitle: 'Pattern cheat sheet', cheatNote: 'Click one to use it as the pattern. Some use basic syntax (BRE); with the “Extended” type they are written without the backslashes.',
      exTitle: 'Ready-made examples', emptyCmd: 'Type a pattern to start…',
      fLocal: 'Everything runs in your browser', themeTitle: 'Toggle theme', langTitle: 'Español'
    }
  };

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var lang = store('grepit-lang') || ((navigator.language || 'es').slice(0, 2) === 'es' ? 'es' : 'en');
  if (!I18N[lang]) lang = 'es';
  function t(k) { var s = I18N[lang][k]; return s === undefined ? I18N.es[k] : s; }
  function $(id) { return document.getElementById(id); }

  // Entrecomillado seguro para shell POSIX: comillas simples, y '\'' para una comilla interna.
  function shq(s) {
    if (s === '') return "''";
    if (/^[A-Za-z0-9_@%+=:,.\/-]+$/.test(s)) return s;
    return "'" + s.replace(/'/g, "'\\''") + "'";
  }

  function checkbox(def, group) {
    return '<label class="opt"><input type="checkbox" data-group="' + group + '" id="o_' + def[0] + '"><span><code>' + def[1] + '</code> <span data-opt="' + def[0] + '"></span></span></label>';
  }
  $('matchOpts').innerHTML = MATCH.map(function (d) { return checkbox(d, 'match'); }).join('');
  $('outputOpts').innerHTML = OUTPUT.map(function (d) { return checkbox(d, 'output'); }).join('');
  $('recOpts').innerHTML = REC.map(function (d) { return checkbox(d, 'rec'); }).join('');
  $('regexMode').innerHTML = MODES.map(function (d, i) {
    return '<label class="radio"><input type="radio" name="mode" value="' + d[0] + '"' + (i === 0 ? ' checked' : '') + '><span>' + (d[1] ? '<code>' + d[1] + '</code> ' : '') + '<span data-mode="' + d[0] + '"></span></span></label>';
  }).join('');

  function build() {
    var parts = ['grep'];
    var flags = [];
    [MATCH, OUTPUT, REC].forEach(function (list) {
      list.forEach(function (d) { if ($('o_' + d[0]).checked) flags.push(d[1]); });
    });
    var mode = document.querySelector('input[name=mode]:checked').value;
    var modeFlag = MODES.filter(function (m) { return m[0] === mode; })[0][1];
    if (modeFlag) flags.push(modeFlag);
    // Contexto
    var b = $('ctxB').value, a = $('ctxA').value, c = $('ctxC').value;
    if (c) flags.push('-C ' + (+c)); else { if (b) flags.push('-B ' + (+b)); if (a) flags.push('-A ' + (+a)); }
    var mx = $('maxCount').value; if (mx) flags.push('-m ' + (+mx));
    var inc = $('include').value.trim(); if (inc) flags.push('--include=' + shq(inc));
    var exc = $('exclude').value.trim(); if (exc) flags.push('--exclude=' + shq(exc));
    if (flags.length) parts.push(flags.join(' '));

    var pattern = $('pattern').value;
    // -e ante patrones que empiezan por - para que no se lean como opción
    if (pattern) { parts.push((pattern[0] === '-' ? '-e ' : '') + shq(pattern)); }
    var files = $('files').value.trim();
    if (files) parts.push(files.split(/\s+/).map(shq).join(' '));

    var cmdEl = $('cmd');
    if (!pattern) { cmdEl.innerHTML = '<span class="ph">' + t('emptyCmd') + '</span>'; $('copyBtn').disabled = true; return; }
    cmdEl.textContent = parts.join(' ');
    $('copyBtn').disabled = false;
  }

  document.addEventListener('input', function (e) { if (e.target.closest('main')) build(); });
  document.addEventListener('change', function (e) { if (e.target.closest('main')) build(); });

  $('copyBtn').addEventListener('click', function () {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText($('cmd').textContent).then(function () {
      var b = $('copyBtn'); b.textContent = t('copied'); setTimeout(function () { b.textContent = t('copy'); }, 1500);
    });
  });

  function applyExample(s) {
    document.querySelectorAll('.opts input[type=checkbox]').forEach(function (c) { c.checked = false; });
    (s.opts || []).forEach(function (o) { var c = $('o_' + o); if (c) c.checked = true; });
    $('pattern').value = s.pattern || '';
    $('files').value = s.files || '';
    $('include').value = s.include || '';
    $('exclude').value = s.exclude || '';
    $('maxCount').value = s.max || '';
    $('ctxB').value = s.ctxB || ''; $('ctxA').value = s.ctxA || ''; $('ctxC').value = s.ctxC || '';
    document.querySelector('input[name=mode][value=' + (s.mode || 'basic') + ']').checked = true;
    build();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderDynamic() {
    $('cheat').innerHTML = CHEAT.map(function (c, i) {
      return '<button class="chip" data-cheat="' + i + '" title="' + (lang === 'es' ? c[1] : c[2]).replace(/"/g, '&quot;') + '"><code>' + c[0].replace(/</g, '&lt;') + '</code><small>' + (lang === 'es' ? c[1] : c[2]) + '</small></button>';
    }).join('');
    $('examples').innerHTML = EXAMPLES.map(function (ex, i) {
      return '<button class="example" data-ex="' + i + '">' + (lang === 'es' ? ex.es : ex.en) + '</button>';
    }).join('');
  }
  $('cheat').addEventListener('click', function (e) {
    var b = e.target.closest('[data-cheat]'); if (!b) return;
    $('pattern').value = CHEAT[+b.dataset.cheat][0]; build();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('examples').addEventListener('click', function (e) {
    var b = e.target.closest('[data-ex]'); if (b) applyExample(EXAMPLES[+b.dataset.ex].s);
  });

  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    // lead lleva <code>
    document.querySelector('[data-i18n="lead"]').innerHTML = t('lead');
    MATCH.concat(OUTPUT, REC).forEach(function (d) {
      var el = document.querySelector('[data-opt="' + d[0] + '"]'); if (el) el.textContent = lang === 'es' ? d[2] : d[3];
    });
    MODES.forEach(function (d) { var el = document.querySelector('[data-mode="' + d[0] + '"]'); if (el) el.textContent = lang === 'es' ? d[2] : d[3]; });
    $('langToggle').textContent = lang === 'es' ? 'EN' : 'ES'; $('langToggle').title = t('langTitle');
    $('themeToggle').title = t('themeTitle');
    renderDynamic(); build();
  }
  function syncTheme() { $('themeToggle').textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '☾'; }
  $('langToggle').addEventListener('click', function () { lang = lang === 'es' ? 'en' : 'es'; store('grepit-lang', lang); applyI18n(); });
  $('themeToggle').addEventListener('click', function () {
    var n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', n); store('grepit-theme', n); syncTheme();
  });

  syncTheme(); applyI18n();
})();
