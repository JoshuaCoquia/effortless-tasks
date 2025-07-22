"use client";

import type { TaskData, TaskList } from "@/app/types";
import { useState, useEffect } from "react";
import AddTaskForm from "@/components/AddTaskForm";
import TaskListView from "@/components/TaskList";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const supabase = createClient();
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
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

  function createNewTaskList() {
    const newList = {
      id: crypto.randomUUID(),
      title: "New List",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (isAutoFocusAllowed === false) setIsAutoFocusAllowed(true);
    setAllTaskLists([
      ...allTaskLists,
      newList,
    ]);
    return newList;
  }

  function handleNewTaskList(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    createNewTaskList();
  }

  function handleTaskButtonClick(taskId: string) {
    setAllTasks(allTasks.map(task => {
      if (task.id === taskId) {
        const updatedTaskCompletion = task.completed ? false : true;
        return {
          ...task,
          completed: updatedTaskCompletion,
          updatedAt: new Date().toISOString(),
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

  function handleListSubmit(listId: string) {
    const list = allTaskLists.find(list => list.id === listId);
    if (list === undefined) return;
    createNewTaskList();
  }

  function handleTaskTextUpdate(taskId: string, e: React.ChangeEvent<HTMLInputElement>) {
    setAllTasks(allTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          title: e.target.value,
          updatedAt: new Date().toISOString(),
        }
      } else { return task; }
    }))
  }

  function handleTaskDelete(taskId: string) {
    supabase.from("tasks").update({ deleted: true }).eq("id", taskId).then(() => { });
    setAllTasks(allTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          deleted: true,
          updatedAt: new Date().toISOString(),
        }
      } else { return task; }
    }));
  }

  function handleTitleUpdate(listId: string, e: React.ChangeEvent<HTMLInputElement>) {
    setAllTaskLists(allTaskLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          title: e.target.value,
          updatedAt: new Date().toISOString(),
        }
      } else { return list; }
    }));
  }

  function handleListDelete(listId: string) {
    supabase.from("lists").update({ deleted: true }).eq("id", listId).then(() => { });
    supabase.from("tasks").update({ deleted: true }).eq("parent_list_id", listId).then(() => { });
    setAllTaskLists(allTaskLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          deleted: true,
          updatedAt: new Date().toISOString(),
        }
      } else { return list; }
    }));
  }

  useEffect(() => {
    const savedLists = JSON.parse(localStorage.getItem("allTaskLists")!);
    if (savedLists == null || savedLists.length <= 0) {
      console.log("No saved task lists found, creating a default one.");
      savedLists.push(createNewTaskList());
    }
    const savedTasks = JSON.parse(localStorage.getItem("allTasks")!);
    syncUserData(savedLists, savedTasks!);
  }, []);

  async function syncUserData(lists: TaskList[] | null, tasks: TaskData[] | null) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const userData = await supabase.from("userInfo").select("*").eq("id", user.id).single();
      if (!userData.data) {
        await supabase.from("userInfo").insert({
          id: user.id,
          email: user.email,
          has_synced_tasks: false
        });
      } else if (userData.data.has_synced_tasks) {
        await supabase.from("lists").upsert(lists!.map((list: TaskList) => ({
          id: list.id,
          title: list.title,
          created_at: list.createdAt,
          updated_at: list.updatedAt,
          user_id: user.id,
          deleted: list.deleted || false,
        })));
        await supabase.from("tasks").upsert(tasks!.map((task: TaskData) => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
          created_at: task.createdAt,
          updated_at: task.updatedAt,
          parent_list_id: task.parentTaskListId,
          user_id: user.id,
          deleted: task.deleted || false,
        })));
        const taskListsPromise = supabase.from("lists").select("*").eq("user_id", user.id);
        const tasksPromise = supabase.from("tasks").select("*").eq("user_id", user.id);
        Promise.all([taskListsPromise, tasksPromise]).then(async ([taskListsData, tasksData]) => {
          const errorArray = [];
          if (taskListsData.error) errorArray.push(taskListsData.error);
          if (tasksData.error) errorArray.push(tasksData.error);
          if (errorArray.length > 0) throw new Error(JSON.stringify(errorArray));
          setAllTaskLists(taskListsData.data?.map((list) => ({
            id: list.id,
            title: list.title,
            createdAt: list.created_at,
            updatedAt: list.updated_at,
            deleted: list.deleted || false,
          })) || []);
          setAllTasks(tasksData.data?.map((task) => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            createdAt: task.created_at,
            updatedAt: task.updated_at,
            parentTaskListId: task.parent_list_id,
            deleted: task.deleted || false,
          })) || []);
        }).catch((error) => {
          console.error("Error fetching user data:", error);
        })
        return;
      }

      if (lists) {
        await supabase.from("lists").insert(
          lists.map((list: TaskList) => ({
            id: list.id,
            title: list.title,
            created_at: list.createdAt,
            updated_at: list.updatedAt,
            user_id: user.id,
          }))
        );
      }
      if (tasks) {
        await supabase.from("tasks").insert(
          tasks.map((task: TaskData) => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            created_at: task.createdAt,
            updated_at: task.updatedAt,
            parent_list_id: task.parentTaskListId,
            user_id: user.id,
          }))
        );
      }
      await supabase.from("userInfo").upsert({
        id: user.id,
        email: user.email,
        has_synced_tasks: true
      });
    } else {
      setAllTaskLists(lists || []);
      setAllTasks(tasks || []);
    }
  }

  useEffect(() => {
    localStorage.setItem("allTaskLists", JSON.stringify(allTaskLists));
    if (allTaskLists.filter((t: TaskList) => t.deleted != true).length > 1) setIsListDeletionAllowed(true);
  }, [allTaskLists]);

  useEffect(() => {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    console.log("Tasks updated:", allTasks);
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
        {allTaskLists.filter(t => t.deleted != true).map((taskList) => (
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
              onListSubmit={handleListSubmit}
            />
          </li>
        ))}
        {allTasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </>
  );
}
