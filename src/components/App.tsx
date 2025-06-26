"use client";

import type { TaskData, TaskList } from "@/app/types";
import { useState, useEffect } from "react";
import AddTaskForm from "@/components/AddTaskForm";
import TaskListView from "@/components/TaskList";

export default function Home() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [allTaskLists, setAllTaskLists] = useState<TaskList[]>([]);
  const [allTasks, setAllTasks] = useState<TaskData[]>([]);
  const [isListDeletionAllowed, setIsListDeletionAllowed] = useState<boolean>(false);
  const [isAutoFocusAllowed, setIsAutoFocusAllowed] = useState<boolean>(false);

  function createNewTask(title: string, taskListId: string) {
    if (isAutoFocusAllowed === false) setIsAutoFocusAllowed(true);
    const newTask: TaskData = {
      id: crypto.randomUUID(),
      title: title,
      parentTaskListId: taskListId,
    };
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
    if (isAutoFocusAllowed === false) setIsAutoFocusAllowed(true);
    setAllTaskLists([
      ...allTaskLists,
      {
        id: crypto.randomUUID(),
        title: "New List",
      },
    ]);
    if (allTaskLists.length >= 1) { setIsListDeletionAllowed(true); } else { setIsListDeletionAllowed(false); }
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

  function handleTaskSubmit(taskId: string) {
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
    }))
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
    if (allTaskLists.length > 2) { setIsListDeletionAllowed(true); } else { setIsListDeletionAllowed(false); }
  }

  useEffect(() => {
    const savedLists = JSON.parse(localStorage.getItem("allTaskLists")!);
    if (savedLists != null && savedLists.length > 0) {
      setAllTaskLists(savedLists);
      if (savedLists.length > 1) setIsListDeletionAllowed(true);
    } else {
      setTimeout(() => setAllTaskLists([{ id: crypto.randomUUID(), title: "Example List" }]), 0)
    }
    const savedTasks = localStorage.getItem("allTasks");
    if (savedTasks != null && JSON.parse(JSON.stringify(savedTasks)).length > 0) { setAllTasks(JSON.parse(savedTasks)); } else { setAllTaskLists([]) }
  }, []);

  useEffect(() => {
    localStorage.setItem("allTaskLists", JSON.stringify(allTaskLists));
  }, [allTaskLists]);

  useEffect(() => {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
  }, [allTasks]);

  return (
    <>
      <AddTaskForm
        taskTitle={newTaskTitle}
        taskLists={allTaskLists}
        onTaskTitleChange={(e) => {
          setNewTaskTitle(e.target.value);
        }}
        onSubmit={handleSubmit}
        onCreateNewTaskList={handleNewTaskList}
      />
      <ul>
        {allTaskLists.map((taskList) => (
          <li key={taskList.id}>
            <TaskListView
              id={taskList.id}
              isAutoFocusAllowed={isAutoFocusAllowed}
              isListDeletionAllowed={isListDeletionAllowed}
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
    </>
  );
}
