import React, { useState } from 'react';
import CloudinaryUpload from '../components/CloudinaryUpload';
import cloudinaryService from '../services/cloudinaryService';

const TestCloudinary = () => {
  const [uploadResult, setUploadResult] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadSuccess = (result) => {
    console.log('Upload successful:', result);
    setUploadResult(result);
    setError(null);
  };

  const handleUploadError = (error) => {
    console.error('Upload failed:', error);
    setError(error.message);
    setUploadResult(null);
  };

  const testListFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await cloudinaryService.listFiles('ecommerce');
      console.log('Files list:', result);
      setFiles(result.data?.files || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await cloudinaryService.getUploadConfig();
      console.log('Config:', result);
      alert('Config: ' + JSON.stringify(result, null, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Cloudinary Test</h1>
      
      {/* Test Upload Component */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Upload</h2>
        <CloudinaryUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          multiple={true}
          folder="test-uploads"
        />
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Upload Successful!</h3>
          <pre className="text-sm text-green-700 overflow-auto">
            {JSON.stringify(uploadResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Test Buttons */}
      <div className="mb-8 space-x-4">
        <button
          onClick={testListFiles}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'List Files'}
        </button>
        <button
          onClick={testGetConfig}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Config'}
        </button>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Files in Cloudinary:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="border rounded-lg p-4">
                {file.resource_type === 'image' && (
                  <img
                    src={file.secure_url}
                    alt={file.public_id}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />
                )}
                <p className="text-sm font-medium truncate">{file.public_id}</p>
                <p className="text-xs text-gray-500">{file.format} • {file.bytes} bytes</p>
                <a
                  href={file.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  View File
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCloudinary;
