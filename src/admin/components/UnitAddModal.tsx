import { useState } from 'react';

interface Building {
  id: string;
  name: string;
}

interface Props {
  buildings: Building[];
  onClose: () => void;
  onSave: (unitData: any) => Promise<void>;
}

export default function UnitAddModal({ buildings, onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    building: '',
    floor: 0,
    size: 0,
    capacity: 0,
    price: 0,
    status: 'Available',
    condition: 'Bare',
    location: '',
    description: ''
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ctpred.com.ph';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    setError(null);

    try {
      const uploadedPaths: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 5MB`);
        }

        const formData = new FormData();
        formData.append('image', file);

        // IMPORTANT: Use query parameter for type
        const response = await fetch(`${API_BASE_URL}/api/uploads/single?type=units`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const data = await response.json();
        console.log('Unit image uploaded:', data);
        uploadedPaths.push(data.path);
      }

      setImages([...images, ...uploadedPaths]);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploadingFiles(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (index: number, imagePath: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/uploads`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: imagePath })
      });
      setImages(images.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Failed to delete image:', err);
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!formData.building) {
        setError('Please select a building');
        return;
      }
      if (!formData.title) {
        setError('Unit number/title is required');
        return;
      }
      if (formData.size <= 0) {
        setError('Unit size must be greater than 0');
        return;
      }
      if (formData.price <= 0) {
        setError('Price must be greater than 0');
        return;
      }

      const unitData = {
        id: `${formData.building.replace(/\s+/g, '-').toUpperCase()}-${formData.title.replace(/\s+/g, '-')}`,
        title: formData.title,
        building: formData.building,
        location: formData.location || '',
        floor: formData.floor,
        size: formData.size,
        capacity: formData.capacity,
        price: formData.price,
        status: formData.status,
        condition: formData.condition,
        image: images[0] || '/images/units/default.jpg',
        images: images.length > 0 ? images : ['/images/units/default.jpg'],
        description: formData.description || `Unit ${formData.title}`,
        floorPlan: {},
        availability: {}
      };

      await onSave(unitData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" style={{ animation: 'fadeIn 0.3s ease-out', backdropFilter: 'blur(4px)' }}>
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" style={{ animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-xl sticky top-0 z-10">
          <h3 className="text-xl font-bold text-white">Add New Unit</h3>
          <p className="text-sm text-red-100 mt-1">Create a new unit in a building</p>
        </div>
        
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">⚠️ {error}</p>
          </div>
        )}
        
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Building Selection</h4>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Building *</label>
              <select
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Select a building</option>
                {buildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Unit Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Number/Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 1501"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Floor * <span className="text-xs text-gray-500">(Floor 0 is Ground Floor)</span></label>
                  <input
                    type="number"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 15"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Size (sqm) *</label>
                  <input
                    type="number"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 50"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity (people)</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 20"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price per sqm (₱) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 1200"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., West Wing"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Brief description of the unit"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Unit Images</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Images</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 transition-colors">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-1 text-sm text-gray-600">
                          {uploadingFiles ? 'Uploading...' : 'Click to upload images'}
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP up to 5MB</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={loading || uploadingFiles}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">First image will be used as the main unit image</p>
              </div>

              {images.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({images.length})</p>
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={`${API_BASE_URL}${img}`}
                          alt={`Unit image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = '/images/units/default.jpg';
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500 text-white shadow-sm">
                              Main Image
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => handleRemoveImage(index, img)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                          disabled={loading}
                          title="Remove image"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Status & Condition</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="Available">Available</option>
                  <option value="Coming Soon">Coming Soon</option>
                  <option value="Taken">Taken</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="Bare">Bare</option>
                  <option value="Warm Shell">Warm Shell</option>
                  <option value="Fitted">Fitted</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-xl sticky bottom-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            disabled={loading || uploadingFiles}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || uploadingFiles}
          >
            {loading ? 'Adding...' : uploadingFiles ? 'Uploading...' : 'Add Unit'}
          </button>
        </div>
      </div>
    </div>
  );
}