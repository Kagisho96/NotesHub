import { Request, Response } from "express";
import { prisma } from "../index";

// Get all notes for the current user
export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: req.user?.id
      },
      include: {
        tags: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json({ notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get public notes
export const getPublicNotes = async (req: Request, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        isPublic: true
      },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json({ notes });
  } catch (error) {
    console.error('Get public notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single note by ID
export const getNoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: {
        id
      },
      include: {
        tags: true
      }
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if the note belongs to the user or is public
    if (note.userId !== req.user?.id && !note.isPublic) {
      return res.status(403).json({ message: 'Not authorized to access this note' });
    }

    res.json({ note });
  } catch (error) {
    console.error('Get note by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, isPublic, tags } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    // Create note
    const note = await prisma.note.create({
      data: {
        title,
        content,
        isPublic: isPublic || false,
        userId: req.user?.id as string
      }
    });

    // Add tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        let tag = await prisma.tag.findFirst({
          where: {
            name: tagName
          }
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName
            }
          });
        }

        // Connect tag to note
        await prisma.note.update({
          where: {
            id: note.id
          },
          data: {
            tags: {
              connect: {
                id: tag.id
              }
            }
          }
        });
      }
    }

    // Get the updated note with tags
    const updatedNote = await prisma.note.findUnique({
      where: {
        id: note.id
      },
      include: {
        tags: true
      }
    });

    res.status(201).json({
      message: 'Note created successfully',
      note: updatedNote
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a note
export const updateNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, isPublic, tags } = req.body;

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findUnique({
      where: {
        id
      }
    });

    if (!existingNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (existingNote.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }

    // Update note
    const updatedNote = await prisma.note.update({
      where: {
        id
      },
      data: {
        title: title || existingNote.title,
        content: content || existingNote.content,
        isPublic: isPublic !== undefined ? isPublic : existingNote.isPublic
      }
    });

    // Update tags if provided
    if (tags && tags.length > 0) {
      // Remove existing tags
      await prisma.note.update({
        where: {
          id
        },
        data: {
          tags: {
            set: []
          }
        }
      });

      // Add new tags
      for (const tagName of tags) {
        // Find or create tag
        let tag = await prisma.tag.findFirst({
          where: {
            name: tagName
          }
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName
            }
          });
        }

        // Connect tag to note
        await prisma.note.update({
          where: {
            id
          },
          data: {
            tags: {
              connect: {
                id: tag.id
              }
            }
          }
        });
      }
    }

    // Get the updated note with tags
    const finalNote = await prisma.note.findUnique({
      where: {
        id
      },
      include: {
        tags: true
      }
    });

    res.json({
      message: 'Note updated successfully',
      note: finalNote
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if note exists and belongs to user
    const note = await prisma.note.findUnique({
      where: {
        id
      }
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    // Delete note
    await prisma.note.delete({
      where: {
        id
      }
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 