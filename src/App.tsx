import React from 'react'
import * as IDB from './IDB'
import {TaskForm, TaskList} from './Tasks'
import {DatabaseContext} from './Contexts'
import {useIndexedDB} from './Hooks'

const App = (): JSX.Element => {
  const [db, loadState] = useIndexedDB("taskDB", 1, [{
    objectStore: "tasks",
    params: { keyPath: "id", autoIncrement: true },
    indices: [
      { index: "status", unique: false },
      { index: "content", unique: true },
    ]
  }])
  console.log("<render:App>")
  if (db) {
    return (
      <DatabaseContext.Provider value={db}>
        <p>IndexedDB: "{db && db.name}"</p>
        <TaskForm onSubmit={(task: any) => IDB.addRecord(db, "tasks", task)} />
        <TaskList objectStore="tasks"></TaskList>
      </DatabaseContext.Provider>
    )
  } else {
    return <p>{loadState}</p>
  }
}

export default App
