import React, { useState, useContext, useEffect } from 'react'
import {InputField} from './Forms'
import {DatabaseContext} from './Contexts'
import * as IDB from './IDB'

export function TaskForm({onSubmit}:any): JSX.Element {
  const [task, setTask] = useState({ status: "", content: ""})
  return(<form>
    <InputField label="Status" name="status" value={task.status} onChange={(e:any) => setTask({...task, status: e.target.value})}/>
    <InputField label="Content" name="content" value={task.content} onChange={(e:any) => setTask({...task, content: e.target.value})}/>
    <button type="submit" onClick={(event: React.MouseEvent<HTMLButtonElement>) =>{
      onSubmit(task)
      }}>Submit</button>
  </form>)
}

export function TaskList({objectStore}: any): JSX.Element {
  const db = useContext(DatabaseContext)
  const [tasks, setTasks] = useState<any[]>([])
  useEffect(() => {
    if (db && objectStore) {
      IDB.getAllRecords(db, objectStore)
        .then(setTasks)
        .catch((err) => console.log("Error: ", err))
    }
  }, [db, objectStore])
  if (tasks.length === 0) {
    return (<p>No Tasks</p>)
  }
  return (
    <>
    <h4>ObjectStore: {objectStore}</h4>
    <ul>
      {tasks.map((e) => {
        return (<li key={~~(Math.random()*100000)} >
          {e.status} / {e.content}
        </li>)
      })}
    </ul>
    </>
  )
}