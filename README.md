# Grep-it

**Constructor interactivo de comandos `grep`**, de [Un Fantasma en el Sistema](https://www.unfantasmaenelsistema.com).

▶ **Abrir:** https://unfantasmaenelsistema.github.io/Grep-it/

Marca las opciones y ve el comando `grep` montarse en directo, con una chuleta de expresiones regulares y ejemplos listos para copiar. Ideal para quien empieza en Linux, análisis de logs o CTF.

## Qué incluye

- **Comando en directo**, siempre visible, con botón de copiar.
- **Coincidencia:** `-i`, `-w`, `-x`, `-v`.
- **Tipo de patrón:** básico (BRE), extendido `-E`, Perl `-P` o texto literal `-F`.
- **Salida:** `-n`, `-c`, `-o`, `-l`, `-L`, `-H`, `--color=auto`, `-b`.
- **Contexto:** `-A`, `-B`, `-C` (si pones `-C`, tiene prioridad).
- **Recursivo y filtros:** `-r`, `-R`, `-a`, `-s`, `-q`, `--include`, `--exclude`, `-m`.
- **Chuleta de patrones** (clic para usarlos) y **ejemplos** que rellenan todo el formulario (IPv4 en logs, líneas que no son comentarios, TODO/FIXME con contexto…).

El patrón y los nombres de archivo se **entrecomillan de forma segura** para la shell (comillas simples), y si el patrón empieza por `-` se añade `-e` para que `grep` no lo lea como una opción.

## Privacidad

Todo se calcula en tu navegador. No se ejecuta nada: solo se construye el texto del comando para que lo copies a tu terminal. Solo el idioma y el tema se guardan en `localStorage`.

## Estructura

```
index.html   interfaz
script.js     construcción del comando, chuleta, ejemplos, idioma y tema
styles.css    estilos
icono.png     logo de la casa
```

Para probar en local: `python -m http.server` y abre `http://localhost:8000`.

## English

**Grep-it** is an interactive `grep` command builder: tick options and watch the command assemble live, with a regex cheat sheet and ready-made examples. It covers matching, pattern type (BRE/ERE/PCRE/fixed), output, context lines, recursion and `--include`/`--exclude` filters. Patterns and filenames are safely shell-quoted, and a leading `-` in the pattern gets `-e`. Nothing is executed — it only builds the command text for you to copy. Bilingual (ES/EN), light/dark themes, everything in your browser.

## Licencia / License

[MIT](LICENSE) © Un Fantasma en el Sistema.
