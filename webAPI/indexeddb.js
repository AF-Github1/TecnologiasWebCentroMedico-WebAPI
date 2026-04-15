import { Formulario } from '../js/formClass.js'

// Example reference https://github.com/mdn/dom-examples/blob/main/indexeddb-api/main.js


const dbName = 'formDatabase';
const dbVersion = 6; // Necessário incrementar este valor caso realiza-se mudanças no código e a base de dados já esteja criada

const request = indexedDB.open(dbName, dbVersion);

const storeTables = {  // Novas tabelas deverão ser chamadas aqui
  'ContactUser': () => new Formulario({}).databaseInputObject
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
    buildIndexes(objectStore, storeTables[storeName]()); // Instância vazia -> [key: "", boolVal]
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
      updateTableContactUser();
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
    const range = IDBKeyRange.bound(searchString, searchString + '\uffff'); // Verifica especificamente pela string indicada
    const cursorRequest = index.openCursor(range);

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
        updateTableContactUser();
      } else {
        callback(results); //Se chegar ao fim das iterações, devolve o que foi obtido
        //!! Informar utilizador aqui
      }
    };
  };
    request.onerror = (err) => console.error("Erro em pesquisa:", err);
}


export function updateValue(storeName, indexName, searchString, newValue) { //!! Reservada para actualizar valor específico em base de dados
  const request = indexedDB.open(dbName, dbVersion);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(storeName, 'readwrite');
    const objectStore = transaction.objectStore(storeName);

    const target = (indexName === 'id') ? objectStore : objectStore.index(indexName);
    const searchValue = (indexName === 'id') ? Number(searchString) : searchString;
    const getRequest = target.get(searchValue);

    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (data) {
        Object.assign(data, newValue);

        const updateRequest = objectStore.put(data);
        updateRequest.onsuccess = () => {
          console.log("Value updated");
          updateTableContactUser();
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
  indices específicos com id, ou com um email ou telefone, devido a nomes poderem repetir-se)

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
        updateTableContactUser();
        };
      } else {
        console.log("Requested value not found");
      }
    };
  };
  request.onerror = (err) => console.error("Error in search:", err);
}


export function updateTableContactUser(storeName = "ContactUser") {
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
                const userData = cursor.value;

                // Create row
                const row = document.createElement('tr'); 

                // Put value in cells
                const nameCell = document.createElement('td'); 
                nameCell.textContent = userData.name;
                row.appendChild(nameCell);
                const emailCell = document.createElement('td');
                emailCell.textContent = userData.email;
                row.appendChild(emailCell);
                const phoneCell = document.createElement('td');
                phoneCell.textContent = userData.phone || '---';
                row.appendChild(phoneCell);

                const actionsCell = document.createElement('td');
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Editar';
                editBtn.className = 'btn-table-edit';
                editBtn.onclick = () => {
                    const newName = prompt('Novo nome:', userData.name);
                    if (newName) window.updateValue(storeName, 'email', userData.email, { name: newName });
                };

                const delBtn = document.createElement('button');
                delBtn.textContent = 'Remover';
                delBtn.className = 'btn-table-del';
                delBtn.onclick = () => window.removeRow(storeName, 'id', userData.id);

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
window.updateTableContactUser = updateTableContactUser;
