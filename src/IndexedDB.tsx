import React, {useState} from 'react'
import {useIndexedDB} from './Hooks'
import {IDBReactContext} from './Contexts'
import * as IDB from './IDB'

const IndexedDB = ({name, version, objectStoreSchemas, ...props}: any): JSX.Element => {
  const [db, loadState] = useIndexedDB(name, version, objectStoreSchemas)
  const [idbChange, setIDBChanged] = useState(0)
  console.log("<render:IndexedDB>")
  // API
  if (db) {
    const addRecord = (objectStore: string, record: any, callback: () => void) => {
      IDB.addRecord(db, objectStore, record)
        .then(callback)
        .then(() => setIDBChanged(idbChange + 1)
      )
    }
    const removeRecord = (objectStore: string, record: any, callback: () => void) => {
      IDB.deleteRecord(db, objectStore, record)
        .then(callback)
        .then(() => setIDBChanged(idbChange + 1)
        )
    }
    const updateRecord = (objectStore: string, record: any) => {
      setIDBChanged(idbChange + 1)
    }
    const getAllRecords = (objectStore: string, callback: (results: Array<any>)=> void) => {
      IDB.getAllRecords(db, objectStore).then(callback)
    }
    return (
      <IDBReactContext.Provider value={{addRecord, removeRecord, updateRecord, getAllRecords}}>
        {props.children}
      </IDBReactContext.Provider>
    )
  } else {
    return <p>{loadState}</p>
  }
}

export default IndexedDB
