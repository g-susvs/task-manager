import { useState } from "react"
import { v4 as uuid } from 'uuid'

import { Task, TaskStatus } from "../interfaces"
import { AppContext, TasksState } from './AppContext';

interface Props {
    children: JSX.Element
}
const taskListDefault: Task[] = [
    { id: uuid(), title: "Hacer la compra", status: "todo" },
    { id: uuid(), title: "Preparar la presentación para el trabajo", status: "todo" },
    { id: uuid(), title: "Hacer ejercicio por 30 minutos", status: "todo" },
]

export const AppProvider = ({ children }: Props) => {

    const [taskList, setTaskList] = useState(taskListDefault);


    const addNewTask = (title: string, status: TaskStatus) => {

        setTaskList(
            [
                {
                    id: uuid(),
                    title: title,
                    status: status,
                },
                ...taskList
            ])
    }

    const changeTaskStatus = (status: TaskStatus) => {
        console.log(status)
    }

    const updateListState = (list: Task[]) => {

        setTaskList(list)
    }

    const tasksState: TasksState = {
        taskList,
        addNewTask,
        changeTaskStatus,
        updateListState
    }


    return (
        <AppContext.Provider value={{ tasksState }}>
            {children}
        </AppContext.Provider>
    )
}
