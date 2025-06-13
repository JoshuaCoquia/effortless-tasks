import type { TaskData } from "./types";

type TaskListProps = {
  title: string;
  tasks: TaskData[];
};

export default function TaskList({ title, tasks }: TaskListProps) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            {task.completed ? " ✅" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
