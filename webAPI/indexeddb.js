// Example reference https://github.com/mdn/dom-examples/blob/main/indexeddb-api/main.js


//!! Need to check if this autoruns
const dbName = "formDatabase";
const dbVersion = 1;

const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = function (event) {
  const db = event.target.result;

  // Create an object store named 'users' with 'id' as the keyPath
  if (!db.objectStoreNames.contains("users")) {
    db.createObjectStore("Utilizador", { keyPath: "id" });
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


function informUser(htmlElement) {//!!Reserved in order to send return values to user to a specific html element
                                  // probably on screen notification (similar to actual form, without interruption) 

}

export function handleTransaction(typeOfUser, sourceList) { // Reserved for getting information from form
  /*
  Creates a table named typeOfUser, values in the table being sourced from sourceList
  
  */
  const request = indexedDB.open(dbName, dbVersion);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(typeOfUser, "readwrite");
    const objectStore = transaction.objectStore(typeOfUser);

    sourceList.forEach((element) => objectStore.add(element)); // Iterate through each element and add to database

    addRequest.onsuccess = function () {
      console.log("User added:", user);
    };

    addRequest.onerror = function (event) {
      console.error("Error adding user:", event.target.errorCode);
    };
  };
  
} // Call example addUser(1, "John Doe", "john.doe@example.com");
 
function setToDatabase() { // Reserved to getting information from database
    const request = indexedDB.open(dbName, dbVersion);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("users", "readonly");
    const objectStore = transaction.objectStore("users");

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
      //!! Error log can show on inspect, but here, needs to also send message about being impossible
      // to complete operation to client on site (as in database get, not in failure to find user)
    };
  };
}