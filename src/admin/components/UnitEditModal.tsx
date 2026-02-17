import { useState, useEffect } from 'react';

interface Unit {
  id: string;
  title: string;
  building: string;
  floor: number;
  size: number;
  capacity: number;
  price: number;
  status: string;
  condition: string;
  location?: string;
  description?: string;
  image?: string;
  images?: string[];
}

interface Props {
  unit: Unit;
  onClose: () => void;
  onSave: (unitData: any) => Promise<void>;
}

export default function UnitEditModal({ unit, onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    title: unit.title,
    building: unit.building,
    floor: unit.floor,
    size: unit.size,
    capacity: unit.capacity || 0,
    price: unit.price,
    status: unit.status,
    condition: unit.condition,
    location: unit.location || '',
    description: unit.description || ''
  });

  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Parse existing images
    if (unit.images && Array.isArray(unit.images)) {
      setImages(unit.images);
    } else if (unit.images && typeof unit.images === 'string') {
      try {
        const parsed = JSON.parse(unit.images);
        setImages(Array.isArray(parsed) ? parsed : []);
      } catch {
        setImages([]);
      }
    } else if (unit.image) {
      setImages([unit.image]);
    }
  }, [unit]);

  const handleAddImage = () => {
    if (!imageInput.trim()) {
      setError('Please enter an image URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(imageInput);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setImages([...images, imageInput.trim()]);
    setImageInput('');
    setError(null);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
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
        title: formData.title,
        building: formData.building,
        location: formData.location,
        floor: formData.floor,
        size: formData.size,
        capacity: formData.capacity,
        price: formData.price,
        status: formData.status,
        condition: formData.condition,
        image: images[0] || unit.image || '/images/units/default.jpg',
        images: images.length > 0 ? images : ['/images/units/default.jpg'],
        description: formData.description || `Unit ${formData.title}`,
        floorPlan: {},
        availability: {}
      };

      await onSave(unitData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" style={{ animation: 'fadeIn 0.3s ease-out', backdropFilter: 'blur(4px)' }}>
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" style={{ animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-xl sticky top-0 z-10">
          <h3 className="text-xl font-bold text-white">Edit Unit: {unit.id}</h3>
          <p className="text-sm text-red-100 mt-1">Update unit information</p>
        </div>
        
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">⚠️ {error}</p>
          </div>
        )}
        
        <div className="p-6 space-y-6">
          {/* Unit Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Unit Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Building</label>
                <input
                  type="text"
                  value={formData.building}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Floor *</label>
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

          {/* Unit Images */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Unit Images</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Add Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                    disabled={loading}
                  />
                  <button
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">First image will be used as the main unit image</p>
              </div>

              {images.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Images ({images.length})</p>
                  <div className="space-y-2">
                    {images.map((img, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <img
                          src={img}
                          alt={`Unit preview ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/images/units/default.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 truncate">{img}</p>
                          {index === 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Main Image
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded font-medium transition-colors"
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status & Condition */}
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
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}