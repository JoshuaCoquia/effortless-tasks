export type TaskData = {
  id: string;
  title: string;
  completed?: boolean;
}

export type TaskList = {
  id: string;
  title: string;
  tasks: TaskData[];
}

export type TaskLists = Array<TaskList>;