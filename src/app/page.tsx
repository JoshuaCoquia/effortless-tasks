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
  const [allTasks, setAllTasks] = useState<TaskData[]>([
    {
      id: "task_0",
      title: "Example Task",
      parentTaskListId: "list_0",
    },
  ]);

  function createNewTask(title: string, taskListId: string) {
      const newTask: TaskData = {
        id: "task_".concat(currentTaskNumber.toString()),
        title: title,
        parentTaskListId: taskListId,
      };
      setCurrentTaskNumber(currentTaskNumber + 1);
      setAllTasks([...allTasks, newTask]);
      setNewTaskTitle("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskTitle = formData.get("newTaskTitle") as string;
    const taskListID = formData.get("taskListMenu") as string;
    const taskList = allTaskLists.find(
      (taskList) => taskList.id === taskListID
    );
    if (taskList) createNewTask(taskTitle, taskList.id);
  }

  function handleNewTaskList(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
      setAllTaskLists([
        ...allTaskLists,
        {
          id: "list_".concat(currentTaskListNumber.toString()),
          title: "New List",
        },
      ]);
      setCurrentTaskListNumber(currentTaskListNumber + 1);
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

  function handleTaskSubmit(taskId: string, e: React.KeyboardEvent<HTMLInputElement>) {
    const task = allTasks.find(task => task.id === taskId);
    if (task === undefined) return;
    const list = allTaskLists.find(list => list.id === task.parentTaskListId);
    if (list) createNewTask("", list.id);
  }

  function handleTaskTextUpdate(taskId: string, e: React.ChangeEvent<HTMLInputElement>) {
    setAllTasks(allTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          title: e.target.value,
        }
      } else { return task; }
    }));
  }

  function handleTaskDelete(taskId: string) {
    setAllTasks(allTasks.filter(task => task.id !== taskId));
  }

  function handleTitleUpdate(listId: string, e: React.ChangeEvent<HTMLInputElement>) {
    setAllTaskLists(allTaskLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          title: e.target.value,
        }
      } else { return list; }
    }));
  }

  function handleListDelete(listId: string) {
    setAllTaskLists(allTaskLists.filter(list => list.id !== listId));
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
              id={taskList.id}
              title={taskList.title}
              tasks={allTasks.filter((task) => task.parentTaskListId === taskList.id)}
              onTaskButtonClick={handleTaskButtonClick}
              onTaskTextUpdate={handleTaskTextUpdate}
              onTaskDelete={handleTaskDelete}
              onTitleUpdate={handleTitleUpdate}
              onListDelete={handleListDelete}
              onTaskSubmit={handleTaskSubmit}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
