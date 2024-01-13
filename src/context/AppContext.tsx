import { createContext } from "react";

import { Task, TaskStatus } from "../interfaces";

export interface TasksState {
    taskList: Task[];
    addNewTask: (title: string, status: TaskStatus) => void;
    changeTaskStatus: (status: TaskStatus) => void;
    updateListState: (list: Task[]) => void;
}

export interface AppContextProps {
    tasksState: TasksState;
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps)