import { DragEvent, FormEvent, useContext, useRef, useState } from "react";

import { AppContext } from "../context/AppContext";
import { TaskStatus } from "../interfaces";
import { useForm } from "../hooks/useForm";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

interface Props {
    id: TaskStatus;
    titleColumn: string;
    customClass?: string;
    children: JSX.Element;
    handleDragOver: (event: DragEvent<HTMLDivElement>) => void;
    handleDrop: (event: DragEvent<HTMLDivElement>, status: TaskStatus) => void;

}

export const Column = ({ children, id, customClass, titleColumn, handleDragOver, handleDrop }: Props) => {

    const { tasksState } = useContext(AppContext)
    const { addNewTask } = tasksState

    const [activeInput, setActiveInput] = useState(false)
    const modalRef = useRef(null);
    const inputRef = useRef<HTMLInputElement>(null);
    useOnClickOutside(modalRef, () => setActiveInput(false))

    const { title, onInputChange, onResetForm } = useForm({
        title: ''
    })

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

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
        <section className={"column " + customClass}>
            <header className="column__header">
                <span className="column__title">{titleColumn}</span>
                <button className="column__button" onClick={showInputTask}>Nueva tarea</button>
                {
                    activeInput && (
                        <div
                            ref={modalRef}
                            className="modalAddTask"
                        >
                            <form onSubmit={handleSubmit}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Ingresa task"
                                    name="title"
                                    value={title}
                                    onChange={onInputChange}
                                />
                                <button type="submit">Agregar tarea</button>
                            </form>

                        </div>
                    )
                }
            </header>

            <div className="tasks" onDragOver={handleDragOver} onDrop={(event) => handleDrop(event, id)}>
                {
                    children
                }
            </div>
        </section>
    )
}
