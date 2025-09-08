// Utility functions for image handling

export interface ImageUploadResult {
  success: boolean;
  imageId?: string;
  error?: string;
}

export interface ImageData {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
  dataUrl: string;
}

/**
 * Upload an image for a hostel
 */
export async function uploadHostelImage(
  hostelId: string, 
  imageFile: File
): Promise<ImageUploadResult> {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`/api/hostels/${hostelId}/images`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Upload failed',
      };
    }

    return {
      success: true,
      imageId: result.imageId,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: 'Network error during upload',
    };
  }
}

/**
 * Get image data for a hostel
 */
export async function getHostelImage(hostelId: string): Promise<ImageData | null> {
  try {
    const response = await fetch(`/api/hostels/${hostelId}/images`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No image found
      }
      throw new Error('Failed to fetch image');
    }

    const result = await response.json();
    return result.image;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}

/**
 * Delete image for a hostel
 */
export async function deleteHostelImage(hostelId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/hostels/${hostelId}/images`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'File must be an image',
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 5MB',
    };
  }

  return { isValid: true };
}

/**
 * Convert file to preview URL for display before upload
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
