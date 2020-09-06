import React, { useState, useContext, useEffect } from 'react'
import { InputField } from './Forms'
import { IDBReactContext } from './Contexts'
import { Task, NextStatusType, PreviousStatusType } from "./Interfaces"
import { useTaskStatus } from './Hooks'

/**
 * TaskForm
 * uses IDBReactContext to submit task data to the objectStore
 * @param objectStore: the name of the object store that should receive task data.
 */
export function TaskForm({ objectStore }: any): JSX.Element {
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
      db.addRecord(objectStore, task, () => {
        setTask({ status: "", content: "" })
      })
      event.preventDefault()
    }}>Submit</button>
  </form>)
}

// TODO: create a rand(N) function that returns that ~~(Math.random() * N)
/**
 * TaskListItem
 * @description This meant to be used as a direct child of the TaskList component. It will render one task in a task list.
 * @param id : task.id
 * @param status : task.status
 * @param content : task.content
 * @param props : any other optional props
  */
function TaskListItem({ id, status, content, ...props }: any): JSX.Element {
  const [taskStatus, next, prev] = useTaskStatus(status)
  function onDeleteButtonClick(event: any) {
    if (props.onDelete) {
      props.onDelete({ id, status, content })
    }
    event.preventDefault()
  }
  return (
    <li key={~~(Math.random() * 1E9)} className="task">
      <span className="status">
        <button onClick={() => {
          if (props.onUpdateTask) {
            props.onUpdateTask({ id, status: PreviousStatusType(taskStatus), content })
            prev()
          }
        }}>&laquo;</button>
        {taskStatus}
      <button onClick={() => {
        if (props.onUpdateTask) {
          props.onUpdateTask({ id, status: NextStatusType(taskStatus), content })
          next()
        }
      }}>&raquo;</button>
      </span>
      <span className="content">{content}</span>
      <button onClick={onDeleteButtonClick}>delete</button>
    </li>
  )
}

export function TaskList({ objectStore }: any): JSX.Element {
  const db = useContext(IDBReactContext)
  const [tasks, setTasks] = useState<any[]>([])
  useEffect(() => {
    if (objectStore) {
      db.getAllRecords(objectStore, (all: Array<any>) => setTasks(all))
    }
  }, [db, objectStore, tasks.length])
  console.log("<render:TaskList>")

  // if there are no tasks simply display 'No Tasks'
  if (tasks.length === 0) {
    return (
      <>
        <h4>ObjectStore: {objectStore}</h4>
        <p>No Tasks</p>
      </>
    )
  }

  function renderTaskListItem(task: Task, index: number): JSX.Element {

    return (<TaskListItem
      key={`task-${task.id ?? ~~(Math.random() * 1000)}`}
      onUpdateTask={(task: Task) => {
        db.updateRecord(objectStore, task)
      }}
      onDelete={(deleteThisTask: Task) => {
        db.removeRecord(objectStore, deleteThisTask.id ?? deleteThisTask.content, () => {
          let newTasks = [...tasks]
          newTasks.splice(index, 1)
          console.log(newTasks)
          setTasks(newTasks)
        })
      }}
      {...task} />)
  }
  // otherwise if there are tasks, then render them using the TaskListItem component.
  const taskListItems = tasks.map((e, i) => renderTaskListItem(e, i))

  return (
    <>
      <h4>ObjectStore: {objectStore}</h4>
      <ul className="taskList">
        {taskListItems}
      </ul>
    </>
  )
}