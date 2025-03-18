import { create } from "zustand";

import lecturesService, { 
  LectureRecording, 
  CreateLectureData, 
  UpdateLectureData 
} from '../services/lectures';

interface LecturesState {
  lectures: LectureRecording[];
  moduleMap: Record<string, LectureRecording[]>;
  currentLecture: LectureRecording | null;
  isLoading: boolean;
  error: string | null;
  fetchLectures: () => Promise<void>;
  fetchLecturesByModule: (moduleName: string) => Promise<void>;
  fetchLectureById: (id: string) => Promise<void>;
  createLecture: (lectureData: CreateLectureData) => Promise<void>;
  updateLecture: (id: string, lectureData: UpdateLectureData) => Promise<void>;
  deleteLecture: (id: string) => Promise<void>;
  clearCurrentLecture: () => void;
  clearError: () => void;
}

const useLecturesStore = create<LecturesState>((set, get) => ({
  lectures: [],
  moduleMap: {},
  currentLecture: null,
  isLoading: false,
  error: null,
  
  fetchLectures: async () => {
    try {
      set({ isLoading: true, error: null });
      const lectures = await lecturesService.getLectures();
      
      // Create module map for easy filtering
      const moduleMap: Record<string, LectureRecording[]> = {};
      lectures.forEach(lecture => {
        if (!moduleMap[lecture.moduleName]) {
          moduleMap[lecture.moduleName] = [];
        }
        moduleMap[lecture.moduleName].push(lecture);
      });
      
      set({ lectures, moduleMap, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch lectures',
        isLoading: false 
      });
    }
  },
  
  fetchLecturesByModule: async (moduleName: string) => {
    try {
      set({ isLoading: true, error: null });
      const moduleLectures = await lecturesService.getLecturesByModule(moduleName);
      
      set(state => {
        const newModuleMap = { ...state.moduleMap };
        newModuleMap[moduleName] = moduleLectures;
        return { moduleMap: newModuleMap, isLoading: false };
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch lectures for module',
        isLoading: false 
      });
    }
  },
  
  fetchLectureById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const lecture = await lecturesService.getLectureById(id);
      set({ currentLecture: lecture, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch lecture',
        isLoading: false 
      });
    }
  },
  
  createLecture: async (lectureData: CreateLectureData) => {
    try {
      set({ isLoading: true, error: null });
      const newLecture = await lecturesService.createLecture(lectureData);
      
      set(state => {
        const newLectures = [newLecture, ...state.lectures];
        
        // Update module map
        const newModuleMap = { ...state.moduleMap };
        if (!newModuleMap[newLecture.moduleName]) {
          newModuleMap[newLecture.moduleName] = [];
        }
        newModuleMap[newLecture.moduleName].push(newLecture);
        
        return { 
          lectures: newLectures,
          moduleMap: newModuleMap,
          isLoading: false 
        };
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create lecture',
        isLoading: false 
      });
    }
  },
  
  updateLecture: async (id: string, lectureData: UpdateLectureData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedLecture = await lecturesService.updateLecture(id, lectureData);
      
      set(state => {
        const oldLecture = state.lectures.find(l => l.id === id);
        const newLectures = state.lectures.map(lecture => 
          lecture.id === id ? updatedLecture : lecture
        );
        
        // Update module map
        const newModuleMap = { ...state.moduleMap };
        
        // If module name changed, we need to update both old and new module arrays
        if (oldLecture && oldLecture.moduleName !== updatedLecture.moduleName) {
          newModuleMap[oldLecture.moduleName] = (newModuleMap[oldLecture.moduleName] || [])
            .filter(l => l.id !== id);
            
          if (!newModuleMap[updatedLecture.moduleName]) {
            newModuleMap[updatedLecture.moduleName] = [];
          }
          newModuleMap[updatedLecture.moduleName].push(updatedLecture);
        } else {
          // Just update the lecture in its current module array
          newModuleMap[updatedLecture.moduleName] = (newModuleMap[updatedLecture.moduleName] || [])
            .map(l => l.id === id ? updatedLecture : l);
        }
        
        return {
          lectures: newLectures,
          moduleMap: newModuleMap,
          currentLecture: updatedLecture,
          isLoading: false
        };
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update lecture',
        isLoading: false 
      });
    }
  },
  
  deleteLecture: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await lecturesService.deleteLecture(id);
      
      set(state => {
        const lectureToDelete = state.lectures.find(l => l.id === id);
        const newLectures = state.lectures.filter(lecture => lecture.id !== id);
        
        // Update module map
        const newModuleMap = { ...state.moduleMap };
        if (lectureToDelete) {
          newModuleMap[lectureToDelete.moduleName] = (newModuleMap[lectureToDelete.moduleName] || [])
            .filter(l => l.id !== id);
        }
        
        return {
          lectures: newLectures,
          moduleMap: newModuleMap,
          isLoading: false
        };
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete lecture',
        isLoading: false 
      });
    }
  },
  
  clearCurrentLecture: () => set({ currentLecture: null }),
  
  clearError: () => set({ error: null })
}));

export default useLecturesStore; 