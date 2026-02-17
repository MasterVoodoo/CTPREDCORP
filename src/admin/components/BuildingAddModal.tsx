import { useState } from 'react';

interface BuildingAddModalProps {
  onClose: () => void;
  onSave: (buildingData: any) => Promise<void>;
}

export default function BuildingAddModal({ onClose, onSave }: BuildingAddModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    displayName: '',
    location: '',
    shortLocation: '',
    description_paragraph_1: '',
    description_paragraph_2: '',
    description_paragraph_3: '',
    stats_total_floors: '',
    stats_total_units: '',
    stats_occupancy_rate: '',
    stats_available_units: '',
    hours_weekdays: '',
    hours_security: '',
    contact_phone: '',
    contact_email: '',
    contact_address: '',
    badge: '',
    ctaTitle: '',
    ctaDescription: '',
    hero_image: null as File | null,
    hero_image_preview: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        hero_image: file,
        hero_image_preview: previewUrl
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.id || !formData.name) {
      setError('Building ID and name are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create description array from paragraphs
      const description = [
        formData.description_paragraph_1,
        formData.description_paragraph_2,
        formData.description_paragraph_3
      ].filter(p => p.trim());

      // Create stats object
      const stats = {
        totalFloors: formData.stats_total_floors,
        totalUnits: formData.stats_total_units,
        occupancyRate: formData.stats_occupancy_rate,
        availableUnits: formData.stats_available_units
      };

      // Create hours object
      const buildingHours = {
        weekdays: formData.hours_weekdays,
        security: formData.hours_security
      };

      // Create contact object
      const contact = {
        phone: formData.contact_phone,
        email: formData.contact_email,
        address: formData.contact_address
      };

      // Create the building data object - pass directly as JSON
      const buildingData = {
        id: formData.id,
        name: formData.name,
        displayName: formData.displayName || formData.name,
        location: formData.location,
        shortLocation: formData.shortLocation || formData.location,
        description: description,
        stats: stats,
        buildingHours: buildingHours,
        contact: contact,
        heroImage: formData.hero_image_preview || '',
        badge: formData.badge,
        ctaTitle: formData.ctaTitle,
        ctaDescription: formData.ctaDescription,
        buildingFeatures: [],
        floorPlans: []
      };

      await onSave(buildingData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add building');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (formData.hero_image_preview) {
      URL.revokeObjectURL(formData.hero_image_preview);
    }
    onClose();
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 z-10 border-b border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Add New Building</h3>
              <p className="text-sm text-red-100 mt-1">Create a new building in your portfolio</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-red-100 transition-colors"
              disabled={loading}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">⚠️ {error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Building ID *</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => handleChange('id', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., makati-skyscraper"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Building Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Makati Skyscraper"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Optional display name"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Badge</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => handleChange('badge', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., New Listing"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Location</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Makati City, Metro Manila"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Short Location</label>
                <input
                  type="text"
                  value={formData.shortLocation}
                  onChange={(e) => handleChange('shortLocation', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Makati CBD"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Description</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Paragraph 1</label>
                <textarea
                  value={formData.description_paragraph_1}
                  onChange={(e) => handleChange('description_paragraph_1', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={2}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Paragraph 2</label>
                <textarea
                  value={formData.description_paragraph_2}
                  onChange={(e) => handleChange('description_paragraph_2', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={2}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Paragraph 3</label>
                <textarea
                  value={formData.description_paragraph_3}
                  onChange={(e) => handleChange('description_paragraph_3', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={2}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Building Statistics */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Building Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Floors</label>
                <input
                  type="text"
                  value={formData.stats_total_floors}
                  onChange={(e) => handleChange('stats_total_floors', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 45"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Units</label>
                <input
                  type="text"
                  value={formData.stats_total_units}
                  onChange={(e) => handleChange('stats_total_units', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 200+"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Occupancy Rate</label>
                <input
                  type="text"
                  value={formData.stats_occupancy_rate}
                  onChange={(e) => handleChange('stats_occupancy_rate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 85"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Available Units</label>
                <input
                  type="text"
                  value={formData.stats_available_units}
                  onChange={(e) => handleChange('stats_available_units', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 30"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Building Hours */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Building Hours</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Weekdays</label>
                <input
                  type="text"
                  value={formData.hours_weekdays}
                  onChange={(e) => handleChange('hours_weekdays', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 8 AM - 6 PM"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Security</label>
                <input
                  type="text"
                  value={formData.hours_security}
                  onChange={(e) => handleChange('hours_security', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 24/7"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Contact Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., (02) 1234-5678"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., info@building.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.contact_address}
                  onChange={(e) => handleChange('contact_address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={2}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Hero Image</h4>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={loading}
              />
              {formData.hero_image_preview && (
                <div className="mt-4">
                  <img
                    src={formData.hero_image_preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Call-to-Action */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Call-to-Action</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Title</label>
                <input
                  type="text"
                  value={formData.ctaTitle}
                  onChange={(e) => handleChange('ctaTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Schedule a Tour"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Description</label>
                <textarea
                  value={formData.ctaDescription}
                  onChange={(e) => handleChange('ctaDescription', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={2}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Building'}
          </button>
        </div>
      </div>
    </div>
  );
}