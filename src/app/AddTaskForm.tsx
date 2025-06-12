"use client";
type AddTaskFormProps = {
  taskTitle: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};
export default function AddTaskForm({
  taskTitle,
  onChange,
  onSubmit,
}: AddTaskFormProps) {
  return (
    <form id="addTaskForm" onSubmit={onSubmit}>
      <button
        type="submit"
        className="bg-blue-300 text-foreground rounded-md p-2 mr-2"
      >
        Add Task
      </button>
      <label htmlFor="newTaskTitle" className="hidden">
        Task List to Select
      </label>
      <input
        type="text"
        name="newTaskTitle"
        id="newTaskTitle"
        placeholder="New Task Title"
        value={taskTitle}
        onChange={onChange}
        className="border-2 border-gray-300 rounded-md p-2"
        autoFocus
      />
      <label htmlFor="taskListMenu" className="hidden">
        Task List to Select
      </label>
      <select
        name="taskListMenu"
        id="taskListMenu"
        className="border-2 border-gray-300 rounded-md p-2 mt-4"
      ></select>
    </form>
  );
}
