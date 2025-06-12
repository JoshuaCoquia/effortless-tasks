type Task = {
  id: number;
  title: string;
  completed?: boolean;
};

type TaskListProps = {
  title: string;
  tasks: Task[];
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
