import { z } from 'zod';

export const FormDataSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  pdfFile: z.instanceof(FileList).nullable(), // Update validation as needed
  language: z.string().min(1, 'Language is required'),
  anchorVoice: z.enum(['male', 'female']).optional(), // Optional enum for anchor voice
  postMode: z.enum(['manual', 'automatic']).optional(), // Optional enum for post mod
  reels: z.boolean().optional(),
  videoFormat: z.enum(['MP4', 'MOV', 'WMV', 'AVI']).nullable(),
});