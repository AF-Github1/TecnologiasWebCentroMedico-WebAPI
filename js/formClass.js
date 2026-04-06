export class Formulario {
  /*
   Esta classe representa o formulário de contacto e contém métodos para a validação dos dados inseridos no formulário

   * @param {string} name - Nome do utilizador
   * @param {string} email - Endereço de email a validar
   * @param {string} selectSubject - Assunto selecionado das opções pré definidas
   * @param {string} customSubject - Assunto escrito manualmente por utilizador
   * @param {string} message - Texto da mensagem
   * @param {string} phoneNumber - Número de telefone (opcional)
   */
  constructor(name, email, selectSubject, customSubject, message, phoneNumber) {
    this.name = name
    this.email = email
    this.selectSubject = selectSubject
    this.customSubject = customSubject
    this.message = message
    this.phoneNumber = phoneNumber
  }

  get isPhoneEmpty() {
    /*
    Verifica se o campo de telefone está vazio.
    */
    return this.phoneNumber === ''
  }

  get finalSubject() {
    /*
    Obtem o assunto final, sendo esta a opção pré definida ou texto inserido por um utilizador
    */
    return this.selectSubject === 'outro' ? this.customSubject : this.selectSubject
  }



  validateEmail() {
  /*
  
  Função que verifica se uma determinada string está no formato de xxx@yyy.zzz, em que x poderá assumir qualquer value, y poderá assumir 
  valuees de letras e números, e z poderá assumir apenas valuees de letras, devendo a sequência de z ter 2 ou mais caracteres.
  xxx e yyy deverão ser separados com o simbolo de arroba { @ } | yyy e zzz deverão ser separados por um ponto { . }
  Caso a string do email não esteja num formato válido, a função devolve False

  */
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}$/
  return emailRegex.test(this.email)
  }

  hasNumbers() {
  /*
  Verifica através de regex se uma determinada string contém caracteres que não sejam números inteiros, devolvendo False se a string não os conter
  */
  var regex = /\d/g
  return regex.test(this.name)
  }

  isPhoneValid() {
    /*
    Utiliza-se regex para verificar se o telefone contém apenas dígitos e entre 6 a 15 caracteres
    Sendo o numero de telefone opcional, a falta complete de um número de telefone é considerada válida  
    */
    if (this.phoneNumber !== '') {
    const cleanNumber = this.phoneNumber.replace(/[\s\-().]/g, '')
    return /^\d{6,15}$/.test(cleanNumber)
    }

    return true
  }

  isValid() {
    /*
    Verifica se todas as condições para o formulário ser válido estão preenchidas (email válido, nome sem numeros, mensagem ou assunto não vazios, numero de telefone válido)    
    */
    return (
      this.validateEmail() &&
     !this.hasNumbers() &&
      this.finalSubject !== '' && 
      this.message !== '' &&
      this.isPhoneValid()
    )
  }
}