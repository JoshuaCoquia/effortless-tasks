import type { TaskData } from "./types";
import Image from "next/image";
import CheckIcon from "@/images/check_16dp_090B0D_FILL0_wght400_GRAD0_opsz20.svg";

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
            }} className="w-4 h-4">
            
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
