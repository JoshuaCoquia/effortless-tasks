"use client";

import type { TaskLists } from "./types";
import { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import TaskList from "./TaskList";

export default function Home() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [currentTaskNumber, setCurrentTaskNumber] = useState(1);
  const [currentTaskListNumber, setCurrentTaskListNumber] = useState(1);
  const [allTaskLists, setAllTaskLists] = useState<TaskLists>([
    {
      id: "list_0",
      title: "Default",
      tasks: [{ id: "task_0", title: "Example Task" }],
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
      const newTask = {
        id: "task_".concat(currentTaskNumber.toString()),
        title: taskTitle,
      };
      taskList.tasks.push(newTask);
      setCurrentTaskNumber(currentTaskNumber + 1);
    }
    setNewTaskTitle("");
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
          tasks: [],
        },
      ]);
      setCurrentTaskListNumber(currentTaskListNumber + 1);
    }
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
      {/* Dropdown menu to select task list */}
      {/* Task list */}
      <ul>
        {allTaskLists.map((taskList) => (
          <li key={taskList.id}>
            <TaskList
              title={taskList.title}
              tasks={taskList.tasks}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
