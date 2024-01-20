import { useState } from "react";
import {
    DndContext,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove } from "@dnd-kit/sortable";

import { Task, TaskStatus } from "./interfaces";
import { TaskCard } from "./components/TaskCard";
import { Column } from "./components/Column";
import { useTask } from "./hooks";


const columns: { id: TaskStatus, title: string }[] = [
    {
        id: 'todo',
        title: 'Pendiente 📝',
    },
    {
        id: 'doing',
        title: 'En proceso 🛠️',
    },
    {
        id: 'done',
        title: 'Completado ✅',
    },
]

export const App = () => {

    const { orderList } = useTask()

    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10,
        },
    })
    const sensors = useSensors(pointerSensor)


    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        } else {
            console.log(event)
        }
    }
    const onDragEnd = () => {
        setActiveTask(null);
    }
    const onDragOver = ({ active, over }: DragOverEvent) => {

        if (!over) return;

        if (over?.data.current && over?.data.current.type === 'Task') {

            const activeId = active.id;
            const overId = over.id;

            if (activeId === overId) return;

            orderList(tasks => {

                const activeIndex = tasks.findIndex((task) => task.id === active.id);
                const overIndex = tasks.findIndex((task) => task.id === over.id);

                tasks[activeIndex].status = tasks[overIndex].status
                return arrayMove(tasks, activeIndex, overIndex);
            })
        }
        if (over?.data.current && over?.data.current.type === 'Column') {
            orderList(tasks => {
                const status: TaskStatus = over?.data.current!.id

                const activeIndex = tasks.findIndex((task) => task.id === active.id);
                tasks[activeIndex].status = status
                return arrayMove(tasks, activeIndex, activeIndex);
            })
        }
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            <div className="h-[100vh] font-sans p-4 bg-neutral-950 max-lg:overflow-x-scroll">
                <main className="max-w-[1200px] h-full m-auto grid grid-cols-[repeat(3,_minmax(320px,_1fr))] gap-4">
                    {
                        columns.map(column => {
                            return (
                                <Column
                                    key={column.id}
                                    id={column.id}
                                    titleColumn={column.title}
                                />
                            )
                        })
                    }
                </main>
            </div>
            {
                <DragOverlay>
                    {
                        activeTask && (
                            <TaskCard
                                task={activeTask}
                            />
                        )}
                </DragOverlay>
            }
        </DndContext>

    )
}
