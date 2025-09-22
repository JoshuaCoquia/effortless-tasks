"use client";

import type { TaskData, TaskList } from "@/app/types";
import { useState, useEffect, useMemo, useRef } from "react";
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
  const lastPolledRef = useRef<Date>(new Date(0));
  const tasksRef = useRef<TaskData[]>([]);
  const listsRef = useRef<TaskList[]>([]);

  // https://www.joshwcomeau.com/snippets/javascript/debounce/
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const debounce = (callback: (...args: any) => void, wait: number) => {
    let timeoutId: number; 
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (...args: any) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback(...args);
      }, wait);
    };
  }

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
        const updatedTaskCompletion = !task.completed;
        return {
          ...task,
          completed: updatedTaskCompletion,
          updated_at: new Date().toISOString(),
        }
      } else {
        return task;
      }
    }))
    syncTaskCompletion(taskId);
  }

  const syncTaskCompletion = useMemo(() => debounce((taskId: string) => {
    supabase.from("tasks").update({ completed: allTasks.find(task => task.id === taskId)?.completed }).eq("id", taskId).then(() => {
    });
  }, 350), [ /* eslint-disable-line react-hooks/exhaustive-deps */ ])


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

  async function handleTaskBlur(taskId: string) {
    const updatedTask = allTasks.find(task => task.id === taskId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !updatedTask) return;
    await supabase.from("tasks").upsert({
      ...updatedTask,
      user_id: user.id,
    }, { onConflict: "id" });
  }

  async function handleTitleBlur(listId: string) {
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
    syncUserData();

    setInterval(() => {
      syncUserData();
    }, 1000 * 60 * 1.5);

    const onReconnect = () => {
      syncUserData();
    }

    const visibilityChangeHandler = () => {
      if (document.visibilityState === "visible") syncUserData(); 
    }

    document.addEventListener("visibilitychange", visibilityChangeHandler);
    window.addEventListener("online", onReconnect);
    return () => {
      document.removeEventListener("visibilitychange", visibilityChangeHandler);
      window.removeEventListener("online", onReconnect);
    }
  }, [ /* eslint-disable-line react-hooks/exhaustive-deps */ ]);

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

  async function syncUserData() {
    const pollTime = new Date();
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
        const taskListsPromise = supabase.from("lists").select().eq("user_id", user.id).gt("updated_at", lastPolledRef.current.toISOString());
        const tasksPromise = supabase.from("tasks").select().eq("user_id", user.id).gt("updated_at", lastPolledRef.current.toISOString());
        Promise.all([taskListsPromise, tasksPromise]).then(async ([taskListsData, tasksData]) => {
          const errorArray = [];
          if (taskListsData.error) errorArray.push(taskListsData.error);
          if (tasksData.error) errorArray.push(tasksData.error);
          if (errorArray.length > 0) throw new Error(JSON.stringify(errorArray));

          const lists = listsRef.current;
          const tasks = tasksRef.current;

          const mergedLists = new Map<string, TaskList>();
          lists?.forEach(list => { mergedLists.set(list.id, list); });
          taskListsData.data?.forEach(l => {
            if (!mergedLists.has(l.id) || (l.updated_at > mergedLists.get(l.id)!.updated_at)) mergedLists.set(l.id, l);
          });
          setAllTaskLists(Array.from(mergedLists.values()));

          const mergedTasks = new Map<string, TaskData>();
          tasks?.forEach(task => { mergedTasks.set(task.id, task); });
          tasksData.data?.forEach(t => {
            if (!mergedTasks.has(t.id) || (t.updated_at > mergedTasks.get(t.id)!.updated_at)) mergedTasks.set(t.id, t);
          });
          setAllTasks(Array.from(mergedTasks.values()));

          lastPolledRef.current = pollTime;

        }).catch((error) => {
          const { lists, tasks } = fetchFromLocalStorage();
          console.error("Error fetching user data:", error);
          setAllTaskLists(lists || []);
          setAllTasks(tasks || []);
        })
        return;
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
    listsRef.current = allTaskLists;
    if (allTaskLists.filter((t: TaskList) => t.deleted != true).length > 1) setIsListDeletionAllowed(true);
  }, [allTaskLists]);

  useEffect(() => {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    tasksRef.current = allTasks;
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
