

export interface Task {
    id: string;
    title: string;
    desc?: string;
    status: TaskStatus;
    color?: string;
    date: number
}

export type TaskStatus = 'todo' | 'doing' | 'done'