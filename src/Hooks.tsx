import {useEffect, useState} from 'react'
import * as IDB from './IDB'

/**
 * useIndexedDB
 * custom React.Hook
 * @param name the name of the indexedDB
 * @param version the version of the indexedDB, new ones trigger onupgradeneeded
 * @param schemas the layout description of the data to store in the indexedDB
 * @returns [IDBDatabase, string] which is the handle to the indexedDB and the loading state
 */
export function useIndexedDB(name: string, version: number, schemas: Array<IDB.ObjectStoreSchema>): [IDBDatabase | null, string] {
  const [loadState, setLoadState] = useState("Loading Database...")
  const [db, setDB] = useState<IDBDatabase | null>(null)
  useEffect(() => {
    if (db === null) {
      IDB.createDatabase(name, version, schemas).then(
        (h: IDBDatabase) => setDB(h)
      ).catch(
        () => setLoadState("Failed to load indexedDB.")
      )
    }
    return () => {
      if (db !== null)
        db.close()
    }
  }, [db, name, version, schemas])
  return [db, loadState]
}
