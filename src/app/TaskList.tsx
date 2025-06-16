import type { TaskData } from "./types";
import Image from "next/image";
import CheckIcon from "@/images/check_16dp_090B0D_FILL0_wght400_GRAD0_opsz20.svg";
import DeleteIcon from "@/images/delete_16dp_090B0D_FILL0_wght400_GRAD0_opsz20.svg"

type TaskListProps = {
  id: string;
  title: string;
  tasks: TaskData[];
  onTaskButtonClick: (id: string) => void;
  onTaskTextUpdate: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onTaskDelete: (id: string) => void;
  onTitleUpdate: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onListDelete: (id: string) => void;
};

export default function TaskList({
  id,
  title,
  tasks,
  onTaskButtonClick,
  onTaskTextUpdate,
  onTaskDelete,
  onTitleUpdate,
  onListDelete,
}: TaskListProps) {
  return (
    <div className="m-4">
      <section className="w-full group flex gap-2">
        <h2 className="font-bold text-md my-1.5 flex flex-col gap-0.5 w-full">
          <input type="text" value={title} className="w-full text-black placeholder-grey outline-0 transition-all duration-150" onChange={(event) => {
            onTitleUpdate(id, event);
          }} />
          <div className="block w-0 group-hover:w-full group-focus-within:w-full transition-all duration-150 h-[1px] bg-grey" />
        </h2>
        <button onClick={() => {
          onListDelete(id);
        }} className="hidden group-focus-within:block group-hover:block">
          <Image src={DeleteIcon} width={24} height={24} alt="Delete Task Icon" />
        </button>
      </section>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="hover:bg-grey-light-background focus-within:bg-grey-light-background flex items-center border-0 rounded-lg gap-2 p-2 transition-all duration-400 group">
            <button onClick={() => {
              onTaskButtonClick(task.id);
            }} className="w-8 h-8 border-2 rounded-lg border-grey-dark flex-none outline-0">
              {task.completed && <Image src={CheckIcon} width={24} height={24} alt="Complete Task Icon" className="mx-auto my-auto pointer-events-none" />}
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
            <button onClick={() => {
              onTaskDelete(task.id);
            }} className="hidden group-focus-within:block group-hover:block">
              <Image src={DeleteIcon} width={24} height={24} alt="Delete Task Icon" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
