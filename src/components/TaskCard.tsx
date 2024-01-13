import { DragEvent } from "react";

import { Task } from "../interfaces";

interface Props {
    task: Task;
    activeDragOver: boolean;
    taskSelected: string | null;
    handleDrangStart: (event: DragEvent<HTMLDivElement>, task: Task) => void
}

export const TaskCard = ({ task, activeDragOver, taskSelected, handleDrangStart }: Props) => {

    return (
        <div

            className={`taskCard ${(activeDragOver && task.id === taskSelected) ? 'taskCard--dragOver' : ''}`}
            draggable
            onDragStart={(event) => handleDrangStart(event, task)}
        >
            <h3 className="taskCard_title">{task.title}</h3>
            <p className="taskCard_desc">
                {task.desc}
            </p>
        </div>
    )
}
