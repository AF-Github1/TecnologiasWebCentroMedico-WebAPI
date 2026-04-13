// Example reference https://github.com/mdn/dom-examples/blob/main/indexeddb-api/main.js

const dbName = "formDatabase";
const dbVersion = 2;

const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = function (event) {
  const db = event.target.result;

  // Create an object store named 'users' with 'id' as the keyPath
  if (!db.objectStoreNames.contains("ContactUser")) {
    db.createObjectStore("ContactUser", { keyPath: "id", autoIncrement: true });
    console.log('DatabaseStore "ContactUser" created')
  }
  console.log("Database setup complete");
};

request.onsuccess = function (event) {
  const db = event.target.result;
  console.log("Database opened successfully");
};

request.onerror = function (event) {
  console.error("Error opening database:", event.target.errorCode);
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
    const transaction = db.transaction(typeOfUser, "readwrite");
    const objectStore = transaction.objectStore(typeOfUser);
    const addRequest = objectStore.add(valueObj);

    addRequest.onsuccess = function () {
      console.log("User added:", typeOfUser);
    };

    addRequest.onerror = function (event) {
      console.error("Error adding user:", event.target.errorCode);
    };
  };
  
}
 
function getFromDatabase(typeOfUser) { // Reserved to getting information from database
    const request = indexedDB.open(dbName, dbVersion);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(typeOfUser, "readonly");
    const objectStore = transaction.objectStore(typeOfUser);

    const getRequest = objectStore.get(id);

    getRequest.onsuccess = function () {
      if (getRequest.result) {
        console.log("User found:", getRequest.result); //!! Needs to be set as output in site itself
      } else {
        console.log("User not found"); 
      }
    };

    getRequest.onerror = function (event) {
      console.error("Error retrieving user:", event.target.errorCode);

    };
  };
}