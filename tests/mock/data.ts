import { Task } from "../../src/interfaces";

export const taskListDefault: Task[] = [
    {
        id: '123',
        title: "Hacer la compra",
        status: "todo",
        date: new Date().getTime(),
        color: 'taskCard--red'
    },
    {
        id: '456',
        title: "Hacer ejercicio :)",
        desc: 'Por 30 minutos',
        status: "doing", date: new Date().getTime(),
        color: 'taskCard--green'
    },
]