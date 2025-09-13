// src/ai/flows/generate-mismatch-report.ts
'use server';
/**
 * @fileOverview Generates a mismatch report if the user's face is detected in a video but the advertised product is different from the registered ones.
 *
 * - generateMismatchReport - A function that generates the mismatch report.
 * - GenerateMismatchReportInput - The input type for the generateMismatchReport function.
 * - GenerateMismatchReportOutput - The return type for the generateMismatchReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMismatchReportInputSchema = z.object({
  userFacePhotoDataUri: z
    .string()
    .describe(
      "The user's face photo as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  videoFrameDataUri: z
    .string()
    .describe(
      'A frame from the YouTube video as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  advertisedProductName: z.string().describe('The name of the advertised product in the video.'),
  registeredProductNames: z.array(z.string()).describe('The names of the products the user is registered to advertise.'),
  youtubeVideoUrl: z.string().describe('The URL of the YouTube video where the mismatch was detected.'),
});
export type GenerateMismatchReportInput = z.infer<typeof GenerateMismatchReportInputSchema>;

const GenerateMismatchReportOutputSchema = z.object({
  report: z.string().describe('The generated mismatch report.'),
});
export type GenerateMismatchReportOutput = z.infer<typeof GenerateMismatchReportOutputSchema>;

export async function generateMismatchReport(input: GenerateMismatchReportInput): Promise<GenerateMismatchReportOutput> {
  return generateMismatchReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMismatchReportPrompt',
  input: {schema: GenerateMismatchReportInputSchema},
  output: {schema: GenerateMismatchReportOutputSchema},
  prompt: `You are an AI assistant that generates mismatch reports for YouTube videos. A mismatch occurs when a user's face is detected in a YouTube video, but the advertised product in the video is different from the products the user is registered to advertise.

  You are provided with the following information:
  - User's face photo: {{media url=userFacePhotoDataUri}}
  - Video frame: {{media url=videoFrameDataUri}}
  - Advertised product name in the video: {{{advertisedProductName}}}
  - Registered product names for the user: {{#each registeredProductNames}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - YouTube video URL: {{{youtubeVideoUrl}}}

  Generate a concise report explaining the mismatch and why it is considered a mismatch. The report should include the video URL and the names of the products involved.
  `,
});

const generateMismatchReportFlow = ai.defineFlow(
  {
    name: 'generateMismatchReportFlow',
    inputSchema: GenerateMismatchReportInputSchema,
    outputSchema: GenerateMismatchReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
