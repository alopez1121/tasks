import React from 'react'
import {TaskForm, TaskList} from './Tasks'
import IndexedDB from './IndexedDB'

const App = (): JSX.Element => {
    const TasksObjectStoreSchemas = [{
      objectStore: "tasks",
      params: { keyPath: "id", autoIncrement: true },
      indices: [
        { index: "status", unique: false },
        { index: "content", unique: true },
      ]
    }]
    console.log("<render:App>")
    return (
    <IndexedDB name="taskDB" version={1} objectStoreSchemas={TasksObjectStoreSchemas}>
      <TaskForm />
      <TaskList objectStore="tasks"></TaskList>
    </IndexedDB>
    )
}

export default App
