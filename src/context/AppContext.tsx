import { createContext } from "react";

import { Task, TaskStatus } from "../interfaces";

export interface TasksState {
    taskList: Task[];
    addNewTask: (title: string, status: TaskStatus) => void;
    updateTask: (id: string, updatedTask: { title: string, desc: string, status: TaskStatus }) => void;
    changeTaskColor: (id: string, color: string) => void;
    deleteTask: (id: string) => void;
    orderList: (value: React.SetStateAction<Task[]>) => void;
}

export interface AppContextProps {
    tasksState: TasksState;
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps)