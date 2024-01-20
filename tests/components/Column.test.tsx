import { Column } from "../../src/components/Column"
import { AppContext, TasksState } from "../../src/context/AppContext"
import { TaskStatus } from "../../src/interfaces"
import { taskListDefault } from "../mock/data"
import { fireEvent, render, screen } from '@testing-library/react';

describe('test <Column />', () => {

    const column: { id: TaskStatus, title: string } = {
        id: 'todo',
        title: 'Pendiente'
    }

    const tasksState: TasksState = {
        taskList: taskListDefault,
        addNewTask: jest.fn(),
        updateTask: jest.fn(),
        changeTaskColor: jest.fn(),
        updateListState: jest.fn(),
        deleteTask: jest.fn(),
        orderList: jest.fn(),
    }

    test('should render', () => {

        render(
            <AppContext.Provider value={{ tasksState }}>
                <Column id={column.id} titleColumn={column.title} />
            </AppContext.Provider>
        )

        expect(screen.getByText(column.title)).toBeTruthy()
    })

    test('should called addNewTask', () => {
        const taskTitle = 'Hola mundo'

        const { container } = render(
            <AppContext.Provider value={{ tasksState }}>
                <Column id={column.id} titleColumn={column.title} />
            </AppContext.Provider>
        )
        const btnShowModal = screen.getByLabelText('Mostrar modal')
        fireEvent.click(btnShowModal)

        const input = container.getElementsByClassName('modal__input')[0]
        fireEvent.change(input, { target: { value: taskTitle } })

        const btnAdd = screen.getByLabelText('Agregar tarea')
        fireEvent.click(btnAdd)

        expect(tasksState.addNewTask).toHaveBeenCalledWith(taskTitle, column.id)
    })

    test('should have tasks with status equal to column-id', () => {

        const tasks = taskListDefault.filter(task => task.status === column.id)

        const { container } = render(
            <AppContext.Provider value={{ tasksState }}>
                <Column id={column.id} titleColumn={column.title} />
            </AppContext.Provider>
        )

        const taskList = container.getElementsByClassName('column__tasksDrop')[0]

        expect(taskList.children.length).toBe(tasks.length)
    })

})