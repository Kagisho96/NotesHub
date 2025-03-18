import MainLayout from "../components/layout/MainLayout";
import useAuthStore from "../store/authStore";
import useLecturesStore from "../store/lecturesStore";
import useNotesStore from "../store/notesStore";
import useTasksStore from "../store/tasksStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuthStore();
  const { notes, fetchNotes } = useNotesStore();
  const { tasks, fetchTasks } = useTasksStore();
  const { lectures, fetchLectures } = useLecturesStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Comment out actual data fetching to prevent API errors
        /*
        await Promise.all([
          fetchNotes(),
          fetchTasks(),
          fetchLectures()
        ]);
        */
        // Set dummy data for testing
        setTimeout(() => setIsLoading(false), 500);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
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

  // Dummy data for testing
  const dummyTasks = [
    { 
      id: '1', 
      title: 'Complete math assignment', 
      dueDate: new Date(Date.now() + 86400000).toISOString(), 
      completed: false 
    },
    { 
      id: '2', 
      title: 'Read chapter 5', 
      dueDate: new Date(Date.now() + 172800000).toISOString(), 
      completed: true 
    },
  ];
  
  const dummyNotes = [
    {
      id: '1',
      title: 'Physics Notes',
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Chemistry Formulas',
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];
  
  const dummyLectures = [
    {
      id: '1',
      title: 'Introduction to Calculus',
      moduleName: 'Mathematics',
      recordedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Quantum Physics Basics',
      moduleName: 'Physics',
      recordedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  // Wrap the entire dashboard in MainLayout
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome back, Test User!</h2>
          <p className="text-gray-600">
            Here's an overview of your recent activity and upcoming tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
              <Link to="/tasks" className="text-primary-600 hover:text-primary-700 text-sm">
                View all
              </Link>
            </div>
            
            <ul className="divide-y">
              {dummyTasks.map(task => (
                <li key={task.id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Notes</h3>
              <Link to="/notes" className="text-primary-600 hover:text-primary-700 text-sm">
                View all
              </Link>
            </div>
            
            <ul className="divide-y">
              {dummyNotes.map(note => (
                <li key={note.id} className="py-3">
                  <Link to={`/notes/${note.id}`} className="block hover:bg-gray-50 -mx-4 px-4 py-2 rounded">
                    <p className="font-medium">{note.title}</p>
                    <p className="text-sm text-gray-500">
                      Updated: {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Lectures */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Lecture Recordings</h3>
            <Link to="/lectures" className="text-primary-600 hover:text-primary-700 text-sm">
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dummyLectures.map(lecture => (
              <div key={lecture.id} className="border rounded-lg p-4">
                <p className="font-medium">{lecture.title}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Module: {lecture.moduleName}
                </p>
                <p className="text-xs text-gray-400">
                  Recorded: {new Date(lecture.recordedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard; 