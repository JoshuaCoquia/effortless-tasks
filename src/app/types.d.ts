export type TaskData = {
  id: string;
  title: string;
  completed?: boolean;
  parentTaskListId: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskList = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}