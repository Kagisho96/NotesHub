import useNotesStore from "../store/notesStore";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaComment, FaThumbsDown, FaThumbsUp, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDarkMode } from "../contexts/DarkModeContext";

const NoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [isDeleting, setIsDeleting] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState<boolean | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{ id: string; text: string; createdAt: string; userName: string }[]>([]);

  const { 
    currentNote, 
    fetchNoteById, 
    deleteNote, 
    isLoading, 
    error, 
    clearError 
  } = useNotesStore();

  useEffect(() => {
    if (id) {
      fetchNoteById(id);
    }

    // Mock data for prototype
    setLikes(Math.floor(Math.random() * 15));
    setDislikes(Math.floor(Math.random() * 5));
    setComments([
      { 
        id: '1', 
        text: 'This is really helpful, thanks for sharing!', 
        createdAt: new Date().toISOString(), 
        userName: 'Alex Johnson' 
      },
      { 
        id: '2', 
        text: 'Could you provide more examples on this topic?', 
        createdAt: new Date(Date.now() - 86400000).toISOString(), 
        userName: 'Sam Miller' 
      }
    ]);

    return () => clearError();
  }, [id, fetchNoteById, clearError]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await deleteNote(id);
      toast.success("Note deleted successfully");
      navigate("/notes");
    } catch (err) {
      toast.error("Failed to delete note");
      setIsDeleting(false);
    }
  };

  const handleLike = () => {
    if (userLiked === true) {
      // User already liked, so unlike
      setLikes(prev => prev - 1);
      setUserLiked(null);
    } else {
      // User is liking
      if (userLiked === false) {
        // User previously disliked, so remove dislike
        setDislikes(prev => prev - 1);
      }
      setLikes(prev => prev + 1);
      setUserLiked(true);
    }
    toast.success("Your reaction has been recorded");
  };

  const handleDislike = () => {
    if (userLiked === false) {
      // User already disliked, so remove dislike
      setDislikes(prev => prev - 1);
      setUserLiked(null);
    } else {
      // User is disliking
      if (userLiked === true) {
        // User previously liked, so remove like
        setLikes(prev => prev - 1);
      }
      setDislikes(prev => prev + 1);
      setUserLiked(false);
    }
    toast.success("Your reaction has been recorded");
  };

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      createdAt: new Date().toISOString(),
      userName: "You" // Typically would come from the auth store
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText("");
    toast.success("Comment added");
  };

  const handleBackToNotes = () => {
    navigate("/notes");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
        <h3 className="text-lg font-medium text-high-contrast mb-2">Note not found</h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
          The note you're looking for doesn't exist or has been deleted.
        </p>
        <button
          onClick={handleBackToNotes}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md shadow-md"
        >
          Go back to Notes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-2 mb-4">
        <button 
          onClick={handleBackToNotes}
          className={`flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <FaArrowLeft className="mr-2" /> Back to Notes
        </button>
      </div>

      {/* Note Content */}
      <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-high-contrast">{currentNote.title}</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`p-2 rounded-full ${darkMode 
                  ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                title="Delete note"
              >
                <FaTrash />
              </button>
            </div>
          </div>

          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-6 whitespace-pre-line`}>
            {currentNote.content}
          </div>

          {/* Tags if they exist */}
          {currentNote.tags && currentNote.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {currentNote.tags.map(tag => (
                <span 
                  key={tag.id} 
                  className={`${darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-200 text-gray-700'} px-2 py-1 rounded-md text-sm`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className={`flex justify-between items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <span>
              Created: {new Date(currentNote.createdAt).toLocaleDateString()}
            </span>
            <span>
              Last updated: {new Date(currentNote.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Reactions and Comments Section */}
        <div className={`px-6 py-4 ${darkMode ? 'bg-gray-900/30 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
                  userLiked === true
                    ? 'bg-blue-500 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaThumbsUp />
                <span>{likes}</span>
              </button>
              
              <button 
                onClick={handleDislike}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
                  userLiked === false
                    ? 'bg-red-500 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaThumbsDown />
                <span>{dislikes}</span>
              </button>
            </div>
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaComment />
              <span>{comments.length} Comments</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className={`px-6 py-4 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
            <h3 className="text-lg font-semibold mb-4 text-high-contrast">Comments</h3>
            
            {/* Add Comment */}
            <div className="mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add your comment..."
                className={`w-full p-3 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleAddComment}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md shadow-md"
                >
                  Post Comment
                </button>
              </div>
            </div>
            
            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div 
                    key={comment.id} 
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <div className="flex justify-between mb-2">
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {comment.userName}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteDetailPage; 