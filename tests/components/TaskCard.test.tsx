import { fireEvent, render, screen } from '@testing-library/react'
import { TaskCard } from '../../src/components/TaskCard'
import { Task } from '../../src/interfaces'
import { AppProvider } from '../../src/context/AppProvider'
import { AppContext, TasksState } from '../../src/context/AppContext'
import { taskListDefault } from '../mock/data'

describe('Test in <TaskCard />', () => {


    const task: Task = {
        id: '789',
        title: 'Hacer test',
        status: 'todo',
        date: new Date().getTime()
    }

    const tasksState: TasksState = {
        taskList: taskListDefault,
        addNewTask: jest.fn(),
        updateTask: jest.fn(),
        changeTaskColor: jest.fn(),
        deleteTask: jest.fn(),
        orderList: jest.fn(),
    }

    test('should be render the component with the title', () => {

        const { container } = render(
            <AppProvider>
                <TaskCard task={task} />
            </AppProvider>
        )

        const taskCard = container.getElementsByClassName('taskCard__title')[0]
        expect(taskCard.textContent).toBe(task.title)
    })

    test('should change to edit mode', () => {

        const labelEdit = 'Editar tarea'
        const labelClose = 'Cerrar edición'

        render(
            <AppContext.Provider value={{ tasksState }}>
                <TaskCard task={task} />
            </AppContext.Provider>
        )
        const btnEdit = screen.getByLabelText(labelEdit)
        fireEvent.click(btnEdit)

        const btnClose = screen.getByLabelText(labelClose)
        expect(btnClose).toBeTruthy()
    })

    test('should update task', () => {

        const labelEdit = 'Editar tarea'
        const labelSave = 'Guardar'
        const titleValue = 'Hola mundo'

        const { container } = render(
            <AppContext.Provider value={{ tasksState }}>
                <TaskCard task={task} />
            </AppContext.Provider>
        )

        const btnEdit = screen.getByLabelText(labelEdit)
        fireEvent.click(btnEdit)

        const input = container.getElementsByClassName('taskCard__title--edit')[0]

        fireEvent.change(input, { target: { value: titleValue } })

        const btnSave = screen.getByLabelText(labelSave)
        fireEvent.click(btnSave)

        expect(tasksState.updateTask).toHaveBeenCalledWith(task.id, { title: titleValue, status: task.status })
    })


    test('should called deleteTask', () => {

        const labelDelete = 'Eliminar tarea'
        const labelConfirm = 'Confirmar'

        render(
            <AppContext.Provider value={{ tasksState }}>
                <TaskCard task={task} />
            </AppContext.Provider>
        )

        const btnDelete = screen.getByLabelText(labelDelete)
        fireEvent.click(btnDelete)

        const btnConfirm = screen.getByLabelText(labelConfirm)

        fireEvent.click(btnConfirm)

        expect(tasksState.deleteTask).toHaveBeenCalledWith(task.id)
    })

})