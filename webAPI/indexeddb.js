import { Formulario } from '../js/formClass.js'
import { searchAddress } from '../js/eventsMap.js';
// Example reference https://github.com/mdn/dom-examples/blob/main/indexeddb-api/main.js

const dbName = 'formDatabase';
const dbVersion = 11; // Necessário incrementar este valor caso realiza-se mudanças no código e a base de dados já esteja criada

const request = indexedDB.open(dbName, dbVersion);

const storeTables = {  // Novas tabelas deverão ser chamadas aqui
  'ContactUser': () => new Formulario({}).databaseInputObject,
  'NewsletterUser': () => ({name: ["", false],  email: ["", true],
  }),
  'Events': () => ({title: ["", true], description: ["", false], date: ["", false], time:["", false], localization:["", false],
  })
};

request.onupgradeneeded = function (event) {
  const db = event.target.result;

  for (const storeName in storeTables) {
    let objectStore;

    if (!db.objectStoreNames.contains(storeName)) {
      objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      console.log(`Table created : "${storeName}" `);
    } else {
      objectStore = event.target.transaction.objectStore(storeName);
    }
    buildIndexes(objectStore, storeTables[storeName]()); //  ->  { key: ["", boolVal] }
  }
};

request.onsuccess = function (event) {
  const db = event.target.result;
  console.log('Database created successfully');
};

request.onerror = function (event) {
  console.error('Error opening database:', event.target.errorCode);
};

function buildIndexes(store, indexConf) {
  /*
  Criação dinâmica de indexes, sendo store a tabela para a qual se está a criar os indexes, e indexList o nome dos indexes específicos
  * @param {store} Object - Objecto store, que define a tabela para a qual se está a criar os indexes
  * @param { indexConf } Object - Objecto que contém o nome, email e número telefonico, e o valor de verdadeiro ou falso, para identificar se o index será único ou não
  */
  for (const [key, values] of Object.entries(indexConf)) {
    const truthyValue = values[1]
    if (!store.indexNames.contains(key)) {
      store.createIndex(key, key, { unique: truthyValue });
    }
  }
}


export function handleTransaction(typeOfUser, valueObj) { 
  /*
  Insere a linha com os valores inseridos como parâmetros, numa tabela específica

  * @param {typeOfUser} string - Contém o nome da tabela a onde adiciona-se os valores
  * @param {valueObj} Object - Objecto que contém os valores a adicionar

  */
  const request = indexedDB.open(dbName, dbVersion);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(typeOfUser, 'readwrite');
    const objectStore = transaction.objectStore(typeOfUser);

    // This section removes truthy values from object
    const strippedList = {}; 
    for (const key in valueObj) {
      strippedList[key] = valueObj[key][0]; 
    }
    const addRequest = objectStore.add(strippedList);

    addRequest.onsuccess = function () {
      console.log('Transaction complete for:', typeOfUser);
    };

    addRequest.onerror = function (event) {
      console.error('Error completing transaction:', event.target.errorCode);
    };
  };
}
 
export function existsInIndex(storeName, indexName, searchString, callback) { // https://itnext.io/searching-in-your-indexeddb-database-d7cbf202a17
  /*

  Esta função verifica a existência de um termo específico
  
  */
  
  const request = indexedDB.open(dbName, dbVersion);


  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const index = objectStore.index(indexName);

    const results = [];
    const range = IDBKeyRange.bound(searchString, searchString + '\uffff'); // Verifica tudo o que contem a string
    const cursorRequest = index.openCursor(range);

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        callback(results); // Equivalente a return, devolve a linha inteira
      }
    };
  };
    request.onerror = (err) => console.error("Erro em pesquisa:", err);
}


export function updateValue(storeName, indexName, searchString, newValue) {

  /* 
  
  Esta função atualiza um valor antigo para um novo valor quando chamada, para uma determinada tabela, num determinado index

  * @param {storeName} string - Define a tabela para a qual se está a buscar o index
  * @param {indexName} string - Nome do index onde se deseja trocar o valor
  * @param {searchString} string - Valor específico que se está a procurar no index para ser trocado
  * @param {newValue} string - O novo valor que irá substituir o valor searchString encontrado no index
  
  */
  const request = indexedDB.open(dbName, dbVersion);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(storeName, 'readwrite');
    const objectStore = transaction.objectStore(storeName);

    const target = (indexName === 'id') ? objectStore : objectStore.index(indexName); // Checks if its id, otherwis check for string name as index (id is not index)
    const searchValue = (indexName === 'id') ? Number(searchString) : searchString; // convert input to int in case of looking for id
    const getRequest = target.get(searchValue);

    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (data) {
        Object.assign(data, newValue);

        const updateRequest = objectStore.put(data);
        updateRequest.onsuccess = () => {
          console.log("Value updated");
          updateTableEvents()
        }
        } else {
          console.log("Requested value not found");
      }
    };
  };
    request.onerror = (err) => console.error("Error while updating value: ", err);
}


