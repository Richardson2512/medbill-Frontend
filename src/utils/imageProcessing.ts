/**
 * Image Processing Utilities for React Native
 * Handles image conversion for GPT-4V API
 */

/**
 * Convert image URI to base64 string
 * Note: For React Native, you should use react-native-fs for better performance
 * This is a fallback implementation using fetch
 */
export async function convertImageToBase64(imageUri: string): Promise<string> {
  try {
    // Check if it's already a base64 string
    if (imageUri.startsWith('data:')) {
      return imageUri.split(',')[1];
    }

    // For React Native, use fetch to get the image
    // Note: This works for remote URLs, but for local files (file://),
    // you should use react-native-fs: RNFS.readFile(uri.replace('file://', ''), 'base64')
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Convert blob to base64 using FileReader API
    // Note: FileReader is available in React Native 0.60+
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove data URL prefix
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error(
      'Failed to process image. Please ensure the image is accessible. For local files, consider using react-native-fs.',
    );
  }
}

/**
 * Alternative implementation using react-native-fs (recommended for local files)
 * Uncomment and use this if you install react-native-fs:
 * 
 * import RNFS from 'react-native-fs';
 * 
 * export async function convertImageToBase64ReactNativeFS(
 *   imageUri: string,
 * ): Promise<string> {
 *   try {
 *     // Remove file:// prefix
 *     const path = imageUri.replace('file://', '');
 *     const base64 = await RNFS.readFile(path, 'base64');
 *     return base64;
 *   } catch (error) {
 *     console.error('Error reading file with react-native-fs:', error);
 *     throw new Error('Failed to read image file');
 *   }
 * }
 */

