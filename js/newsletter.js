import { isValidEmail, containsNumbers } from './formValidator.js';
import { handleTransaction } from '../webAPI/indexeddb.js';
export function checkNewsletter(event) {
/*
 
Esta função lida com a validação do nome e email inseridos no formulário de newsletter, e caso sejam validados, adiciona-os à base de dados

*/
  event.preventDefault();

  // Calling validation methods
  const nameVal = document.getElementById('news-name').value;
  const emailVal = document.getElementById('news-email').value;
  const isNameValid = !containsNumbers(nameVal) && nameVal.trim() !== "";
  const isEmailValid = isValidEmail(emailVal);

  if (isNameValid && isEmailValid) {
    const data = {
      name: [nameVal, false],
      email: [emailVal, true]
    };

    handleTransaction("NewsletterUser", data);
    
    alert('A sua subscrição na newsletter foi realizada com sucesso!');
    event.target.reset(); 

  } else if (containsNumbers(nameVal)) {
    alert('O nome não pode conter números');
  } else if (!isValidEmail(emailVal)) {
    alert('E-mail inválido');
  } else {
    alert('É necessário preencher todos os campos');
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newsletter-form');
    if (form) {
        form.addEventListener('submit', checkNewsletter);
    }
});