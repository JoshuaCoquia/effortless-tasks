export type TaskData = {
  id: string;
  title: string;
  completed?: boolean;
  deleted?: boolean;
  parent_list_id: string;
  created_at: string;
  updated_at: string;
}

export type TaskList = {
  id: string;
  title: string;
  deleted?: boolean;
  created_at: string;
  updated_at: string;
}