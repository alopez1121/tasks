export interface ObjectStoreSchema {
    objectStore: string
    params: IDBObjectStoreParameters
    indices: Array<ObjectStoreIndex>
}

export interface ObjectStoreIndex {
    index: string
    unique: boolean
}


// createDatabase returns a promise to open a new indexedDB
// its expected use is: createDatabase('name', 1, schemas).then((db) => ... do something with the db)
export function createDatabase(name: string, version: number, schemas: Array<ObjectStoreSchema>): Promise<IDBDatabase> {
    return new Promise(function (resolve, reject) {
        let r = indexedDB.open(name, version)
        r.onsuccess = () => resolve(r.result)
        r.onerror = (event) => reject(event)
        r.onupgradeneeded = () => {
            let db = r.result
            schemas.forEach((schema) => applySchema(db, schema))
            resolve(db)
        }
    })
}

// addRecord stores an `object` into the objectStore of the indexedDB
// this will _NOT_ add any duplicates, for that functionality use
// `putRecord`
export function addRecord(idb: IDBDatabase, objectStore: string, data: any) {
    return new Promise(function (resolve, reject) {
        let tx = idb.transaction(objectStore, "readwrite")
        tx.objectStore(objectStore).add(data)
        tx.onerror = (event) => reject(event)
        tx.oncomplete = (event) => resolve(event)
    })
}

// putRecord stores or updates an `object` into the objectStore
export function putRecord(idb: IDBDatabase, objectStore: string, data: any) {
    return new Promise(function (resolve, reject) {
        let tx = idb.transaction(objectStore, "readwrite")
        tx.objectStore(objectStore).put(data)
        tx.onerror = (event) => reject(event)
        tx.oncomplete = (event) => resolve(event)
    })
}

// erases a record from the indexedDB: assumes data is the key value
export function deleteRecord(idb: IDBDatabase, objectStore: string, data: any) {
    return new Promise(function (resolve, reject) {
        let tx = idb.transaction(objectStore, "readwrite")
        tx.objectStore(objectStore).delete(data)
        tx.onerror = (event) => reject(event)
        tx.oncomplete = (event) => resolve(event)
    })
}

// retrieves a record from an objectStore based on a given key
export function getRecord(idb: IDBDatabase, objectStore: string, key: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        let tx = idb.transaction(objectStore, "readonly")
        let q = tx.objectStore(objectStore).get(key)
        q.onsuccess = (event: any) => {
            resolve(event.target.result)
        }
        q.onerror = (event) => reject(event)
    })
}

// retrieves all records within an objectStore
export function getAllRecords(idb: IDBDatabase, objectStore: string): Promise<Array<any>> {
    return new Promise(function (resolve, reject) {
        if (!idb) {
            reject("idb: handle to the indexedDB is undefined or null.")
        }
        let tx = idb.transaction(objectStore, "readonly")
        let rq = tx.objectStore(objectStore).openCursor(null, 'nextunique')
        let records: Array<any> = []
        rq.onsuccess = (event: any) => {
            let cursor: IDBCursorWithValue | null = event.target.result
            if (cursor) {
                records.push(cursor.value)
                cursor.continue()
            }
        }
        rq.onerror = (event) => reject(event)
        tx.onerror = (event) => reject(event)
        tx.oncomplete = () => resolve(records)
    })
}

// retrieves records from the objectStore if they `queryAccepts` predicate returns true.
export function queryRecords(idb: IDBDatabase, objectStore: string, queryAccepts: (record:any) => boolean ): Promise<Array<any>> {
    return new Promise(function (resolve, reject) {
        let tx = idb.transaction(objectStore, "readonly")
        let rq = tx.objectStore(objectStore).openCursor()
        let records: Array<any> = []
        rq.onsuccess = (event: any) => {
            let cursor: IDBCursorWithValue | null = event.target.result
            if (cursor) {
                const record = cursor.value
                if (queryAccepts(record)) {
                    records.push(cursor.value)
                }
                cursor.continue()
            }
        }
        tx.onerror = (event) => reject(event)
        tx.oncomplete = () => resolve(records)
    })
}

function applySchema(idb: IDBDatabase, schema: ObjectStoreSchema) {
    let store = idb.createObjectStore(schema.objectStore, schema.params)
    for (const elem of schema.indices) {
        store.createIndex(elem.index, elem.index, { unique: elem.unique })
    }
}
