import { useState, useCallback } from 'react';
import cloudinaryService from '../services/cloudinaryService';

export const useCloudinary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(async (file, options = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await cloudinaryService.uploadFile(file, options);
      setProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadMultipleFiles = useCallback(async (files, options = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await cloudinaryService.uploadMultipleFiles(files, options);
      setProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const listFiles = useCallback(async (folder = 'ecommerce', options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await cloudinaryService.listFiles(folder, options);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFileDetails = useCallback(async (publicId, resourceType = 'image') => {
    setLoading(true);
    setError(null);

    try {
      const result = await cloudinaryService.getFileDetails(publicId, resourceType);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (publicId, resourceType = 'image') => {
    setLoading(true);
    setError(null);

    try {
      const result = await cloudinaryService.deleteFile(publicId, resourceType);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMultipleFiles = useCallback(async (publicIds, resourceType = 'image') => {
    setLoading(true);
    setError(null);

    try {
      const result = await cloudinaryService.deleteMultipleFiles(publicIds, resourceType);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateSignedUrl = useCallback(async (publicId, transformations = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await cloudinaryService.generateSignedUrl(publicId, transformations);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const transformImage = useCallback(async (publicId, transformations = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await cloudinaryService.transformImage(publicId, transformations);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadProductImage = useCallback(async (file, productId) => {
    return uploadFile(file, {
      folder: `ecommerce/products/${productId}`,
      resourceType: 'image',
      quality: 'auto',
      fetchFormat: 'auto'
    });
  }, [uploadFile]);

  const uploadCategoryImage = useCallback(async (file, categoryId) => {
    return uploadFile(file, {
      folder: `ecommerce/categories/${categoryId}`,
      resourceType: 'image',
      quality: 'auto',
      fetchFormat: 'auto'
    });
  }, [uploadFile]);

  const uploadUserAvatar = useCallback(async (file, userId) => {
    return uploadFile(file, {
      folder: `ecommerce/users/${userId}/avatar`,
      resourceType: 'image',
      quality: 'auto',
      fetchFormat: 'auto'
    });
  }, [uploadFile]);

  const uploadBlogImage = useCallback(async (file, blogId) => {
    return uploadFile(file, {
      folder: `ecommerce/blogs/${blogId}`,
      resourceType: 'image',
      quality: 'auto',
      fetchFormat: 'auto'
    });
  }, [uploadFile]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(0);
  }, []);

  return {
    loading,
    error,
    progress,
    uploadFile,
    uploadMultipleFiles,
    listFiles,
    getFileDetails,
    deleteFile,
    deleteMultipleFiles,
    generateSignedUrl,
    transformImage,
    uploadProductImage,
    uploadCategoryImage,
    uploadUserAvatar,
    uploadBlogImage,
    clearError,
    resetProgress
  };
};

export default useCloudinary;
