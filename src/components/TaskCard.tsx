import { DragEvent, FormEvent, useContext, useRef, useState } from "react";

import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

import { Task } from "../interfaces";
import { useForm } from "../hooks/useForm";
import { AppContext } from "../context/AppContext";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

interface Props {
    task: Task;
    handleDrangStart: (event: DragEvent<HTMLDivElement>, task: Task) => void
}

export const TaskCard = ({ task, handleDrangStart }: Props) => {

    const { tasksState } = useContext(AppContext)
    const { updateTask, changeTaskColor, deleteTask } = tasksState

    const [editTask, setEditTask] = useState(false)
    const [ActiveDeleteTask, setActiveDeleteTask] = useState(false)

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
        setEditTask(false)
    }

    //* card edit
    const cardRef = useRef(null)
    useOnClickOutside(cardRef, () => {
        if (!editTask) return
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

    return (
        <form onSubmit={handleSubmit} >
            <div
                ref={cardRef}
                className={`taskCard absolute ${task.color}`}
                draggable
                onDragStart={(event) => handleDrangStart(event, task)}
            >

                <div className="flex justify-between items-start">
                    {
                        editTask
                            ? <input className="taskCard__title--edit" type="" value={title} name="title" onChange={onInputChange} />
                            : <span className="text-base w-[80%]">{title}</span>
                    }
                    {
                        editTask
                            ?
                            <button type="button" className="btn--task" aria-label="Editar tarea" onClick={() => setEditTask(!editTask)}>
                                <IoMdClose />
                            </button>
                            : <button type="button" className="btn--task" aria-label="Editar tarea" onClick={() => setEditTask(!editTask)}>
                                <MdEdit />
                            </button>
                    }
                    <button type="button" className="btn--task" aria-label="Eliminar tarea" onClick={() => setActiveDeleteTask(true)}>
                        <MdDelete />
                    </button>
                    {
                        ActiveDeleteTask &&
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
                    {
                        editTask
                            ? <textarea className="taskCard__desc--edit custom--scroll" value={desc} name="desc" onChange={onTextAreaChange} rows={2} />
                            : <p className="text-sm text-zinc-300">
                                {task.desc}
                            </p>
                    }
                </div>
                {
                    editTask &&
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
                }
                {
                    editTask &&
                    <div className="flex gap-4">
                        <button className="btnColor btnColor--red" type="button" onClick={() => selectColor('taskCard--red')}></button>
                        <button className="btnColor btnColor--green" type="button" onClick={() => selectColor('taskCard--green')}></button>
                        <button className="btnColor btnColor--yellow" type="button" onClick={() => selectColor('taskCard--yellow')}></button>
                        <button className="btnColor btnColor--blue" type="button" onClick={() => selectColor('taskCard--blue')}></button>
                        <button className="btnColor btnColor--purple" type="button" onClick={() => selectColor('taskCard--purple')}></button>
                        <button className="btnColor btnColor--pink" type="button" onClick={() => selectColor('taskCard--pink')}></button>
                    </div>
                }
                <div className="flex justify-between items-center">
                    <span className="text-zinc-400">{new Date(task.date).toLocaleString()}</span>
                    {
                        editTask && <button className="btn btn--save">Guardar</button>
                    }
                </div>
            </div>
        </form >
    )
}
