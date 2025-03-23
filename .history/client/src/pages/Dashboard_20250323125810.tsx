import useAuthStore from "../store/authStore";
import useLecturesStore from "../store/lecturesStore";
import useNotesStore from "../store/notesStore";
import useTasksStore from "../store/tasksStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../contexts/DarkModeContext";

const Dashboard = () => {
  const { user } = useAuthStore();
  const { notes, fetchNotes } = useNotesStore();
  const { tasks, fetchTasks } = useTasksStore();
  const { lectures, fetchLectures } = useLecturesStore();
  const { darkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchNotes(),
          fetchTasks(),
          fetchLectures()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchNotes, fetchTasks, fetchLectures]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Get upcoming tasks (due in the next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingTasks = tasks
    .filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Get recent notes
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  // Get recent lectures
  const recentLectures = [...lectures]
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className={`section-card ${darkMode ? 'border border-gray-700' : 'bg-white shadow-lg'}`}>
        <h2 className="text-2xl font-bold mb-4 text-high-contrast">Welcome back, {user?.name}!</h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Here's an overview of your recent activity and upcoming tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className={`section-card ${darkMode ? 'border border-gray-700' : 'bg-white shadow-lg'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-high-contrast">Upcoming Tasks</h3>
            <Link to="/tasks" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-primary-600 hover:text-primary-700'} text-sm font-medium`}>
              View all
            </Link>
          </div>
          
          {upcomingTasks.length > 0 ? (
            <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {upcomingTasks.map(task => (
                <li key={task.id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full shadow-sm ${
                        task.completed 
                          ? darkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'
                          : darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} py-4 text-center`}>No upcoming tasks</p>
          )}
        </div>

        {/* Recent Notes */}
        <div className={`section-card ${darkMode ? 'border border-gray-700' : 'bg-white shadow-lg'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-high-contrast">Recent Notes</h3>
            <Link to="/notes" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-primary-600 hover:text-primary-700'} text-sm font-medium`}>
              View all
            </Link>
          </div>
          
          {recentNotes.length > 0 ? (
            <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {recentNotes.map(note => (
                <li key={note.id} className="py-3">
                  <Link to={`/notes/${note.id}`} className={`block -mx-4 px-4 py-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{note.title}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Updated: {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} py-4 text-center`}>No notes yet</p>
          )}
        </div>
      </div>

      {/* Recent Lectures */}
      <div className={`section-card ${darkMode ? 'border border-gray-700' : 'bg-white shadow-lg'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-high-contrast">Recent Lecture Recordings</h3>
          <Link to="/lectures" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-primary-600 hover:text-primary-700'} text-sm font-medium`}>
            View all
          </Link>
        </div>
        
        {recentLectures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentLectures.map(lecture => (
              <div key={lecture.id} className={`${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} border rounded-lg p-4 shadow-sm`}>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{lecture.title}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Module: {lecture.moduleName}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Recorded: {new Date(lecture.recordedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} py-4 text-center`}>No lecture recordings yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 