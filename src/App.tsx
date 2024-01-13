import { DragEvent, useContext, useState } from "react";

import { Task, TaskStatus } from "./interfaces";
import { AppContext } from "./context/AppContext";
import { TaskCard } from "./components/TaskCard";
import { Column } from "./components/Column";


const columsId: TaskStatus[] = ['todo', 'doing', 'done']

export const App = () => {

    const { tasksState } = useContext(AppContext)

    const { taskList, updateListState } = tasksState

    const [activeDragOver, setActiveDragOver] = useState(false)
    const [taskSelected, setTaskSelected] = useState<string | null>(null)


    const handleDrangStart = (event: DragEvent<HTMLDivElement>, task: Task) => {
        event.dataTransfer.setData('taskId', task.id)
        setTaskSelected(task.id)
    }

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setActiveDragOver(true)

    }

    const handleDrop = (event: DragEvent<HTMLDivElement>, status: TaskStatus) => {
        const taskId = event.dataTransfer.getData('taskId')
        const taskFind = taskList.find(task => task.id == taskId)

        if (!taskFind) return
        taskFind.status = status

        const newState = taskList.map(task => {
            if (task.id == taskFind.id) return taskFind

            return task
        })
        setActiveDragOver(false)

        updateListState(newState)

    }


    return (
        <main className="wrapper">
            {
                columsId.map(columId => {
                    return (
                        <Column
                            key={columId}
                            id={columId}
                            titleColumn={columId}
                            handleDragOver={handleDragOver}
                            handleDrop={handleDrop}
                        >
                            <>
                                {
                                    taskList.map(task => {
                                        if (task.status === columId) {
                                            return (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    activeDragOver={activeDragOver}
                                                    taskSelected={taskSelected}
                                                    handleDrangStart={handleDrangStart}

                                                />
                                            )
                                        }
                                    })
                                }
                            </>
                        </Column>
                    )
                })
            }
        </main>
    )
}
