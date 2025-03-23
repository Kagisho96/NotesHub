import useTasksStore from "../store/tasksStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TasksPage = () => {
  const { tasks, fetchTasks, updateTask, loading, error } = useTasksStore();
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await updateTask(id, { completed: !completed });
      toast.success(`Task marked as ${!completed ? 'complete' : 'incomplete'}`);
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  // Sort tasks by due date (closest first)
  const sortedTasks = [...filteredTasks].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Group tasks by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const taskGroups = {
    overdue: sortedTasks.filter(task => new Date(task.dueDate) < today),
    today: sortedTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }),
    tomorrow: sortedTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === tomorrow.getTime();
    }),
    thisWeek: sortedTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate > tomorrow && dueDate <= nextWeek;
    }),
    future: sortedTasks.filter(task => new Date(task.dueDate) > nextWeek),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <button
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          onClick={() => toast.info("Create task functionality coming soon!")}
        >
          + New Task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-3 text-sm font-medium ${
              filter === "all"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setFilter("all")}
          >
            All Tasks
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              filter === "pending"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              filter === "completed"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Tasks Lists */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : sortedTasks.length > 0 ? (
        <div className="space-y-6">
          {/* Overdue Tasks */}
          {taskGroups.overdue.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 bg-red-50">
                <h3 className="font-semibold text-red-600">Overdue</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {taskGroups.overdue.map((task) => (
                  <li key={task.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task.id, task.completed)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-red-600">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Today's Tasks */}
          {taskGroups.today.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 bg-yellow-50">
                <h3 className="font-semibold text-yellow-600">Today</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {taskGroups.today.map((task) => (
                  <li key={task.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task.id, task.completed)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">Due today</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Other Task Groups */}
          {Object.entries({
            tomorrow: { title: "Tomorrow", bgColor: "bg-blue-50", textColor: "text-blue-600" },
            thisWeek: { title: "This Week", bgColor: "bg-indigo-50", textColor: "text-indigo-600" },
            future: { title: "Later", bgColor: "bg-purple-50", textColor: "text-purple-600" },
          }).map(([key, { title, bgColor, textColor }]) => {
            const tasksInGroup = taskGroups[key as keyof typeof taskGroups];
            if (tasksInGroup.length === 0) return null;
            
            return (
              <div key={key} className="bg-white rounded-lg shadow overflow-hidden">
                <div className={`p-4 ${bgColor}`}>
                  <h3 className={`font-semibold ${textColor}`}>{title}</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {tasksInGroup.map((task) => (
                    <li key={task.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task.id, task.completed)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first task</p>
            <button
              onClick={() => toast.info("Create task functionality coming soon!")}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              Create a Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage; 