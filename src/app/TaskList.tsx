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
    <div className="m-4">
      <h2 className="font-bold text-md my-1.5">{title}</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="hover:bg-grey-light-background focus:bg-grey-light-background flex items-center border-0 rounded-lg gap-2 p-2 transition-all duration-400 group">
            <button onClick={() => {
              onTaskButtonClick(task.id);
            }} className="w-8 h-8 border-2 rounded-lg border-grey-dark flex-none outline-0">
              {task.completed && <Image src={CheckIcon} width={24} height={24} alt="Check Mark" className="mx-auto my-auto pointer-events-none" />}
            </button>
            <div className="w-full flex-auto">
              <input
                type="text"
                value={task.title}
                onChange={(event) => {
                  onTaskTextUpdate(task.id, event);
                }}
                className={`peer outline-0 w-full ${task.completed ? "text-grey group-focus-within:text-black group-hover:text-black line-through" : "text-black"}`}
              />
              <div className="block w-0 peer-hover:w-full peer-focus:w-full transition-all duration-150 h-[1px] bg-grey" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
