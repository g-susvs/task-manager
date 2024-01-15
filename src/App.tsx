import { DragEvent, useContext } from "react";

import { Task, TaskStatus } from "./interfaces";
import { AppContext } from "./context/AppContext";
import { TaskCard } from "./components/TaskCard";
import { Column } from "./components/Column";


const columns: { id: TaskStatus, title: string }[] = [
    {
        id: 'todo',
        title: 'Pendientes 📝',
    },
    {
        id: 'doing',
        title: 'En proceso 🛠️',
    },
    {
        id: 'done',
        title: 'Hecho ✅',
    },
]

export const App = () => {

    const { tasksState } = useContext(AppContext)

    const { taskList, updateListState } = tasksState



    const handleDrangStart = (event: DragEvent<HTMLDivElement>, task: Task) => {
        event.dataTransfer.setData('taskId', task.id)
    }

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
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

        updateListState(newState)
    }


    return (
        <div className="h-[100vh] font-sans p-4 bg-neutral-950">
            <main className="max-w-[980px] h-full m-auto grid grid-cols-[repeat(3,_minmax(300px,_1fr))] gap-4">
                {
                    columns.map(column => {
                        return (
                            <Column
                                key={column.id}
                                id={column.id}
                                titleColumn={column.title}
                                handleDragOver={handleDragOver}
                                handleDrop={handleDrop}
                            >
                                <>
                                    {
                                        taskList.map(task => {
                                            if (task.status === column.id) {
                                                return (
                                                    <TaskCard
                                                        key={task.id}
                                                        task={task}
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
        </div>
    )
}
