import { Formulario } from '../js/formClass.js'

// Example reference https://github.com/mdn/dom-examples/blob/main/indexeddb-api/main.js

const dbName = 'formDatabase';
const dbVersion = 10; // Necessário incrementar este valor caso realiza-se mudanças no código e a base de dados já esteja criada

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
        callback(results); //Se chegar ao fim das iterações, devolve o que foi obtido
        //!! Informar utilizador aqui
      }
    };
  };
    request.onerror = (err) => console.error("Erro em pesquisa:", err);
}


export function updateValue(storeName, indexName, searchString, newValue) {

  /* Esta função atualiza o nome numa base de dados  */ //!! Necessário alterar para permitir utilizador escolher
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

  Pesquisa por um valor específico, apagando a primeira linha onde encontrar este valor (//!!apenas suposto utilizar isto para 
  indices específicos com id, ou com um email ou telefone, devido a nomes poderem repetir-se, necessário criar excepção para nome)

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

  Esta função é responsável por manter a tabela que demonstra o que de momento está na base de dados atualizada da parte dos utilizadores que usaram o formulário para criação de
  eventos, permitindo aos utilizador apagar ou editar o conteúdo da base de dados através desta tabela

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

                // Create row
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
                    const newTitle = prompt('Novo título do evento:', eventData.title);
                    if (newTitle) {
                        window.updateValue(storeName, 'id', eventData.id, { title: newTitle });
                    }
                };

                const delBtn = document.createElement('button');
                delBtn.textContent = 'Remover';
                delBtn.className = 'btn-table-del';
                delBtn.onclick = () => window.removeRow(storeName, 'id', eventData.id);

                actionsCell.appendChild(editBtn);
                actionsCell.appendChild(delBtn);
                row.appendChild(actionsCell);

                tbody.appendChild(row);
                cursor.continue();
            }
        };
    };
}
// These allow the user to call the functions through button inputs
window.updateValue = updateValue;
window.removeRow = removeRow;
window.existsInIndex = existsInIndex;
window.handleTransaction = handleTransaction;
window.updateTableEvents = updateTableEvents;

document.addEventListener('DOMContentLoaded', () => {
    updateTableEvents();
});