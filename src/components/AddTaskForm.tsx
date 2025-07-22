"use client";

import React from "react";
import Image from "next/image";
import addCircle from "@/images/add_circle_16dp_090B0D_FILL0_wght400_GRAD0_opsz20.svg";
import type { TaskList } from "@/app/types";

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
    <form id="addTaskForm" className="m-4 flex flex-col gap-2" onSubmit={onSubmit} autoFocus>
      <section className="bg-grey-light-background flex p-1 items-center border-sm rounded-lg">
        <button
          type="submit"
          className="rounded-md m-2 cursor-pointer"
        >
          <Image src={addCircle} width={24} height={24} alt="Add Task" className="pointer-events-none" />
        </button>
        <div className="w-full group pr-2">
          <input
            type="text"
            name="newTaskTitle"
            id="newTaskTitle"
            placeholder="New Task"
            value={taskTitle}
            onChange={onTaskTitleChange}
            className="w-full text-black placeholder-grey outline-0 transition-all duration-150"
            autoFocus
            autoComplete="off"
            aria-label="New task field"
          />
          <div className="block max-w-0 group-hover:max-w-full group-focus-within:max-w-full transition-all duration-150 h-[1px] bg-grey" />
        </div>
      </section>
      <select name="taskListMenu" id="taskListMenu" className="bg-transparent p-2 border-0 border-b-2 border-grey-light hover:border-grey focus:border-grey active:border-grey outline-0 text-black" aria-label="Select list to add new tasks to">
        {taskLists.filter(t => t.deleted != true).map((taskList) => (
          <option key={taskList.id} value={taskList.id} className="">
            {taskList.title}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onCreateNewTaskList}
        className="w-fit hover:bg-grey-light-background focus:bg-grey-light-background p-2 border-2 border-grey-light rounded-lg transition-colors duration-150 outline-0 cursor-pointer"
        aria-label="Create new list"
      >
        Create New List
      </button>
    </form>
  );
}
