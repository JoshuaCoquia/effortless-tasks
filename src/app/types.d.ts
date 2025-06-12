export type TaskData = {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskList = {
  title: string;
  tasks: TaskData[];
}

export type TaskListNames = Array<string>;

export type TaskLists = {
  [key: string]: TaskList;
}