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
      parent_list_id: taskListId,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
          updated_at: new Date().toISOString(),
        }
      } else {
        return task;
      }
    }))
  }

  function handleTaskSubmit(taskId: string) {
    const task = allTasks.find(task => task.id === taskId);
    if (task === undefined) return;
    const list = allTaskLists.find(list => list.id === task.parent_list_id);
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
          updated_at: new Date().toISOString(),
        }
      } else { return task; }
    }))
  }

  function handleTaskDelete(taskId: string) {
    const currentDate = new Date().toISOString();
    supabase.from("tasks").update({ deleted: true, updated_at: currentDate }).eq("id", taskId).then(() => { });
    setAllTasks(allTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          deleted: true,
          updated_at: currentDate,
        }
      } else { return task; }
    }));
  }

  function handleTitleUpdate(listId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const currentDate = new Date().toISOString();
    setAllTaskLists(allTaskLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          title: e.target.value,
          updated_at: currentDate,
        }
      } else { return list; }
    }));
  }

  function handleListDelete(listId: string) {
    const currentDate = new Date().toISOString();
    supabase.from("lists").update({ deleted: true, updated_at: currentDate }).eq("id", listId).then(() => { });
    supabase.from("tasks").update({ deleted: true, updated_at: currentDate }).eq("parent_list_id", listId).then(() => { });
    setAllTaskLists(allTaskLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          deleted: true,
          updated_at: new Date().toISOString(),
        }
      } else { return list; }
    }));
  }

  async function handleTaskBlur(taskId: string, e: React.FocusEvent<HTMLInputElement>) {
    const updatedTask = allTasks.find(task => task.id === taskId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !updatedTask) return;
    await supabase.from("tasks").upsert({
      ...updatedTask,
      user_id: user.id,
    }, { onConflict: "id" });
  }

  async function handleTitleBlur(listId: string, e: React.FocusEvent<HTMLInputElement>) {
    const updatedList = allTaskLists.find(list => list.id === listId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !updatedList) return;
    await supabase.from("lists").upsert({
      ...updatedList,
      user_id: user.id,
    }, { onConflict: "id" });
  }

  useEffect(() => {
    const { lists, tasks } = fetchFromLocalStorage();
    setAllTasks(tasks);
    setAllTaskLists(lists);
    syncUserData(lists, tasks);
    setInterval(() => {
      const { lists: newLists, tasks: newTasks } = fetchFromLocalStorage();
      syncUserData(newLists, newTasks);
    }, 1000 * 60);
  }, []);

  function fetchFromLocalStorage() {
    const savedLists: TaskList[] = JSON.parse(localStorage.getItem("allTaskLists") || "[]");
    const savedTasks: TaskData[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
    if (savedLists.length <= 0) {
      savedLists.push(createNewTaskList());
    }
    setAllTaskLists(savedLists);
    setAllTasks(savedTasks);
    return { lists: savedLists, tasks: savedTasks };
  };

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
        const { data: listsFromDb } = await supabase.from("lists").select("*").eq("user_id", user.id);
        const { data: tasksFromDb } = await supabase.from("tasks").select("*").eq("user_id", user.id);
        await supabase.from("lists").upsert(lists!.filter((list) => ((new Date(listsFromDb?.find((l) => l.id === list.id).updated_at) < new Date(list.updated_at)))).map((list: TaskList) => ({
          ...list,
          user_id: user.id,
        })), { onConflict: "id" });
        await supabase.from("tasks").upsert(tasks!.filter((task) => ((new Date(tasksFromDb?.find((t) => t.id === task.id).updated_at) < new Date(task.updated_at)))).map((task: TaskData) => ({
          ...task,
          user_id: user.id,
        })), { onConflict: "id" });
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
            created_at: list.created_at,
            updated_at: list.updated_at,
            deleted: list.deleted || false,
          })) || []);
          setAllTasks(tasksData.data?.map((task) => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            created_at: task.created_at,
            updated_at: task.updated_at,
            parent_list_id: task.parent_list_id,
            deleted: task.deleted || false,
          })) || []);
        }).catch((error) => {
          console.error("Error fetching user data:", error);
        })
        return;
      }

      if (lists) {
        await supabase.from("lists").insert({
          ...lists,
          user_id: user.id,
        });
      }
      if (tasks) {
        await supabase.from("tasks").insert({
          ...tasks,
          user_id: user.id,
        });
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
              tasks={allTasks.filter((task) => task.parent_list_id === taskList.id)}
              onTaskButtonClick={handleTaskButtonClick}
              onTaskTextUpdate={handleTaskTextUpdate}
              onTaskDelete={handleTaskDelete}
              onTitleUpdate={handleTitleUpdate}
              onListDelete={handleListDelete}
              onTaskSubmit={handleTaskSubmit}
              onListSubmit={handleListSubmit}
              onTaskBlur={handleTaskBlur}
              onTitleBlur={handleTitleBlur}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
