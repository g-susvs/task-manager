import { FormEvent, useContext, useRef, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

import { Task } from "../interfaces";
import { useForm } from "../hooks/useForm";
import { AppContext } from "../context/AppContext";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    task: Task;
}

export const TaskCard = ({ task }: Props) => {

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    //* Context
    const { tasksState } = useContext(AppContext)
    const { updateTask, changeTaskColor, deleteTask } = tasksState

    //* UI
    const [editMode, setEditMode] = useState(false)
    const [activeDeleteTask, setActiveDeleteTask] = useState(false)

    //* Task info
    const { title, desc, status, onInputChange, onTextAreaChange, onSelectChange } = useForm({
        title: task.title,
        desc: task.desc,
        status: task.status
    })

    const handleUpdateTask = () => {
        if (!title && !desc) return
        if (status !== 'todo' && status !== 'doing' && status !== 'done') return
        if (title.trim().length < 2) return
        updateTask(task.id, { title, desc: desc!, status })
        setEditMode(false)
    }

    //* card edit
    const cardRef = useRef(null)
    useOnClickOutside(cardRef, () => {
        if (!editMode) return
        handleUpdateTask()
    })

    //* modal delete
    const modalRef = useRef(null)
    useOnClickOutside(modalRef, () => setActiveDeleteTask(false))

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        handleUpdateTask()
    }

    const selectColor = (color: string) => {
        changeTaskColor(task.id, color)
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`taskCard opacity-40 border-[1px] ${task.color} h-[100px] min-h-[100px]`}
            />
        );
    }

    if (editMode) {
        return (
            <div
                ref={cardRef}
                className={`taskCard relative ${task.color}`}
            >
                <form
                    onSubmit={handleSubmit}
                >
                    <div className="flex justify-between items-start">

                        <input className="taskCard__title--edit" type="" value={title} name="title" onChange={onInputChange} />
                        <button type="button" className="btn--task" aria-label="Cerrar edición" onClick={() => setEditMode(false)}>
                            <IoMdClose className="taskCard__iconButton" />
                        </button>
                        <button type="button" className="btn--task" aria-label="Eliminar tarea" onClick={() => setActiveDeleteTask(true)}>
                            <MdDelete className="taskCard__iconButton" />
                        </button>
                        {
                            activeDeleteTask &&
                            <div ref={modalRef} className="modalDelete">
                                <span className="modalDelete__quest">Estas seguro?</span>
                                <div>
                                    <button type="button" className="btn ml-8 modalDelete__btn--confirm" onClick={() => deleteTask(task.id)} > Sí</button>
                                    <button type="button" className="btn ml-4 modalDelete__btn--cancel" onClick={() => setActiveDeleteTask(false)}>No</button>
                                </div>
                            </div>
                        }

                    </div>
                    <div className="taskCard__body">
                        <textarea className="taskCard__desc--edit custom--scroll" value={desc} name="desc" onChange={onTextAreaChange} rows={2} />
                        <div className="py-2">
                            <select
                                name="status"
                                className="taskCard__select"
                                defaultValue={task.status}
                                onChange={onSelectChange}
                            >
                                <option value="status">Estado</option>
                                <option value="todo">Pendiente</option>
                                <option value="doing">En proceso</option>
                                <option value="done">Hecho</option>
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <button className="btnColor btnColor--red" type="button" onClick={() => selectColor('taskCard--red')}></button>
                            <button className="btnColor btnColor--green" type="button" onClick={() => selectColor('taskCard--green')}></button>
                            <button className="btnColor btnColor--yellow" type="button" onClick={() => selectColor('taskCard--yellow')}></button>
                            <button className="btnColor btnColor--blue" type="button" onClick={() => selectColor('taskCard--blue')}></button>
                            <button className="btnColor btnColor--purple" type="button" onClick={() => selectColor('taskCard--purple')}></button>
                            <button className="btnColor btnColor--pink" type="button" onClick={() => selectColor('taskCard--pink')}></button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400">{new Date(task.date).toLocaleString()}</span>
                        <button className="btn btn--save">Guardar</button>
                    </div>

                </form>
            </div>
        );
    }

    return (
        <div
            {...attributes}
            {...listeners}
            style={style}
            ref={setNodeRef}
            className={`taskCard cursor-grab relative ${task.color}`}
        >

            <div className="flex justify-between items-start w-full">

                <p className="taskCard__title">{title}</p>

                <div className="flex">
                    <button
                        type="button" className="btn--task" aria-label="Editar tarea" onClick={() => setEditMode(true)}>
                        <MdEdit className="taskCard__iconButton" />
                    </button>

                    <button type="button" className="btn--task" aria-label="Eliminar tarea" onClick={() => setActiveDeleteTask(true)}>
                        <MdDelete className="taskCard__iconButton" />
                    </button>
                </div>
                {
                    activeDeleteTask &&
                    <div ref={modalRef} className="modalDelete">
                        <span className="modalDelete__quest">Estas seguro?</span>
                        <div>
                            <button type="button" className="btn ml-8 modalDelete__btn--confirm" onClick={() => deleteTask(task.id)} > Sí</button>
                            <button type="button" className="btn ml-4 modalDelete__btn--cancel" onClick={() => setActiveDeleteTask(false)}>No</button>
                        </div>
                    </div>
                }
            </div>
            <div className="taskCard__body">
                <p className="text-sm text-zinc-300">
                    {task.desc}
                </p>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-zinc-400">{new Date(task.date).toLocaleString()}</span>
            </div>
        </div >
    )
}
