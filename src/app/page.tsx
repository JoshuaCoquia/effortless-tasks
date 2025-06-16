"use client";

import type { TaskData, TaskList } from "./types";
import { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import TaskListView from "./TaskList";

export default function Home() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [currentTaskNumber, setCurrentTaskNumber] = useState(1);
  const [currentTaskListNumber, setCurrentTaskListNumber] = useState(1);
  const [allTaskLists, setAllTaskLists] = useState<TaskList[]>([
    {
      id: "list_0",
      title: "Default",
    },
  ]);
  const [allTasks, setAllTasks] = useState<TaskData[] | undefined>([
    {
      id: "task_0",
      title: "Example Task",
      parentTaskListId: "list_0",
    },
  ]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskTitle = formData.get("newTaskTitle") as string;
    const taskListID = formData.get("taskListMenu") as string;
    const taskList = allTaskLists.find(
      (taskList) => taskList.id === taskListID
    );
    if (taskList) {
      const newTask: TaskData = {
        id: "task_".concat(currentTaskNumber.toString()),
        title: taskTitle,
        parentTaskListId: taskListID,
      };
      setCurrentTaskNumber(currentTaskNumber + 1);
      setAllTasks([...allTasks, newTask]);
      setNewTaskTitle("");
    }
  }

  function handleNewTaskList(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const newTaskListName = prompt("Enter new task list name:");
    if (newTaskListName) {
      setAllTaskLists([
        ...allTaskLists,
        {
          id: "list_".concat(currentTaskListNumber.toString()),
          title: newTaskListName,
        },
      ]);
      setCurrentTaskListNumber(currentTaskListNumber + 1);
    }
  }

  function handleTaskButtonClick(taskId: string) {
    setAllTasks(allTasks.map(task => {
      if (task.id === taskId) {
        const updatedTaskCompletion = task.completed ? false : true;
        return {
          ...task,
          completed: updatedTaskCompletion,
        }
      } else {
        return task;
      }
    }))
  }

  function handleTaskTextUpdate(taskId: string, e: React.ChangeEvent<HTMLInputElement>) {
    setAllTasks(allTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          title: e.target.value,
        }
      } else {
        return task;
      }
    }))
  }

  function handleTaskDelete(taskId: string) {
    setAllTasks(allTasks?.filter(task => task.id !== taskId));
  }

  return (
    <main>
      <h1 className="hidden">Effortless Tasks</h1>
      {/* Add task form */}
      <AddTaskForm
        taskTitle={newTaskTitle}
        taskLists={allTaskLists}
        onTaskTitleChange={(e) => {
          setNewTaskTitle(e.target.value);
        }}
        onSubmit={handleSubmit}
        onCreateNewTaskList={handleNewTaskList}
      />
      {/* Task list */}
      <ul>
        {allTaskLists.map((taskList) => (
          <li key={taskList.id}>
            <TaskListView
              title={taskList.title}
              tasks={allTasks.filter((task) => task.parentTaskListId === taskList.id)}
              onTaskButtonClick={handleTaskButtonClick}
              onTaskTextUpdate={handleTaskTextUpdate}
              onTaskDelete={handleTaskDelete}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
