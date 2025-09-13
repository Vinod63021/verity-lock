'use server';

/**
 * @fileOverview AI flow to analyze YouTube video frames for face and product detection.
 *
 * - analyzeVideo - Analyzes video frames to detect user's face and advertised products.
 * - AnalyzeVideoInput - Input type for the analyzeVideo function.
 * - AnalyzeVideoOutput - Return type for the analyzeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVideoInputSchema = z.object({
  userFaceDataUri: z
    .string()
    .describe(
      "A photo of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  productImageDataUri: z
    .string()
    .describe(
      'A photo of the advertised product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'    ),
  videoUrl: z.string().describe('The URL of the YouTube video to analyze.'),
});
export type AnalyzeVideoInput = z.infer<typeof AnalyzeVideoInputSchema>;

const AnalyzeVideoOutputSchema = z.object({
  faceDetected: z.boolean().describe('Whether the user face was detected in the video.'),
  productDetected: z.boolean().describe('Whether the advertised product was detected in the video.'),
  match: z
    .boolean()
    .describe('Whether both the user face and advertised product were detected in the video.'),
  report: z.string().describe('A report of the analysis, including any mismatches found.'),
});
export type AnalyzeVideoOutput = z.infer<typeof AnalyzeVideoOutputSchema>;

export async function analyzeVideo(input: AnalyzeVideoInput): Promise<AnalyzeVideoOutput> {
  return analyzeVideoFlow(input);
}

const analyzeVideoPrompt = ai.definePrompt({
  name: 'analyzeVideoPrompt',
  input: {schema: AnalyzeVideoInputSchema},
  output: {schema: AnalyzeVideoOutputSchema},
  prompt: `You are an AI video analyzer. You will analyze the video frames from the provided YouTube video and detect the user's face and the advertised product in the video.

  Determine if the user's face is present in the video, using the user face photo as reference.

  Determine if the advertised product is present in the video, using the product image as reference.

  Based on the detection, generate a report indicating if both the face and product were found, or if there are any mismatches.

  User Face: {{media url=userFaceDataUri}}
  Product Image: {{media url=productImageDataUri}}
  Video URL: {{{videoUrl}}}
  `,
});

const analyzeVideoFlow = ai.defineFlow(
  {
    name: 'analyzeVideoFlow',
    inputSchema: AnalyzeVideoInputSchema,
    outputSchema: AnalyzeVideoOutputSchema,
  },
  async input => {
    const {output} = await analyzeVideoPrompt(input);
    return output!;
  }
);
