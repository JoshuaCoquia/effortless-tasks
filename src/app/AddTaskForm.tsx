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
      <section className="bg-grey-light-background flex m-4 p-1 items-center border-sm rounded-lg">
        <button
          type="submit"
          className="rounded-md m-2"
        >
          <Image src={addCircle} width={24} height={24} alt="Add Task" />
        </button>
        <div className="w-full group pr-2">
          <label htmlFor="newTaskTitle" className="hidden">
            New Task Title
          </label>
          <input
            type="text"
            name="newTaskTitle"
            id="newTaskTitle"
            placeholder="New Task"
            value={taskTitle}
            onChange={onTaskTitleChange}
            className="w-full text-black placeholder-grey outline-0"
            autoFocus
          />
          <div className="block max-w-0 group-hover:max-w-full group-focus-within:max-w-full transition-all duration-400 h-[1px] bg-grey" />
        </div>
      </section>
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
