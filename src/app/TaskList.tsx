import type { TaskData } from "./types";

type TaskListProps = {
  title: string;
  tasks: TaskData[];
  onTaskButtonClick: (id: string) => void;
  onTaskTextUpdate: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TaskList({
  title,
  tasks,
  onTaskButtonClick,
  onTaskTextUpdate,
}: TaskListProps) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <button onClick={() => {
              onTaskButtonClick(task.id);
            }}>
              {task.completed ? "(X)" : "( )"}
            </button> <input
              type="text"
              value={task.title}
              onChange={(event) => {
                onTaskTextUpdate(task.id, event);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
