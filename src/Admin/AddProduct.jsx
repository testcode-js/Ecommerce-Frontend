import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBox, FaStar } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';
import CloudinaryUpload from '../components/CloudinaryUpload';
import useCloudinary from '../hooks/useCloudinary';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

const AddProduct = () => {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    category: '',
    brand: '',
    stock: '',
    isFeatured: false,
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [useCloudinaryUpload, setUseCloudinaryUpload] = useState(true);
  
  const { uploadProductImage, uploadMultipleFiles } = useCloudinary();

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products?limit=100');
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (mainImagePreview && typeof mainImagePreview === 'string' && mainImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(mainImagePreview);
    }
    
    // Clear old previews
    imagePreviews.forEach(preview => {
      if (preview && typeof preview === 'string' && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });

    setMainImage(files[0] || null);
    setImages(files.slice(1) || []);
    setRemoveImage(false);

    if (files[0]) {
      setMainImagePreview(URL.createObjectURL(files[0]));
    } else {
      setMainImagePreview(null);
    }

    if (files.length > 1) {
      const newPreviews = files.slice(1).map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    } else {
      setImagePreviews([]);
    }
  };

  const handleRemoveImage = () => {
    if (mainImagePreview && typeof mainImagePreview === 'string' && mainImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(mainImagePreview);
    }
    
    imagePreviews.forEach(preview => {
      if (preview && typeof preview === 'string' && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });

    setMainImage(null);
    setImages([]);
    setMainImagePreview(null);
    setImagePreviews([]);
    setRemoveImage(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAdditionalImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke the blob URL for the removed image
    if (imagePreviews[index] && typeof imagePreviews[index] === 'string' && imagePreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  useEffect(() => {
    return () => {
      if (mainImagePreview && typeof mainImagePreview === 'string' && mainImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(mainImagePreview);
      }
      imagePreviews.forEach(preview => {
        if (preview && typeof preview === 'string' && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [mainImagePreview, imagePreviews]);

  const resetForm = () => {
    setForm({
      name: '',
      price: '',
      originalPrice: '',
      description: '',
      category: '',
      brand: '',
      stock: '',
      isFeatured: false,
    });
    setMainImage(null);
    setImages([]);
    setMainImagePreview(null);
    setImagePreviews([]);
    setRemoveImage(false);
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let mainImageUrl = null;
      let additionalImageUrls = [];
      
      // Handle main image upload
      if (mainImage) {
        if (typeof mainImage === 'string' && mainImage.startsWith('http')) {
           // It's already a URL (e.g. from existing product or direct set)
           mainImageUrl = mainImage;
        } else if (mainImage.secure_url || mainImage.url) {
           // It's a Cloudinary result object
           mainImageUrl = mainImage.secure_url || mainImage.url;
        } else if (mainImage.data && (mainImage.data.secure_url || mainImage.data.url)) {
           // It's a wrapped Cloudinary result
           mainImageUrl = mainImage.data.secure_url || mainImage.data.url;
        } else if (useCloudinaryUpload && mainImage instanceof File) {
             // File object in Cloudinary mode - try to upload if not already
             const tempProductId = editingId || 'temp-' + Date.now();
             try {
                const uploadResult = await uploadProductImage(mainImage, tempProductId);
                const resultData = uploadResult.data || uploadResult;
                mainImageUrl = resultData.secure_url || resultData.url;
             } catch (uploadErr) {
                console.error('Failed to upload main image fallback:', uploadErr);
             }
        } else if (!useCloudinaryUpload && mainImage instanceof File) {
           // Traditional upload
           const formData = new FormData();
           formData.append('image', mainImage);
           const uploadResponse = await API.post('/cloudinary/upload', formData, {
             headers: { 'Content-Type': 'multipart/form-data' },
           });
           mainImageUrl = uploadResponse.data.data.url;
        }
      }

      // Handle additional images upload
      if (images.length > 0) {
          const processedImages = await Promise.all(images.map(async (img) => {
              if (typeof img === 'string' && img.startsWith('http')) return img;
              if (img.secure_url || img.url) return img.secure_url || img.url;
              if (img.data && (img.data.secure_url || img.data.url)) return img.data.secure_url || img.data.url;
              
              if (!useCloudinaryUpload && img instanceof File) {
                  const formData = new FormData();
                  formData.append('images', img);
                  // We'd need a single file upload endpoint or handle bulk differently
                  // For now assuming existing logic for bulk:
                  return null; 
              }
              return null;
          }));

          // If using traditional bulk upload for Files
          const filesToUpload = images.filter(img => img instanceof File && !useCloudinaryUpload);
          if (filesToUpload.length > 0) {
              const formData = new FormData();
              filesToUpload.forEach((image) => {
                formData.append(`images`, image);
              });
              const uploadResponse = await API.post('/cloudinary/upload-multiple', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });
              const uploadedUrls = uploadResponse.data.data.files.map(file => file.url);
              additionalImageUrls = [...processedImages.filter(Boolean), ...uploadedUrls];
          } else {
              additionalImageUrls = processedImages.filter(Boolean);
          }
      }

      // Prepare product data
      const productData = {
        name: form.name,
        price: form.price,
        originalPrice: form.originalPrice,
        description: form.description,
        category: form.category,
        brand: form.brand,
        stock: form.stock || 0,
        isFeatured: form.isFeatured,
        image: mainImageUrl,
        images: additionalImageUrls
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, productData);
        alert('Product updated successfully');
      } else {
        await API.post('/products', productData);
        alert('Product added successfully');
      }
      
      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloudinaryUploadSuccess = (result) => {
    // Handle single image upload (for main image)
    if (result.data && !Array.isArray(result.data)) {
      const url = result.data.secure_url || result.data.url;
      setMainImage(url);
      setMainImagePreview(url);
    }
    setRemoveImage(false);
  };

  const handleMultipleCloudinaryUploadSuccess = (result) => {
    // Handle multiple images upload
    if (result.data && result.data.files && Array.isArray(result.data.files)) {
      const newImages = result.data.files.map(file => ({
        file: null, // We'll need to handle this differently
        url: file.secure_url || file.url,
        publicId: file.publicId
      }));
      setImages(prev => [...prev, ...newImages]);
      const newPreviews = result.data.files.map(file => file.url);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleCloudinaryUploadError = (error) => {
    alert(`Upload failed: ${error}`);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || '',
      description: product.description || '',
      category: typeof product.category === 'object' ? product.category._id : product.category || '',
      brand: product.brand || '',
      stock: product.stock || 0,
      isFeatured: product.isFeatured || false,
    });
    setEditingId(product._id);
    setMainImage(product.image || null);
    setImages(product.images || []);
    setMainImagePreview(product.image ? (product.image.startsWith('http') ? product.image : `${UPLOADS_URL}/${product.image}`) : null);
    setImagePreviews(product.images && product.images.length > 0 ? product.images.map(img => img.startsWith('http') ? img : `${UPLOADS_URL}/${img}`) : []);
    setRemoveImage(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await API.delete(`/products/${id}`);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const getCategoryName = (category) => {
    if (typeof category === 'object') return category?.name || 'N/A';
    const cat = categories.find((c) => c._id === category);
    return cat ? cat.name : 'N/A';
  };

  if (loading) return <Loading message="Loading products..." />;

  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* Add/Edit Form */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                {editingId ? <><FaEdit className="me-2" />Edit Product</> : <><FaPlus className="me-2" />Add Product</>}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product Images {editingId && '(optional)'}</label>
                  
                  {/* Upload Method Toggle */}
                  <div className="btn-group w-100 mb-2" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="uploadMethod"
                      id="cloudinaryMethod"
                      checked={useCloudinaryUpload}
                      onChange={() => setUseCloudinaryUpload(true)}
                    />
                    <label className="btn btn-outline-primary" htmlFor="cloudinaryMethod">
                      Cloudinary Upload
                    </label>
                    
                    <input
                      type="radio"
                      className="btn-check"
                      name="uploadMethod"
                      id="traditionalMethod"
                      checked={!useCloudinaryUpload}
                      onChange={() => setUseCloudinaryUpload(false)}
                    />
                    <label className="btn btn-outline-secondary" htmlFor="traditionalMethod">
                      Traditional Upload
                    </label>
                  </div>

                  {useCloudinaryUpload ? (
                    /* Cloudinary Upload Components */
                    <div className="space-y-3">
                      {/* Main Image Upload */}
                      <div>
                        <h6 className="mb-2">Main Image (First image will be used as thumbnail)</h6>
                        <CloudinaryUpload
                          onUploadSuccess={handleCloudinaryUploadSuccess}
                          onUploadError={handleCloudinaryUploadError}
                          multiple={false}
                          accept="image/*"
                          maxSize={5 * 1024 * 1024} // 5MB
                          folder="ecommerce/products"
                          buttonText="Choose Main Image"
                          showPreview={false}
                        />
                      </div>
                      
                      {/* Additional Images Upload */}
                      <div>
                        <h6 className="mb-2">Additional Images</h6>
                        <CloudinaryUpload
                          onUploadSuccess={handleMultipleCloudinaryUploadSuccess}
                          onUploadError={handleCloudinaryUploadError}
                          multiple={true}
                          accept="image/*"
                          maxSize={5 * 1024 * 1024} // 5MB
                          folder="ecommerce/products"
                          buttonText="Choose Additional Images"
                          showPreview={false}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Traditional File Input */
                    <input
                      type="file"
                      className="form-control"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                      {...(!editingId && { required: true })}
                    />
                  )}

                  {/* Main Image Preview */}
                  {mainImagePreview && (
                    <div className="mt-3">
                      <h6>Main Image</h6>
                      <div className="d-flex align-items-start gap-2">
                        <img src={mainImagePreview} alt="Main preview" className="img-thumbnail" style={{ height: '120px' }} />
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleRemoveImage}>
                          Remove All
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Additional Images Preview */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-3">
                      <h6>Additional Images ({imagePreviews.length})</h6>
                      <div className="row g-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="col-md-3 col-sm-4 col-6">
                            <div className="position-relative">
                              <img 
                                src={preview} 
                                alt={`Additional ${index + 1}`} 
                                className="img-thumbnail w-100" 
                                style={{ height: '100px', objectFit: 'cover' }} 
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-1"
                                onClick={() => handleRemoveAdditionalImage(index)}
                                style={{ fontSize: '0.7rem' }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      min="0"
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">Original Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                      min="0"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label">Brand *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">Stock *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isFeatured"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="isFeatured">
                    <FaStar className="text-warning me-1" />
                    Featured Product
                  </label>
                </div>

                <div className="d-flex gap-2">
                  <Button type="submit" title={editingId ? 'Update Product' : 'Add Product'} disabled={submitting} />
                  {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="col-lg-8">
          <h4 className="mb-3">
            <FaBox className="me-2" />
            All Products ({products.length})
          </h4>

          <div className="row">
            {products.map((p) => (
              <div key={p._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="position-relative">
                    {p.isFeatured && (
                      <span className="badge bg-warning position-absolute" style={{ top: 10, right: 10 }}>
                        <FaStar /> Featured
                      </span>
                    )}
                    <img
                      src={
                        p.image 
                          ? (p.image.startsWith('http') ? p.image : `${UPLOADS_URL}/${p.image}`) 
                          : 'https://placehold.co/200'
                      }
                      alt={p.name}
                      className="card-img-top"
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">{p.name}</h6>
                    <p className="text-muted small mb-1">Brand: {p.brand || 'N/A'}</p>
                    <p className="text-muted small mb-1">Category: {getCategoryName(p.category)}</p>
                    <p className="text-muted small mb-2">Stock: {p.stock || 0}</p>
                    <div className="mb-2">
                      <span className="fw-bold text-primary">₹{p.price}</span>
                      {p.originalPrice > p.price && (
                        <span className="text-muted text-decoration-line-through ms-2 small">₹{p.originalPrice}</span>
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary flex-grow-1" onClick={() => handleEdit(p)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
