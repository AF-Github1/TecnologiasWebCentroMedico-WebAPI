import { handleTransaction } from '../webAPI/indexeddb.js';

export function checkEvent(event) {
    /*
    Esta função verificada a validade dos dados inseridos em formulário, metendo-os na base de dados se válidos
    */
    event.preventDefault();

    const titleVal = document.getElementById('title').value;
    const descVal = document.getElementById('description').value;
    const dateVal = document.getElementById('date').value;
    const timeVal = document.getElementById('time').value;
    const localVal = document.getElementById('localization').value;

    if (titleVal && descVal && dateVal && timeVal && localVal) {
        const data = {
            title: [titleVal, true],
            description: [descVal, false],
            date: [dateVal, false],
            time: [timeVal, false],
            localization: [localVal, false]
        };

        handleTransaction("Events", data);
        
        alert(`O evento foi criado com sucesso!`);
        event.target.reset(); 

        if (typeof window.updateTableEvents === "function") {
            window.updateTableEvents();
        }
    } else {
        alert('É necessário preencher todos os campos do evento');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('event-form');
    if (form) {
        form.addEventListener('submit', checkEvent);
    }
});