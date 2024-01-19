import { useEffect, useState } from "react"
import { v4 as uuid } from 'uuid'

import { Task, TaskStatus } from "../interfaces"
import { AppContext, TasksState } from './AppContext';

interface Props {
    children: JSX.Element
}
const taskListDefault: Task[] = [
    {
        id: uuid(),
        title: "Hacer la compra",
        status: "todo",
        date: new Date().getTime(),
        color: 'taskCard--red'
    },
    {
        id: uuid(),
        title: "Hacer ejercicio :)",
        desc: 'Por 30 minutos',
        status: "todo", date: new Date().getTime(),
        color: 'taskCard--green'
    },
]


const getInitListTask = (): Task[] => {

    const taskList: Task[] = JSON.parse(localStorage.getItem('task-list') || '[]') || taskListDefault

    if (taskList.length > 0) {
        return taskList
    }
    else {
        return taskListDefault
    }

}

export const AppProvider = ({ children }: Props) => {

    const [taskList, setTaskList] = useState(getInitListTask);


    const addNewTask = (title: string, status: TaskStatus) => {

        const newArr = [
            {
                id: uuid(),
                title: title,
                status: status,
                color: 'taskCard--gray',
                date: new Date().getTime()
            },
            ...taskList
        ]
        setTaskList(newArr)
    }

    const updateTask = (id: string, updatedTask: { title: string, desc: string, status: TaskStatus }) => {

        const newArr = taskList.map(task => {
            if (task.id === id) {
                return {
                    ...task,
                    title: updatedTask.title,
                    desc: updatedTask.desc,
                    status: updatedTask.status,
                    date: new Date().getTime()
                }
            }
            return task
        })

        setTaskList(newArr)
    }

    const changeTaskColor = (id: string, color: string) => {
        const newArr = taskList.map(task => {
            if (task.id === id) {
                return {
                    ...task,
                    color,
                }
            }
            return task
        })

        setTaskList(newArr)
    }

    const updateListState = (list: Task[]) => {

        setTaskList(list)
    }

    const deleteTask = (id: string) => {

        const newArr = taskList.filter(task => task.id !== id)

        setTaskList(newArr)

        localStorage.setItem('task-list', JSON.stringify(newArr))
    }

    const tasksState: TasksState = {
        taskList,
        addNewTask,
        updateTask,
        changeTaskColor,
        updateListState,
        deleteTask,
        orderList: setTaskList
    }

    useEffect(() => {
        localStorage.setItem('task-list', JSON.stringify(taskList))
    }, [taskList])

    return (
        <AppContext.Provider value={{ tasksState }}>
            {children}
        </AppContext.Provider>
    )
}
