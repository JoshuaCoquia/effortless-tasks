"use client";

import React from "react";
import Image from "next/image";
import addCircle from "@/images/add_circle_16dp_090B0D_FILL0_wght400_GRAD0_opsz20.svg";
import type { TaskList } from "./types";

type AddTaskFormProps = {
  taskTitle: string;
  taskLists: TaskList[];
  onTaskTitleChange: React.ChangeEventHandler<HTMLInputElement>;
  onCreateNewTaskList: React.MouseEventHandler<HTMLButtonElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

export default function AddTaskForm({
  taskTitle,
  taskLists,
  onTaskTitleChange,
  onCreateNewTaskList,
  onSubmit,
}: AddTaskFormProps) {
  return (
    <form id="addTaskForm" onSubmit={onSubmit}>
      <button
        type="submit"
        className="bg-blue-300 text-foreground rounded-md p-2 mr-2"
      >
        <Image src={addCircle} width={16} height={16} alt="Add Task" />
      </button>
      <label htmlFor="newTaskTitle" className="hidden">
        New Task Title
      </label>
      <input
        type="text"
        name="newTaskTitle"
        id="newTaskTitle"
        placeholder="New Task Title"
        value={taskTitle}
        onChange={onTaskTitleChange}
        className="border-2 border-gray-300 rounded-md p-2"
        autoFocus
      />
      <label htmlFor="taskListMenu" className="hidden">
        Task List to Select
      </label>
      <br />
      <select name="taskListMenu" id="taskListMenu">
        {taskLists.map((taskList) => (
          <option key={taskList.id} value={taskList.id}>
            {taskList.title}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onCreateNewTaskList}
        className=""
      >
        (Create New Task List)
      </button>
    </form>
  );
}
