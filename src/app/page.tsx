'use client';

import { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import TaskList from "./TaskList";


export default function Home() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [taskLists, setTaskLists] = useState<TaskLists>({});
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

  }

  return (
    <main>
      <h1 className="hidden">Effortless Tasks</h1>
      {/* Add task form */}
      <AddTaskForm taskTitle={newTaskTitle} taskLists={[]} onTaskTitleChange={(e) => {setNewTaskTitle(e.target.value)}} onSubmit={handleSubmit} />
      {/* Dropdown menu to select task list */}
      {/* Task list */}
      <TaskList tasks={[]} />
    </main>
  );
}
