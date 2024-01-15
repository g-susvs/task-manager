import { DragEvent, FormEvent, useContext, useRef, useState } from "react";
import { IoIosAdd } from "react-icons/io";

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

            <div className="column__tasksDrop custom--scroll" onDragOver={handleDragOver} onDrop={(event) => handleDrop(event, id)}>
                {
                    children
                }
            </div>
        </section>
    )
}