export function removeRow(storeName, indexName, searchString) { // https://www.tutorialspoint.com/indexeddb/indexeddb_deleting_data.htm#:~:text=Syntax,database%20which%20are%20not%20required.
  /*

  Pesquisa por um valor específico, apagando a primeira linha onde encontrar este valor

  * @param {storeName} string - Define a tabela para a qual se está a buscar o index
  * @param {indexName} string - Nome do index onde se deseja verificar a existência da searchString
  * @param {searchString} string - Valor específico que se está a procurar no index para identificar a linha a remover

  */
  
  const request = indexedDB.open(dbName, dbVersion);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(storeName, 'readwrite');
    const objectStore = transaction.objectStore(storeName);

    const target = (indexName === 'id') ? objectStore : objectStore.index(indexName);
    const searchValue = (indexName === 'id') ? Number(searchString) : searchString;
    const getRequest = target.getKey(searchValue);

    getRequest.onsuccess = () => {
      const primaryKey = getRequest.result;

      if (primaryKey !== undefined) {
        const deleteRequest = objectStore.delete(primaryKey);

        deleteRequest.onsuccess = () => {
          console.log(`Entry with index ${indexName} = "${searchString}" deleted successfully.`);
        updateTableEvents()
        };
      } else {
        console.log("Requested value not found");
      }
    };
  };
  request.onerror = (err) => console.error("Error in search:", err);
}


export function updateTableEvents(storeName = "Events") {
  /*

  Esta função é responsável por manter a tabela de eventos actualizada com os dados presentes na base de dados, permitindo ver, editar e remover registos

  * @param {storeName} string - Tabela utilizada para mostrar todos os dados existentes no lado do site
  */
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readonly');
        const objectStore = transaction.objectStore(storeName);
        const tbody = document.getElementById('DB-list');
        
        tbody.innerHTML = ""; // Retira linha depois da ação realizada

        objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const eventData = cursor.value;

                const row = document.createElement('tr'); 

                const titleCell = document.createElement('td'); 
                titleCell.textContent = eventData.title;
                row.appendChild(titleCell);

                const dateTimeCell = document.createElement('td');
                dateTimeCell.textContent = `${eventData.date} às ${eventData.time}`; // hora e dia combinados em output
                row.appendChild(dateTimeCell);

                const localCell = document.createElement('td');
                localCell.textContent = eventData.localization;
                row.appendChild(localCell);

                const descCell = document.createElement('td');
                descCell.textContent = eventData.description;
                row.appendChild(descCell);

                const actionsCell = document.createElement('td');
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Editar';
                editBtn.className = 'btn-table-edit';

                editBtn.onclick = () => {

                    const fieldChoice = prompt(
                        `Qual o valor que deseja editar em "${eventData.title}"? (Escolha um número de 1 a 5)\n` +
                        `1: Titulo\n 2: Descrição\n 3: Data\n 4: Hora\n 5: Local`);

                    if (!fieldChoice) return;

                    let dbKey;
                    let currentVal;

                    switch (fieldChoice.toLowerCase()) {
                        case '1': case 'titulo': dbKey = 'title'; currentVal = eventData.title; break;
                        case '2': case 'descricao': dbKey = 'description'; currentVal = eventData.description; break;
                        case '3': case 'data': dbKey = 'date'; currentVal = eventData.date; break;
                        case '4': case 'hora': dbKey = 'time'; currentVal = eventData.time; break;
                        case '5': case 'local': dbKey = 'localization'; currentVal = eventData.localization; break;
                        default: alert("Opção inválida."); return;
                    }

                    const newValue = prompt(`Insira o novo valor para ${dbKey}:`, currentVal);
                    
                    if (newValue && newValue !== currentVal) {
                        const updateData = {};
                        updateData[dbKey] = newValue;
                        window.updateValue(storeName, 'id', eventData.id, updateData);
                    }
                };

                const delBtn = document.createElement('button');
                delBtn.textContent = 'Remover';
                delBtn.className = 'btn-table-del';
                delBtn.onclick = () => window.removeRow(storeName, 'id', eventData.id);

                const viewMapBtn = document.createElement('button');
                viewMapBtn.textContent = 'Ver no mapa';
                viewMapBtn.className = 'btn-table-viewMap';
                viewMapBtn.onclick = () => searchAddress(eventData.localization);

                actionsCell.appendChild(editBtn);
                actionsCell.appendChild(delBtn);
                actionsCell.appendChild(viewMapBtn);
                row.appendChild(actionsCell);

                tbody.appendChild(row);
                cursor.continue();
            }
        };
    };
}
window.updateValue = updateValue;
window.removeRow = removeRow;
window.existsInIndex = existsInIndex;
window.handleTransaction = handleTransaction;
window.updateTableEvents = updateTableEvents;

document.addEventListener('DOMContentLoaded', () => {
    updateTableEvents();
});