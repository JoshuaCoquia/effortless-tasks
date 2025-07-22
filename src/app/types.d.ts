export type TaskData = {
  id: string;
  title: string;
  completed?: boolean;
  deleted?: boolean;
  parentTaskListId: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskList = {
  id: string;
  title: string;
  deleted?: boolean;
  createdAt: string;
  updatedAt: string;
}