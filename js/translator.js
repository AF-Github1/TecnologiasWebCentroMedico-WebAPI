/**
 * Inicializa o elemento do Google Translate na página.
 * @function googleTranslateElementInit
 * @description Esta função traduz a página para o idioma especificado.
 */
function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            /** @type {string} Código do idioma original do site*/
            pageLanguage: 'pt',
        }, 
        'google_translate_element'
    );
}