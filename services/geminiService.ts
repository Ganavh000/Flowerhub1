
import { GoogleGenAI } from "@google/genai";

/**
 * Processes the virtual try-on by combining a user photo and a selected garland using Gemini.
 * Uses gemini-2.5-flash-image for high-fidelity image editing.
 */
export async function processVirtualTryOn(
  userPhotoBase64: string,
  garlandUrl: string
): Promise<string> {
  // Initialize Gemini API client with a named parameter as required.
  // The API key is obtained exclusively from process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Extract base64 payload from data URL if necessary.
  const userBase64 = userPhotoBase64.split(',')[1] || userPhotoBase64;

  // Fetch the selected garland image and convert it to a base64 string for the model input.
  const garlandResponse = await fetch(garlandUrl);
  const garlandBlob = await garlandResponse.blob();
  const garlandBase64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(garlandBlob);
  });

  // Call the model to generate the edited image.
  // We use gemini-2.5-flash-image which is optimized for image generation and editing tasks.
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: userBase64,
            mimeType: 'image/png',
          },
        },
        {
          inlineData: {
            data: garlandBase64,
            mimeType: 'image/png',
          },
        },
        {
          text: 'Combine these two images. Naturally place the floral garland from the second image onto the person in the first image, around their neck. The result should look like a professional photograph where the person is naturally wearing the garland. Maintain lighting, shadows, and realism.',
        },
      ],
    },
  });

  if (!response.candidates?.[0]?.content?.parts) {
    throw new Error('Failed to generate image');
  }

  // Iterate through all response parts to locate the inlineData image part.
  // Do not assume the image is in the first part of the response.
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error('No image part found in response');
}
