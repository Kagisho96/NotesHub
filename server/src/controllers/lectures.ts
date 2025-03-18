import { Request, Response } from "express";
import { prisma } from "../index";

// Get all lecture recordings for the current user
export const getLectureRecordings = async (req: Request, res: Response) => {
  try {
    const lectureRecordings = await prisma.lectureRecording.findMany({
      where: {
        userId: req.user?.id
      },
      orderBy: [
        {
          recordedAt: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ]
    });

    res.json({ lectureRecordings });
  } catch (error) {
    console.error('Get lecture recordings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get lecture recordings by module name
export const getLectureRecordingsByModule = async (req: Request, res: Response) => {
  try {
    const { moduleName } = req.params;

    const lectureRecordings = await prisma.lectureRecording.findMany({
      where: {
        userId: req.user?.id,
        moduleName
      },
      orderBy: {
        recordedAt: 'desc'
      }
    });

    res.json({ lectureRecordings });
  } catch (error) {
    console.error('Get lecture recordings by module error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single lecture recording by ID
export const getLectureRecordingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const lectureRecording = await prisma.lectureRecording.findUnique({
      where: {
        id
      }
    });

    if (!lectureRecording) {
      return res.status(404).json({ message: 'Lecture recording not found' });
    }

    // Check if the lecture recording belongs to the user
    if (lectureRecording.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to access this lecture recording' });
    }

    res.json({ lectureRecording });
  } catch (error) {
    console.error('Get lecture recording by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new lecture recording
export const createLectureRecording = async (req: Request, res: Response) => {
  try {
    const { moduleName, title, recordingUrl, description, recordedAt } = req.body;

    // Validate input
    if (!moduleName || !title || !recordingUrl || !recordedAt) {
      return res.status(400).json({ 
        message: 'Please provide module name, title, recording URL, and recorded date' 
      });
    }

    // Create lecture recording
    const lectureRecording = await prisma.lectureRecording.create({
      data: {
        moduleName,
        title,
        recordingUrl,
        description,
        recordedAt: new Date(recordedAt),
        userId: req.user?.id as string
      }
    });

    res.status(201).json({
      message: 'Lecture recording created successfully',
      lectureRecording
    });
  } catch (error) {
    console.error('Create lecture recording error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a lecture recording
export const updateLectureRecording = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { moduleName, title, recordingUrl, description, recordedAt } = req.body;

    // Check if lecture recording exists and belongs to user
    const existingLectureRecording = await prisma.lectureRecording.findUnique({
      where: {
        id
      }
    });

    if (!existingLectureRecording) {
      return res.status(404).json({ message: 'Lecture recording not found' });
    }

    if (existingLectureRecording.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to update this lecture recording' });
    }

    // Update lecture recording
    const updatedLectureRecording = await prisma.lectureRecording.update({
      where: {
        id
      },
      data: {
        moduleName: moduleName || existingLectureRecording.moduleName,
        title: title || existingLectureRecording.title,
        recordingUrl: recordingUrl || existingLectureRecording.recordingUrl,
        description: description !== undefined ? description : existingLectureRecording.description,
        recordedAt: recordedAt ? new Date(recordedAt) : existingLectureRecording.recordedAt
      }
    });

    res.json({
      message: 'Lecture recording updated successfully',
      lectureRecording: updatedLectureRecording
    });
  } catch (error) {
    console.error('Update lecture recording error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a lecture recording
export const deleteLectureRecording = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if lecture recording exists and belongs to user
    const lectureRecording = await prisma.lectureRecording.findUnique({
      where: {
        id
      }
    });

    if (!lectureRecording) {
      return res.status(404).json({ message: 'Lecture recording not found' });
    }

    if (lectureRecording.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to delete this lecture recording' });
    }

    // Delete lecture recording
    await prisma.lectureRecording.delete({
      where: {
        id
      }
    });

    res.json({ message: 'Lecture recording deleted successfully' });
  } catch (error) {
    console.error('Delete lecture recording error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 