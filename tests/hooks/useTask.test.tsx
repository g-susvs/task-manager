import { act, renderHook } from "@testing-library/react"
import { useTask } from "../../src/hooks"
import { Task, TaskStatus } from "../../src/interfaces"
import { AppProvider } from "../../src/context/AppProvider"

describe('Test in useTask', () => {

    const newTask: Pick<Task, 'title' | 'status'> = {
        title: 'Nueva tarea',
        status: 'todo'
    };

    test('should return taskList', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <AppProvider>{children}</AppProvider>
        const { result } = renderHook(() => useTask(), { wrapper })
        const { taskList } = result.current

        expect(taskList.length).toBe(2)
    })

    test('should add new task', () => {

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <AppProvider>{children}</AppProvider>
        );

        const { result } = renderHook(() => useTask(), { wrapper });

        act(() => {
            result.current.addNewTask(newTask.title, newTask.status);
        });

        expect(result.current.taskList).toHaveLength(3);
    });

    test('should update task', () => {

        const newTitle = 'Update title'
        const newDesc = 'Update description'
        const newStatus: TaskStatus = 'doing'

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <AppProvider>{children}</AppProvider>
        );

        const { result } = renderHook(() => useTask(), { wrapper });
        const { updateTask } = result.current

        const id = result.current.taskList[0].id

        act(() => {
            updateTask(id, { title: newTitle, desc: newDesc, status: newStatus })
        })

        expect(result.current.taskList[0].title).toBe(newTitle)
        expect(result.current.taskList[0].desc).toBe(newDesc)
        expect(result.current.taskList[0].status).toBe(newStatus)
    });

    test('should change task color', () => {

        const newTaskColor = 'taskCard--pink'

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <AppProvider>{children}</AppProvider>
        );

        const { result } = renderHook(() => useTask(), { wrapper });
        const { changeTaskColor } = result.current

        const id = result.current.taskList[0].id

        act(() => {
            changeTaskColor(id, newTaskColor)
        })

        expect(result.current.taskList[0].color).toBe(newTaskColor)
    });

    test('should delete task', () => {

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <AppProvider>{children}</AppProvider>
        );

        const { result } = renderHook(() => useTask(), { wrapper });
        const { deleteTask } = result.current

        const id = result.current.taskList[0].id

        act(() => {
            deleteTask(id)
        })

        expect(result.current.taskList).toHaveLength(2)
    });
})