import { Formulario } from './formClass.js'

export function fillMessage () {
 
 /*
 Preenche a mensagem e o assunto com texto pré-definido consoante a opção selecionada.
 Se o utilizador escolher "Outro assunto...", mostra o campo de texto livre para o assunto.
 A mensagem continua editável após ser preenchida automaticamente.
 */
 const predefinedMessages = {
 'Informações sobre oportunidades': 'Olá,\n\nGostaria de obter mais informações sobre as oportunidades disponíveis no Centro Académico Clínico dos Açores.\n\nCom cumprimentos,\n',
 'Candidatura a bolsa de investigação': 'Olá,\n\nVenho por este meio manifestar o meu interesse em candidatar-me a uma bolsa de investigação no âmbito do CACA.\nFico a aguardar mais informações sobre o processo de candidatura.\n\nCom cumprimentos,',
 'Parceria institucional': 'Olá,\n\nRepresento a instituição _______ com interesse em estabelecer uma parceria com o Centro Académico Clínico dos Açores.\nGostaria de agendar uma reunião para discutir as possibilidades de colaboração!\n\nCom cumprimentos,',
 'Pedido de informação geral': 'Olá,\n\nGostaria de obter informações gerais sobre o Centro Académico Clínico dos Açores, nomeadamente sobre as suas áreas de atuação e projetos em curso.\n\nCom cumprimentos,'
 }

 const select = document.getElementById('subject')
 const customInput = document.getElementById('subject-custom')
 const messageArea = document.getElementById('message')
 const value = select.value

 if (value === 'outro') {                // Se o utilizador escolher "Outro Assunto"
   customInput.style.display = 'block'   // Mostra o campo de texto que estava "escondido"
   customInput.value = ''
   messageArea.value = ''
   messageArea.placeholder = 'Mensagem*'
 } 
 else {
   customInput.style.display = 'none'    // esconde o campo de texto mencionado acima
   customInput.value = ''
   if (predefinedMessages[value]) {
     messageArea.value = predefinedMessages[value]
   }
   else {
     messageArea.value = ''
     messageArea.placeholder = 'Mensagem*'
   }
 }
}



export function checkForm () {
  /*

  Esta função informa o utilizador sobre o sucesso ou a falha na submissão do formulário, usando a classe Formulario e os métodos associados para validar a validade da informação
  inserida pelo utilizador.

  */
  const formInformation = new Formulario(document.getElementById('name').value, document.getElementById('email').value,
                                        document.getElementById('subject').value, document.getElementById('subject-custom').value,
                                        document.getElementById('message').value, document.getElementById('phone-number').value)

  if (formInformation.isValid()) {
    alert(`${formInformation.name}, o seu formulário foi enviado com sucesso`)
  } else if (!formInformation.isPhoneValid()) {
    alert('Número de telefone inválido. Insira apenas dígitos (6 a 15 números).')
  } else {
    alert('Formulário não enviado, confirme as informações submetidas! \nTodos os campos são obrigatórios')
  }
}



document.addEventListener('DOMContentLoaded', () => {

const subjectSelect = document.getElementById('subject')
const formElement = document.getElementById('contacto-form')

subjectSelect.addEventListener('change', fillMessage)
formElement.addEventListener('submit', (event) => {
    checkForm()
  })

})
