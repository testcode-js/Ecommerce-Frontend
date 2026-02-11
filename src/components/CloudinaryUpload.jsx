import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage, FiFile } from 'react-icons/fi';
import useCloudinary from '../hooks/useCloudinary';

const CloudinaryUpload = ({
  onUploadSuccess,
  onUploadError,
  multiple = false,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  folder = 'ecommerce',
  className = '',
  showPreview = true,
  buttonText = 'Upload Files',
  disabled = false,
  options = {}
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  
  const { uploadFile, uploadMultipleFiles, loading, progress, error, clearError } = useCloudinary();

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
        return false;
      }
      return true;
    });

    if (multiple) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    } else {
      setSelectedFiles(validFiles.slice(0, 1));
    }

    // Generate previews for images
    if (showPreview) {
      validFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviews(prev => [...prev, { name: file.name, url: e.target.result }]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      clearError();
      let result;

      const uploadOptions = {
        folder,
        resourceType: options.resourceType || 'auto',
        quality: options.quality || 'auto',
        fetchFormat: options.fetchFormat || 'auto',
        ...options
      };

      if (multiple && selectedFiles.length > 1) {
        result = await uploadMultipleFiles(selectedFiles, uploadOptions);
      } else {
        result = await uploadFile(selectedFiles[0], uploadOptions);
      }

      if (onUploadSuccess) {
        onUploadSuccess(result);
      }

      // Reset after successful upload
      setSelectedFiles([]);
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      if (onUploadError) {
        onUploadError(err);
      }
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`cloudinary-upload ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
        
        <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600 mb-2">
          {dragActive ? 'Drop files here' : buttonText}
        </p>
        <p className="text-sm text-gray-500">
          or click to select files
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Max file size: {formatFileSize(maxSize)}
        </p>
      </div>

      {/* File Previews */}
      {showPreview && previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview.url}
                alt={preview.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={loading}
              >
                <FiX className="h-4 w-4" />
              </button>
              <p className="text-xs text-gray-600 mt-1 truncate">{preview.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center space-x-2">
                  {file.type.startsWith('image/') ? (
                    <FiImage className="h-4 w-4 text-gray-500" />
                  ) : (
                    <FiFile className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={loading}
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleUpload}
            disabled={loading || disabled}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? `Uploading... ${progress}%` : `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {loading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
