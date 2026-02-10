import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class CloudinaryService {
  // Upload single file to Cloudinary
  async uploadFile(file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.folder) formData.append('folder', options.folder);
    if (options.resourceType) formData.append('resourceType', options.resourceType);
    if (options.quality) formData.append('quality', options.quality);
    if (options.fetchFormat) formData.append('fetchFormat', options.fetchFormat);

    try {
      const response = await axios.post(`${API_BASE_URL}/cloudinary/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
  }

  // Upload multiple files to Cloudinary
  async uploadMultipleFiles(files, options = {}) {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    if (options.folder) formData.append('folder', options.folder);
    if (options.resourceType) formData.append('resourceType', options.resourceType);
    if (options.quality) formData.append('quality', options.quality);
    if (options.fetchFormat) formData.append('fetchFormat', options.fetchFormat);

    try {
      const response = await axios.post(`${API_BASE_URL}/cloudinary/upload-multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Cloudinary multiple upload error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload files');
    }
  }

  // List all files in a folder
  async listFiles(folder = 'ecommerce', options = {}) {
    try {
      const params = { folder };
      if (options.maxResults) params.maxResults = options.maxResults;
      if (options.next_cursor) params.next_cursor = options.next_cursor;

      const response = await axios.get(`${API_BASE_URL}/cloudinary/list`, { params });
      return response.data;
    } catch (error) {
      console.error('Cloudinary list files error:', error);
      throw new Error(error.response?.data?.message || 'Failed to list files');
    }
  }

  // Get file details
  async getFileDetails(publicId, resourceType = 'image') {
    try {
      const response = await axios.get(`${API_BASE_URL}/cloudinary/details/${publicId}`, {
        params: { resourceType }
      });
      return response.data;
    } catch (error) {
      console.error('Cloudinary get file details error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get file details');
    }
  }

  // Delete a file from Cloudinary
  async deleteFile(publicId, resourceType = 'image') {
    try {
      const response = await axios.delete(`${API_BASE_URL}/cloudinary/file/${publicId}`, {
        params: { resourceType }
      });
      return response.data;
    } catch (error) {
      console.error('Cloudinary delete file error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete file');
    }
  }

  // Delete multiple files
  async deleteMultipleFiles(publicIds, resourceType = 'image') {
    try {
      const response = await axios.delete(`${API_BASE_URL}/cloudinary/files`, {
        params: { resourceType },
        data: { publicIds }
      });
      return response.data;
    } catch (error) {
      console.error('Cloudinary delete multiple files error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete files');
    }
  }

  // Generate signed URL for private files
  async generateSignedUrl(publicId, transformations = {}) {
    try {
      const response = await axios.post(`${API_BASE_URL}/cloudinary/signed-url`, {
        publicId,
        transformations
      });
      return response.data;
    } catch (error) {
      console.error('Cloudinary generate signed URL error:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate signed URL');
    }
  }

  // Transform image
  async transformImage(publicId, transformations = {}) {
    try {
      const response = await axios.post(`${API_BASE_URL}/cloudinary/transform`, {
        publicId,
        transformations
      });
      return response.data;
    } catch (error) {
      console.error('Cloudinary transform image error:', error);
      throw new Error(error.response?.data?.message || 'Failed to transform image');
    }
  }

  // Get upload configuration
  async getUploadConfig() {
    try {
      const response = await axios.get(`${API_BASE_URL}/cloudinary/upload-config`);
      return response.data;
    } catch (error) {
      console.error('Cloudinary get upload config error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get upload config');
    }
  }

  // Upload product image helper
  async uploadProductImage(file, productId) {
    return this.uploadFile(file, {
      folder: `ecommerce/products/${productId}`,
      resourceType: 'image',
      quality: 'auto',
      fetchFormat: 'auto'
    });
  }

  // Upload category image helper
  async uploadCategoryImage(file, categoryId) {
    return this.uploadFile(file, {
      folder: `ecommerce/categories/${categoryId}`,
      resourceType: 'image',
      quality: 'auto',
      fetchFormat: 'auto'
    });
  }

  // Upload user avatar helper
  async uploadUserAvatar(file, userId) {
    return this.uploadFile(file, {
      folder: `ecommerce/users/${userId}/avatar`,
      resourceType: 'image',
      quality: 'auto',
      fetchFormat: 'auto'
    });
  }

  // Upload blog image helper
  async uploadBlogImage(file, blogId) {
    return this.uploadFile(file, {
      folder: `ecommerce/blogs/${blogId}`,
      resourceType: 'image',
      quality: 'auto',
      fetchFormat: 'auto'
    });
  }

  // Transform image with common presets
  getThumbnailUrl(publicId, width = 200, height = 200) {
    return `https://res.cloudinary.com/image/upload/w_${width},h_${height},c_fill,q_auto/${publicId}`;
  }

  getOptimizedUrl(publicId) {
    return `https://res.cloudinary.com/image/upload/q_auto,f_auto/${publicId}`;
  }

  getResponsiveUrl(publicId, maxWidth = 1200) {
    return `https://res.cloudinary.com/image/upload/w_${maxWidth},c_limit,q_auto,f_auto/${publicId}`;
  }
}

export default new CloudinaryService();
