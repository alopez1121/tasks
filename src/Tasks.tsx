import React, { useState, useContext, useEffect } from 'react'
import { InputField } from './Forms'
import { IDBReactContext } from './Contexts'
import { Task } from "./Interfaces"

export function TaskForm({ onSubmit, notify, ...props }: any): JSX.Element {
  const db = useContext(IDBReactContext)
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
      db.addRecord("tasks", task, () => {
        setTask({ status: "", content: "" })
      })
      event.preventDefault()
    }}>Submit</button>
  </form>)
}

function TaskListItem({ id, status, content, ...rest }: any): JSX.Element {
  function onDeleteButtonClick(event: any) {
    if (rest.onDelete) {
      rest.onDelete({ id, status, content })
    }
    event.preventDefault()
  }
  return (
    <li key={~~(Math.random() * 1E9)} className="task">
      <span className="status"><button onClick={() => rest.onPreviousStatus("PREV")}>&laquo;</button>{status}<button onClick={() => rest.onNextStatus("NEXT")}>&raquo;</button></span>
      <span className="content">{content}</span>
      <button onClick={onDeleteButtonClick}>delete</button>
    </li>
  )
}

export function TaskList({ objectStore, ...props }: any): JSX.Element {
  const db = useContext(IDBReactContext)
  const [tasks, setTasks] = useState<any[]>([])
  useEffect(() => {
    if (objectStore) {
      db.getAllRecords(objectStore, (all: Array<any>) => setTasks(all))
    }
  }, [db, objectStore, tasks.length])

  if (tasks.length === 0) {
    return (
      <>
        <h4>ObjectStore: {objectStore}</h4>
        <p>No Tasks</p>
      </>
    )
  }
  console.log("<render:TaskList>")
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
            key={`task-${e.id ?? ~~(Math.random() * 1000)}`}
            onPreviousStatus={(status: string) => setStatus(i, status)}
            onNextStatus={(status: string) => setStatus(i, status)}
            onDelete={(deleteThisTask: Task) => {
              db.removeRecord("tasks", deleteThisTask.id ?? deleteThisTask.content, () => {
                let newTasks = [...tasks]
                newTasks.splice(i, 1)
                console.log(newTasks)
                setTasks(newTasks)
              })
            }}
            {...e} />)
        })}
      </ul>
    </>
  )
}