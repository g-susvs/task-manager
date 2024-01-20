import { useContext } from "react"
import { AppContext } from "../context/AppContext"

export const useTask = () => {

    const { tasksState } = useContext(AppContext)

    const { taskList, addNewTask, updateTask, changeTaskColor, deleteTask, orderList } = tasksState

    return {
        taskList,
        addNewTask,
        updateTask,
        changeTaskColor,
        deleteTask,
        orderList,
    }
}
