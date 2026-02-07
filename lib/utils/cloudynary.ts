
export interface UploadedImage {
  url: string;
  publicId: string;
}

export const uploadImageToCloudinary = async (file: File, folder: string): Promise<UploadedImage> => {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    throw new Error('Variabel lingkungan Cloudinary tidak diatur.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Gagal mengunggah gambar ke Cloudinary.');
    }

    const result = await res.json();
    if (!result.secure_url || !result.public_id) {
      throw new Error('Cloudinary tidak mengembalikan URL atau Public ID yang valid.');
    }
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};