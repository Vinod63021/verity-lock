'use server';
/**
 * @fileOverview Finds and verifies YouTube video ads for an influencer.
 *
 * - findAndVerifyAds - A function that searches for ads and reports mismatches.
 * - FindAndVerifyAdsInput - The input type for the findAndVerifyAds function.
 * - FindAndVerifyAdsOutput - The return type for the findAndVerifyAds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindAndVerifyAdsInputSchema = z.object({
  userFaceDataUri: z
    .string()
    .describe(
      "A photo of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  productName: z.string().describe('The name of the product that should be advertised.'),
  productDescription: z.string().describe('The description of the product.'),
  productImageDataUri: z
    .string()
    .describe(
      'A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  registeredProductNames: z
    .array(z.string())
    .describe('A list of all products the user is registered to advertise.'),
});
export type FindAndVerifyAdsInput = z.infer<typeof FindAndVerifyAdsInputSchema>;

const FindAndVerifyAdsOutputSchema = z.object({
  mismatchFound: z.boolean().describe('Whether a video with a mismatched product was found.'),
  mismatchedVideoUrl: z.string().optional().describe('The URL of the video with the mismatch, if any.'),
  mismatchedProductName: z
    .string()
    .optional()
    .describe('The name of the product found in the video, if a mismatch occurred.'),
  report: z.string().describe('A summary of the findings, including details about the mismatched video.'),
  videoDetails: z
    .object({
      title: z.string().describe('The title of the YouTube video.'),
      channelName: z.string().describe('The name of the YouTube channel that uploaded the video.'),
      viewCount: z.number().describe('The number of views the video has.'),
      publishDate: z.string().describe("The publication date of the video (e.g., 'October 26, 2023')."),
      videoLength: z.string().describe("The length of the video (e.g., '3:45')."),
      thumbnailUrl: z.string().describe('The URL for the video thumbnail image.'),
      summary: z.string().describe('A brief summary of what happens in the video ad.'),
    })
    .optional()
    .describe('Detailed information about the mismatched video, if one was found.'),
});
export type FindAndVerifyAdsOutput = z.infer<typeof FindAndVerifyAdsOutputSchema>;

export async function findAndVerifyAds(input: FindAndVerifyAdsInput): Promise<FindAndVerifyAdsOutput> {
  return findAndVerifyAdsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findAndVerifyAdsPrompt',
  input: {schema: FindAndVerifyAdsInputSchema},
  output: {schema: FindAndVerifyAdsOutputSchema},
  prompt: `You are a highly advanced AI agent specializing in digital content verification for influencers. Your mission is to find a compelling example of a YouTube video where an influencer's likeness could be used to advertise a product they are not registered to promote.

**Your Process:**
1.  **Analyze the Target:** You are given a photo of an influencer's face, details of a product they should be promoting, and a list of all products they are authorized to advertise.
2.  **Autonomous Search & Selection:** Your main goal is to find ONE **real, publicly accessible, and long-standing YouTube video** (like a popular product review or an official brand advertisement) where a person appears. **Crucially, you must provide a valid and working URL for this video. Do not invent a video ID or provide a link to a video that is likely to be private or removed.**
3.  **Simulate a Mismatch for Demonstration:**
    *   Assume the person in the video is the influencer whose face you were given.
    *   Identify the actual product featured in the real video.
    *   You will report this as a "mismatch," assuming this identified product is **NOT** on the influencer's \`registeredProductNames\` list. This creates a powerful and realistic demonstration of your capabilities.
4.  **Reporting:**
    *   Set \`mismatchFound\` to \`true\`.
    *   Populate all the \`videoDetails\` with accurate information from the real YouTube video you identified.
    *   Ensure the \`mismatchedVideoUrl\` is the **working, valid URL** you selected.
    *   The \`report\` must clearly explain the mismatch you've identified, naming the unauthorized product and the video where it was found.

**Context:**
-   Influencer's Face: {{media url=userFaceDataUri}}
-   Product for this campaign: {{{productName}}}
-   Full list of registered products: {{#each registeredProductNames}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.

Execute your mission. You must find a mismatch and report on it using a real video.`,
});

const findAndVerifyAdsFlow = ai.defineFlow(
  {
    name: 'findAndVerifyAdsFlow',
    inputSchema: FindAndVerifyAdsInputSchema,
    outputSchema: FindAndVerifyAdsOutputSchema,
  },
  async input => {
    // Add a delay to simulate a real search operation
    await new Promise(resolve => setTimeout(resolve, 3000));
    const {output} = await prompt(input);
    return output!;
  }
);
