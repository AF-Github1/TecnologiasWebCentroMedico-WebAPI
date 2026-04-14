import { Formulario } from '../js/formClass.js'

// Example reference https://github.com/mdn/dom-examples/blob/main/indexeddb-api/main.js

const dbName = 'formDatabase';
const dbVersion = 3; // Necessário incrementar este valor caso realiza-se mudanças no código e a base de dados já esteja criada

const request = indexedDB.open(dbName, dbVersion);

const storeTables = {  // Novas tabelas deverão ser chamadas aqui
  'ContactUser': () => new Formulario({}),
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

    buildIndexes(objectStore, storeTables[storeName]().databaseInputObject); // Instância vazia -> ["", boolVal]
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
  * @param { indexConf } Object - Objecto que contém o nome, email e nú
  */
  for (const [key, values] of Object.entries(indexConf)) {
    const truthyValue = values[1]
    if (!store.indexNames.contains(key)) {
      store.createIndex(key, key, { unique: truthyValue });
    }
  }
}

function informUser(event, userInfo) {//!!Reserved in order to send return values to user to a specific html element
                                  // probably on screen notification (similar to actual form, without interruption) 
  //!! userInfo poderá não conseguir ser imprimido, formatar texto
  event.preventDefault()
  //!! Utilizar a função de getFromDatabase a nível de verificar (não listar)

  userCheck = false
  if (!userCheck) {
  alert(`Já existe um utilizador com estas credenciais`)
  } else if ({}) {
  alert(`O utilizador ${userInfo} foi eliminado`)
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

  Esta função verifica a existência de um termo específico //!! De momento devolve todos os valores que correspondem
  
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
      } else {
        callback(results); //Se chegar ao fim das iterações, devolve o que foi obtido
      }
    };
  };
    request.onerror = (err) => console.error("Erro em pesquisa:", err);
}


export function updateValue(storeName, indexName, searchString, callback) { //!! Reservada para actualizar valor específico em base de dados

  
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
      } else {
        callback(results); //Se chegar ao fim das iterações, devolve o que foi obtido
      }
    };
  };
    request.onerror = (err) => console.error("Erro em pesquisa:", err);
}


export function removeRow(storeName, indexName, searchString, callback) { //!! Reservada para eliminar linha em base de dados
  /*  
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
      } else {
        callback(results); //Se chegar ao fim das iterações, devolve o que foi obtido
      }
    };
  };
    request.onerror = (err) => console.error("Erro em pesquisa:", err);
}
