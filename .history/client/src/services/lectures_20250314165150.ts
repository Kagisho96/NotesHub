import api from "./api";

export interface LectureRecording {
  id: string;
  moduleName: string;
  title: string;
  recordingUrl: string;
  description?: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateLectureData {
  moduleName: string;
  title: string;
  recordingUrl: string;
  description?: string;
  recordedAt: string;
}

export interface UpdateLectureData {
  moduleName?: string;
  title?: string;
  recordingUrl?: string;
  description?: string;
  recordedAt?: string;
}

const lecturesService = {
  getLectures: async (): Promise<LectureRecording[]> => {
    try {
      const response = await api.get<{ lectureRecordings: LectureRecording[] }>('/lectures');
      return response.data.lectureRecordings;
    } catch (error) {
      throw error;
    }
  },
  
  getLecturesByModule: async (moduleName: string): Promise<LectureRecording[]> => {
    try {
      const response = await api.get<{ lectureRecordings: LectureRecording[] }>(`/lectures/module/${moduleName}`);
      return response.data.lectureRecordings;
    } catch (error) {
      throw error;
    }
  },
  
  getLectureById: async (id: string): Promise<LectureRecording> => {
    try {
      const response = await api.get<{ lectureRecording: LectureRecording }>(`/lectures/${id}`);
      return response.data.lectureRecording;
    } catch (error) {
      throw error;
    }
  },
  
  createLecture: async (lectureData: CreateLectureData): Promise<LectureRecording> => {
    try {
      const response = await api.post<{ lectureRecording: LectureRecording, message: string }>('/lectures', lectureData);
      return response.data.lectureRecording;
    } catch (error) {
      throw error;
    }
  },
  
  updateLecture: async (id: string, lectureData: UpdateLectureData): Promise<LectureRecording> => {
    try {
      const response = await api.put<{ lectureRecording: LectureRecording, message: string }>(`/lectures/${id}`, lectureData);
      return response.data.lectureRecording;
    } catch (error) {
      throw error;
    }
  },
  
  deleteLecture: async (id: string): Promise<void> => {
    try {
      await api.delete(`/lectures/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default lecturesService; 