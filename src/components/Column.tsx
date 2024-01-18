import { FormEvent, useContext, useMemo, useRef, useState } from "react";
import { IoIosAdd } from "react-icons/io";

import { Task, TaskStatus } from "../interfaces";
import { useForm } from "../hooks/useForm";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { SortableContext } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { AppContext } from "../context/AppContext";

interface Props {
    id: TaskStatus;
    taskList: Task[];
    titleColumn: string;
    customClass?: string;
}

export const Column = ({ id, customClass, titleColumn, taskList }: Props) => {

    const { tasksState } = useContext(AppContext)
    const { addNewTask } = tasksState

    const tasksIds = useMemo(() => {
        return taskList.map((task) => task.id);
    }, [taskList]);

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
        <section className={"bg-zinc-900 text-white rounded-lg relative " + customClass}>
            <header className="flex justify-between p-3">
                <span className="text-2xl font-bold">{titleColumn}</span>
                <button
                    className="btn btn--header"
                    aria-label="agregar tarea"
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
                                    className="btn btn--addTask"
                                >Agregar tarea</button>
                            </form>

                        </div>
                    )
                }
            </header>

            <div className="column__tasksDrop custom--scroll" >
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
