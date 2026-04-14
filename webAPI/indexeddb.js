// Example reference https://github.com/mdn/dom-examples/blob/main/indexeddb-api/main.js

const dbName = 'formDatabase';
const dbVersion = 3;

const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  let objectStore
  // Create an object store named 'users' with 'id' as the keyPath
  if (!db.objectStoreNames.contains('ContactUser')) { //!! Needs to be replaced with a for loop in order to handle multiple tables 
    objectStore = db.createObjectStore('ContactUser', { keyPath: 'id', autoIncrement: true });
    console.log('DatabaseStore "ContactUser"  created')
  } else {
    objectStore = event.target.transaction.objectStore('ContactUser');
    console.log('DatabaseStore "ContactUser" already exists')
  }

  if (!objectStore.indexNames.contains('email')) {
    objectStore.createIndex('email', 'email', { unique: true });
  }
  if (!objectStore.indexNames.contains('name')) {
    objectStore.createIndex('name', 'name', { unique: false });
  }
  if (!objectStore.indexNames.contains('phone')) {
    objectStore.createIndex('phone', 'phone', { unique: true });
  }


  console.log('Database setup complete');
};

request.onsuccess = function (event) {
  const db = event.target.result;
  console.log('Database opened successfully');
};

request.onerror = function (event) {
  console.error('Error opening database:', event.target.errorCode);
};


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
  Cria a tabela na base de dados de acordo com o nome providenciado e insere a linha com os valores inseridos como parâmetros

  * @param {typeOfUser} string - Contém o nome da nova tabela a criar na base de dados, caso ainda não tenha sido criada
    de forma a criar o efeito animado
  * @param {valueObj} Object - Objecto que contém o nome, email e número de telefone do utilizador, para serem adicionados como atributos na tabela

  */
  const request = indexedDB.open(dbName, dbVersion);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(typeOfUser, 'readwrite');
    const objectStore = transaction.objectStore(typeOfUser);
    const addRequest = objectStore.add(valueObj);

    addRequest.onsuccess = function () {
      console.log('User added:', typeOfUser);
    };

    addRequest.onerror = function (event) {
      console.error('Error adding user:', event.target.errorCode);
    };
  };
  
}
 
export function existsInIndex(storeName, indexName, value, searchString) { // https://itnext.io/searching-in-your-indexeddb-database-d7cbf202a17
  /*
  Esta função verifica a existência de um termo específico //!! De momento devolve o index inteiro
  
  
  */
  
  const request = indexedDB.open(dbName, dbVersion);


  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const index = objectStore.index(indexName);

    const results = [];
    const range = IDBKeyRange.bound(searchString, searchString + '\uffff');
    const cursorRequest = index.openCursor(range);

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        callback(results); //Se não encontrar mais por onde iterar, devolve o que foi obtido até agora
      }
    };
  };
}


export function updateValue(storeName, indexName, oldValue, newValue) { // https://itnext.io/searching-in-your-indexeddb-database-d7cbf202a17
  /*
  Esta função troca um valor específico //!! De momento não lidará bem com nomes devido a encontrar apenas o primeiro
  
  */  
  const request = indexedDB.open(dbName, dbVersion); //!! Esta função pode ser convertida com uma condicional if, para também tratar
                                                    //!! de mudanças e updates do conteúdo

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const index = objectStore.index(indexName);

    const results = [];
    const range = IDBKeyRange.bound(oldValue, oldValue + '\uffff');
    const cursorRequest = index.openCursor(range);

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value.target === oldValue) {
                const invoice = cursor.value; //!! Verificar de como mudar isto  (deverá ser target e value?)
                invoice.target = newValue;
                const updateRequest = cursor.update(newValue);
                //!! Add a break here
      } else {
        cursor.continue();
      }
    };
  };
}


