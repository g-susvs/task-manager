

export interface Task {
    id: string;
    title: string;
    desc?: string;
    status: TaskStatus;
}

export type TaskStatus = 'todo' | 'doing' | 'done'