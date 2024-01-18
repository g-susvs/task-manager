import { useContext, useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

import { Task, TaskStatus } from "./interfaces";
import { AppContext } from "./context/AppContext";
import { TaskCard } from "./components/TaskCard";
import { Column } from "./components/Column";
import { createPortal } from "react-dom";


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

    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    )

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }

    }
    function onDragEnd(event: DragEndEvent) {
        console.log(event.over?.id)
        setActiveTask(null);

    }
    function onDragOver({ active, over }: DragOverEvent) {

        if (!over) return;
        const taskActive = active.data.current!.task


        const taskOver = over.data.current!.task
        console.log({ active, over })

        const updatedTask = { ...taskActive }

        updatedTask.status = taskOver.status

        const newState = taskList.map(task => {
            if (task.id == updatedTask.id) return updatedTask

            return task
        })


        updateListState(newState)
    }
    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            <div className="h-[100vh] font-sans p-4 bg-neutral-950 max-md:overflow-x-scroll">
                <main className="max-w-[980px] h-full m-auto grid grid-cols-[repeat(3,_minmax(300px,_1fr))] gap-4">
                    {
                        columns.map(column => {
                            return (
                                <Column
                                    key={column.id}
                                    id={column.id}
                                    taskList={taskList.filter(task => task.status === column.id)}
                                    titleColumn={column.title}
                                />
                            )
                        })
                    }
                </main>
            </div>
            {
                createPortal(
                    <DragOverlay>
                        {activeTask && (
                            <TaskCard
                                task={activeTask}
                            />
                        )}
                    </DragOverlay>,
                    document.body
                )
            }
        </DndContext>

    )
}
