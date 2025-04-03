import useNotesStore from "../store/notesStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDarkMode } from "../contexts/DarkModeContext";

const NotesPage = () => {
  const { notes, fetchNotes, isLoading, error } = useNotesStore();
  const { darkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNoteClick = (id: string) => {
    navigate(`/notes/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-high-contrast">My Notes</h1>
        {/* <button
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md shadow-md"
          onClick={() => toast.info("Create note functionality coming soon!")}
        >
          + New Note
        </button> */}
      </div>

      {/* Search and Filter */}
      <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} p-4 rounded-lg shadow-md`}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className={`block w-full pl-10 pr-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white placeholder-gray-500'} rounded-md leading-5 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition-shadow card-hover cursor-pointer`}
              onClick={() => handleNoteClick(note.id)}
            >
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 truncate text-high-contrast">{note.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 h-12 overflow-hidden`}>
                  {note.content.substring(0, 100)}
                  {note.content.length > 100 ? "..." : ""}
                </p>
                <div className={`flex justify-between items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>
                    Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  <span 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering parent's onClick
                      handleNoteClick(note.id);
                    }}
                    className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-primary-600 hover:text-primary-800'}`}
                  >
                    View →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
          <div className="flex flex-col items-center">
            <svg className={`w-16 h-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-high-contrast mb-2">No notes found</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              {searchTerm ? "Try a different search term" : "Get started by creating your first note"}
            </p>
            <button
              onClick={() => toast.info("Create note functionality coming soon!")}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md shadow-md"
            >
              Create a Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage; 