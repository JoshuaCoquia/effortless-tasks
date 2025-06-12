export default function Home() {
  return (
   <main>
    <h1 className="hidden">Effortless Tasks</h1>
    {/* Add Task Form */}
    <form>
      <button type="submit" className="bg-blue-500 text-foreground rounded-md p-2 mr-2">Add Task</button>
      <label htmlFor="newTaskTitle" className="hidden">Task List to Select</label>
      <input type="text" name="newTaskTitle" id="newTaskTitle" placeholder="New Task Title" className="border-2 border-gray-300 rounded-md p-2" autoFocus />
      <label htmlFor="taskListMenu" className="hidden">Task List to Select</label>
      <select name="taskListMenu" id="taskListMenu" className="border-2 border-gray-300 rounded-md p-2 mt-4">

      </select>
    </form>
    {/* Dropdown menu to select task list */}
    {/* Task list */}
   </main> 
  );
}
