import useLecturesStore from "../store/lecturesStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDarkMode } from "../contexts/DarkModeContext";

const LecturesPage = () => {
  const { lectures, fetchLectures, loading, error } = useLecturesStore();
  const { darkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Extract unique modules
  const modules = ["all", ...new Set(lectures.map(lecture => lecture.moduleName))];

  // Filter lectures based on search term and selected module
  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = 
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.moduleName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = selectedModule === "all" || lecture.moduleName === selectedModule;
    
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-high-contrast">Lecture Recordings</h1>
        <button
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md shadow-md"
          onClick={() => toast.info("Upload lecture functionality coming soon!")}
        >
          + Upload Lecture
        </button>
      </div>

      {/* Search and Filter */}
      <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} p-4 rounded-lg shadow-md`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white placeholder-gray-500'} rounded-md leading-5 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
              placeholder="Search lectures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Module filter */}
          <div>
            <select
              className={`block w-full py-2 px-3 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
            >
              {modules.map(module => (
                <option key={module} value={module}>
                  {module === "all" ? "All Modules" : module}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lectures Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredLectures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lecture) => (
            <div 
              key={lecture.id} 
              className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition-shadow card-hover`}
            >
              <div className={`h-40 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-t-lg flex items-center justify-center`}>
                <svg className={`w-20 h-20 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-4">
                <span className={`inline-block px-2 py-1 text-xs font-semibold ${darkMode ? 'bg-primary-900 text-primary-200' : 'bg-primary-100 text-primary-800'} rounded-full mb-2`}>
                  {lecture.moduleName}
                </span>
                <h3 className="font-bold text-lg mb-2 truncate text-high-contrast">{lecture.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 h-10 overflow-hidden`}>
                  {lecture.description.substring(0, 80)}
                  {lecture.description.length > 80 ? "..." : ""}
                </p>
                <div className={`flex justify-between items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>
                    {new Date(lecture.recordedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => toast.info("Lecture playback coming soon!")}
                    className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-primary-600 hover:text-primary-800'}`}
                  >
                    Play →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
          <div className="flex flex-col items-center">
            <svg className={`w-16 h-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-high-contrast mb-2">No lecture recordings found</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              {searchTerm || selectedModule !== "all" 
                ? "Try different search terms or filters" 
                : "Get started by uploading your first lecture recording"}
            </p>
            <button
              onClick={() => toast.info("Upload lecture functionality coming soon!")}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md shadow-md"
            >
              Upload a Lecture
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturesPage; 