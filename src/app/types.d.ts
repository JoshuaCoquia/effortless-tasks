export type TaskData = {
  id: string;
  title: string;
  completed?: boolean;
  parentTaskListId: string;
}

export type TaskList = {
  id: string;
  title: string;
}