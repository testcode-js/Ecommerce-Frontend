import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class DropboxService {
  // Upload single file to Dropbox
  async uploadFile(file, folder = 'ecommerce-images') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', `/${folder}`);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/dropbox/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Dropbox upload error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
  }

  // Upload multiple files to Dropbox
  async uploadMultipleFiles(files, folder = 'ecommerce-images') {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('folder', `/${folder}`);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/dropbox/upload-multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Dropbox multiple upload error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload files');
    }
  }

  // List all files in a folder
  async listFiles(folder = 'ecommerce-images') {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/dropbox/list`, {
        params: { folder: `/${folder}` }
      });

      return response.data;
    } catch (error) {
      console.error('Dropbox list files error:', error);
      throw new Error(error.response?.data?.message || 'Failed to list files');
    }
  }

  // Get temporary link for a file
  async getFileLink(filePath) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/dropbox/link/${encodeURIComponent(filePath)}`);
      return response.data;
    } catch (error) {
      console.error('Dropbox get file link error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get file link');
    }
  }

  // Delete a file from Dropbox
  async deleteFile(filePath) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/dropbox/file/${encodeURIComponent(filePath)}`);
      return response.data;
    } catch (error) {
      console.error('Dropbox delete file error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete file');
    }
  }

  // Create a new folder
  async createFolder(folderPath) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/dropbox/folder`, {
        folderPath: `/${folderPath}`
      });
      return response.data;
    } catch (error) {
      console.error('Dropbox create folder error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create folder');
    }
  }

  // Upload product image helper
  async uploadProductImage(file, productId) {
    return this.uploadFile(file, `ecommerce-images/products/${productId}`);
  }

  // Upload category image helper
  async uploadCategoryImage(file, categoryId) {
    return this.uploadFile(file, `ecommerce-images/categories/${categoryId}`);
  }

  // Upload user avatar helper
  async uploadUserAvatar(file, userId) {
    return this.uploadFile(file, `ecommerce-images/users/${userId}/avatar`);
  }

  // Upload blog image helper
  async uploadBlogImage(file, blogId) {
    return this.uploadFile(file, `ecommerce-images/blogs/${blogId}`);
  }
}

export default new DropboxService();
