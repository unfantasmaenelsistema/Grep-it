document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const patternInput = document.getElementById('patternInput');
    const fileInput = document.getElementById('fileInput');
    const outputCommand = document.getElementById('outputCommand');

    generateBtn.addEventListener('click', () => {
        let command = 'grep';
        const pattern = patternInput.value.trim();
        const file = fileInput.value.trim();

        // Obtener las opciones seleccionadas
        const options = [];
        if (document.getElementById('option_i').checked) options.push('-i');
        if (document.getElementById('option_n').checked) options.push('-n');
        if (document.getElementById('option_v').checked) options.push('-v');
        if (document.getElementById('option_w').checked) options.push('-w');
        if (document.getElementById('option_c').checked) options.push('-c');
        if (document.getElementById('option_r').checked) options.push('-r');

        // Construir el comando con las opciones
        if (options.length > 0) {
            command += ' ' + options.join(' ');
        }
        
        // Añadir el patrón y el archivo, si existen
        if (pattern) {
            command += ` "${pattern}"`;
        }
        if (file) {
            command += ` ${file}`;
        }

        outputCommand.textContent = command;
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = outputCommand.textContent;
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('Comando copiado al portapapeles!');
            }).catch(err => {
                console.error('Error al copiar el texto: ', err);
            });
        }
    });
});