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

  function handleNewTaskList(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (isAutoFocusAllowed === false) setIsAutoFocusAllowed(true);
    setAllTaskLists([
      ...allTaskLists,
      {
        id: crypto.randomUUID(),
        title: "New List",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
    setAllTasks(allTasks.filter(task => task.id !== taskId));
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
    setAllTaskLists(allTaskLists.filter(list => list.id !== listId));
    if (allTaskLists.length > 2) { setIsListDeletionAllowed(true); } else { setIsListDeletionAllowed(false); }
  }

  useEffect(() => {
    const savedLists = JSON.parse(localStorage.getItem("allTaskLists")!);
    if (savedLists != null && savedLists.length > 0) {
      setAllTaskLists(savedLists);
      if (savedLists.length > 1) setIsListDeletionAllowed(true);
    } else {
      setTimeout(() => setAllTaskLists([{
        id: crypto.randomUUID(),
        title: "Example List",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }]), 0)
    }
    const savedTasks = JSON.parse(JSON.stringify(localStorage.getItem("allTasks")!));
    if (savedTasks != null && savedTasks.length > 0) {
      setAllTasks(JSON.parse(savedTasks));
    } else { setAllTaskLists([]) }
    syncUserData(savedLists, JSON.parse(savedTasks!));
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
        const taskListsPromise = supabase.from("lists").select("*").eq("user_id", user.id);
        const tasksPromise = supabase.from("tasks").select("*").eq("user_id", user.id);
        Promise.all([taskListsPromise, tasksPromise]).then(async ([taskListsData, tasksData]) => {
          let errorArray = [];
          if (taskListsData.error) errorArray.push(taskListsData.error);
          if (tasksData.error) errorArray.push(tasksData.error);
          if (errorArray.length > 0) throw new Error(JSON.stringify(errorArray));
          await supabase.from("lists").upsert(
            lists!.filter(list => {
              const serverList = taskListsData!.data!.find((l: TaskList) => l.id === list.id);
              if (serverList === undefined) return true;
              return (new Date(serverList.updated_at) < new Date(list.updatedAt));
            }).map((list: TaskList) => ({
              id: list.id,
              title: list.title,
              created_at: list.createdAt,
              updated_at: list.updatedAt,
              user_id: user.id,
            })));

          await supabase.from("tasks").upsert(
            tasks!.filter((task: TaskData) => {
              const serverTask = tasksData!.data!.find((t: TaskData) => t.id === task.id);
              if (serverTask === undefined) return true;
              return (new Date(serverTask.updated_at) < new Date(task.updatedAt));
            }).map((task: TaskData) => ({
              id: task.id,
              title: task.title,
              completed: task.completed,
              created_at: task.createdAt,
              updated_at: task.updatedAt,
              parent_list_id: task.parentTaskListId,
              user_id: user.id,
            })));

          const updatedLists = lists!.map(list => {
            const serverList = taskListsData!.data!.find((l: TaskList) => l.id === list.id);
            if (serverList === undefined) return list;
            if (new Date(serverList.updated_at) < new Date(list.updatedAt)) return list;
            return {
              id: serverList.id,
              title: serverList.title,
              createdAt: serverList.created_at,
              updatedAt: serverList.updated_at,
            };
          });
          updatedLists.push(...taskListsData!.data!.filter((l) => !lists?.map((list) => list.id).includes(l.id)));
          setAllTaskLists(updatedLists);

          const updatedTasks = tasks!.map(task => {
            const serverTask = tasksData!.data!.find((t: TaskData) => t.id === task.id);
            if (serverTask === undefined) return task;
            if (new Date(serverTask.updated_at) < new Date(task.updatedAt)) return task;
            return {
              id: serverTask.id,
              title: serverTask.title,
              completed: serverTask.completed,
              createdAt: serverTask.created_at,
              updatedAt: serverTask.updated_at,
              parentTaskListId: serverTask.parent_list_id,
            };
          })
          updatedTasks.push(...tasksData!.data!.filter((t) => !tasks?.map((task) => task.id).includes(t.id)));
          setAllTasks(updatedTasks);
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
    }
  }

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
