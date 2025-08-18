document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const patternInput = document.getElementById('patternInput');
    const fileInput = document.getElementById('fileInput');
    const outputCommand = document.getElementById('outputCommand');
    const errorMessage = document.getElementById('errorMessage');

    generateBtn.addEventListener('click', () => {
        let command = 'grep';
        const pattern = patternInput.value.trim();
        const file = fileInput.value.trim();

        if (!pattern) {
            outputCommand.textContent = '';
            errorMessage.textContent = 'Por favor, introduce un patrón de búsqueda.';
            return;
        } else {
            errorMessage.textContent = '';
        }

        const options = [];
        if (document.getElementById('option_i').checked) options.push('-i');
        if (document.getElementById('option_n').checked) options.push('-n');
        if (document.getElementById('option_v').checked) options.push('-v');
        if (document.getElementById('option_w').checked) options.push('-w');
        if (document.getElementById('option_c').checked) options.push('-c');
        if (document.getElementById('option_r').checked) options.push('-r');
        if (document.getElementById('option_E').checked) options.push('-E');
        if (document.getElementById('option_o').checked) options.push('-o');

        if (options.length > 0) {
            command += ' ' + options.join(' ');
        }
        
        command += ` "${pattern}"`;
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
