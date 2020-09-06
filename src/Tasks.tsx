import React, { useState, useContext, useEffect } from 'react'
import { InputField } from './Forms'
import { DatabaseContext } from './Contexts'
import * as IDB from './IDB'

export function TaskForm({ onSubmit }: any): JSX.Element {
  const [task, setTask] = useState({ status: "", content: "" })
  return (<form>
    <InputField
      label="Status"
      name="status"
      value={task.status}
      onChange={(e: any) => setTask({ ...task, status: e.target.value })} />

    <InputField
      label="Content"
      name="content"
      value={task.content}
      onChange={(e: any) => setTask({ ...task, content: e.target.value })} />

    <button type="submit" onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
      onSubmit(task)
      setTask({ status: "", content: "" })
      event.preventDefault()
    }}>Submit</button>
  </form>)
}

function TaskListItem({status, content, ...rest}: any): JSX.Element {
  return (
    <li key={~~(Math.random() * 1E9)} className="task">
      <span className="status"><button onClick={() => rest.onPreviousStatus("PREV") }>&laquo;</button>{status}<button onClick={() => rest.onNextStatus("NEXT")}>&raquo;</button></span>
      <span className="content">{content}</span>
      <button>delete</button>
    </li>
  )
}

export function TaskList({ objectStore }: any): JSX.Element {
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

  function setStatus(i: number, status: string) {
    if (i < tasks.length) {
      let newTasks = [...tasks]
      newTasks[i].status = status
      setTasks(newTasks)
    }
  }

  return (
    <>
      <h4>ObjectStore: {objectStore}</h4>
      <ul className="taskList">
        {tasks.map((e, i) => {
          return (<TaskListItem 
            key={~~(Math.random() * 1e9)}
            onPreviousStatus={(status: string) => setStatus(i, status)}
            onNextStatus={(status: string) => setStatus(i, status)}
            {...e} />)
        })}
      </ul>
    </>
  )
}