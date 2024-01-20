import { FormEvent, useMemo, useRef, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

import { TaskStatus } from "../interfaces";
import { useOnClickOutside, useForm, useTask } from "../hooks";
import { TaskCard } from "./TaskCard";

interface Props {
    id: TaskStatus;
    titleColumn: string;
    customClass?: string;
}

export const Column = ({ id, customClass, titleColumn }: Props) => {

    const { addNewTask, taskList: taskListState } = useTask()

    const taskList = taskListState.filter(task => task.status === id)

    const tasksIds = useMemo(() => {
        return taskList.map((task) => task.id);
    }, [taskList]);

    const {
        setNodeRef,
        transition,
        transform
    } = useSortable({
        id,
        data: {
            type: "Column",
            id
        },
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };


    const [activeInput, setActiveInput] = useState(false)
    const modalRef = useRef(null);
    const inputRef = useRef<HTMLInputElement>(null);
    useOnClickOutside(modalRef, () => setActiveInput(false))

    const { title, onInputChange, onResetForm } = useForm({
        title: ''
    })

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (title.trim().length <= 2) return
        setActiveInput(false)
        addNewTask(title, id)
        onResetForm()
    }

    const showInputTask = () => {
        setActiveInput(true)
        setTimeout(() => {
            if (!activeInput && !inputRef.current) return
            inputRef.current!.focus()
        }, 100);
    }

    return (
        <section
            ref={setNodeRef}
            style={style}
            className={"bg-zinc-900 text-white rounded-lg relative " + customClass}>
            <header className="flex justify-between p-3">
                <span className="text-2xl font-bold">{titleColumn}</span>
                <button
                    className="btn btn--header"
                    aria-label="Mostrar modal"
                    onClick={showInputTask}>
                    <IoIosAdd className="w-6 h-6" />
                </button>
                {
                    activeInput && (
                        <div
                            ref={modalRef}
                            className="modal"
                        >
                            <form onSubmit={handleSubmit} className="flex gap-2 justify-center items-center">
                                <input
                                    className="modal__input"
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Ingresa una tarea"
                                    name="title"
                                    value={title}
                                    onChange={onInputChange}
                                />
                                <button
                                    type="submit"
                                    aria-label="Agregar tarea"
                                    className="btn btn--addTask"
                                >Agregar tarea</button>
                            </form>

                        </div>
                    )
                }
            </header>

            <div className="column__tasksDrop custom--scroll">
                <SortableContext items={tasksIds}>
                    {taskList.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                        />
                    ))}
                </SortableContext>
            </div>
        </section>
    )
}
