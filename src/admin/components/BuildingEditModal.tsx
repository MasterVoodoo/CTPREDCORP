import { useState, useEffect } from 'react';

interface Building {
  id: string;
  name: string;
  display_name?: string;
  location?: string;
  short_location?: string;
  description?: string | string[];
  stats?: any;
  building_hours?: any;
  contact?: any;
  hero_image?: string;
  badge?: string;
  cta_title?: string;
  cta_description?: string;
}

interface Props {
  building: Building;
  onClose: () => void;
  onSave: (buildingData: any) => Promise<void>;
}

export default function BuildingEditModal({ building, onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    id: building.id,
    name: building.name,
    display_name: building.display_name || building.name,
    location: building.location || '',
    short_location: building.short_location || '',
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
    badge: building.badge || '',
    cta_title: building.cta_title || '',
    cta_description: building.cta_description || '',
    hero_image: null as File | null,
    hero_image_preview: '',
    keep_current_image: true
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Parse description array
    if (building.description) {
      const desc = Array.isArray(building.description) 
        ? building.description 
        : typeof building.description === 'string'
          ? JSON.parse(building.description)
          : [];
      
      setFormData(prev => ({
        ...prev,
        description_paragraph_1: desc[0] || '',
        description_paragraph_2: desc[1] || '',
        description_paragraph_3: desc[2] || ''
      }));
    }

    // Parse stats
    if (building.stats) {
      const stats = typeof building.stats === 'string' ? JSON.parse(building.stats) : building.stats;
      setFormData(prev => ({
        ...prev,
        stats_total_floors: String(stats.totalFloors || ''),
        stats_total_units: String(stats.totalUnits || ''),
        stats_occupancy_rate: String(stats.occupancyRate || ''),
        stats_available_units: String(stats.availableUnits || '')
      }));
    }

    // Parse building hours
    if (building.building_hours) {
      const hours = typeof building.building_hours === 'string' ? JSON.parse(building.building_hours) : building.building_hours;
      setFormData(prev => ({
        ...prev,
        hours_weekdays: hours.weekdays || '',
        hours_security: hours.security || ''
      }));
    }

    // Parse contact
    if (building.contact) {
      const contact = typeof building.contact === 'string' ? JSON.parse(building.contact) : building.contact;
      setFormData(prev => ({
        ...prev,
        contact_phone: contact.phone || '',
        contact_email: contact.email || '',
        contact_address: contact.address || ''
      }));
    }
  }, [building]);

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
        hero_image_preview: previewUrl,
        keep_current_image: false
      }));
    }
  };

  const handleSubmit = async () => {
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

      // Create the building data object - send as JSON like the add modal
      const buildingData = {
        name: formData.name,
        displayName: formData.display_name || formData.name,
        location: formData.location,
        shortLocation: formData.short_location || formData.location,
        description: description,
        stats: stats,
        buildingHours: buildingHours,
        contact: contact,
        heroImage: formData.keep_current_image ? building.hero_image : (formData.hero_image_preview || ''),
        badge: formData.badge,
        ctaTitle: formData.cta_title,
        ctaDescription: formData.cta_description,
        buildingFeatures: [],
        floorPlans: []
      };

      await onSave(buildingData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update building');
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
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" style={{ animation: 'fadeIn 0.3s ease-out', backdropFilter: 'blur(4px)' }}>
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" style={{ animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-xl sticky top-0 z-10">
          <h3 className="text-xl font-bold text-white">Edit Building: {building.name}</h3>
          <p className="text-sm text-red-100 mt-1">Update building information</p>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">⚠️ {error}</p>
          </div>
        )}
        
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Building ID</label>
                <input
                  type="text"
                  value={formData.id}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Building Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Badge</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Premium Location"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Location</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Short Location</label>
                <input
                  type="text"
                  value={formData.short_location}
                  onChange={(e) => setFormData({ ...formData, short_location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Description</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 1</label>
                <textarea
                  value={formData.description_paragraph_1}
                  onChange={(e) => setFormData({ ...formData, description_paragraph_1: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 2</label>
                <textarea
                  value={formData.description_paragraph_2}
                  onChange={(e) => setFormData({ ...formData, description_paragraph_2: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 3</label>
                <textarea
                  value={formData.description_paragraph_3}
                  onChange={(e) => setFormData({ ...formData, description_paragraph_3: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Building Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors</label>
                <input
                  type="text"
                  value={formData.stats_total_floors}
                  onChange={(e) => setFormData({ ...formData, stats_total_floors: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Units</label>
                <input
                  type="text"
                  value={formData.stats_total_units}
                  onChange={(e) => setFormData({ ...formData, stats_total_units: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupancy Rate (%)</label>
                <input
                  type="text"
                  value={formData.stats_occupancy_rate}
                  onChange={(e) => setFormData({ ...formData, stats_occupancy_rate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Units</label>
                <input
                  type="text"
                  value={formData.stats_available_units}
                  onChange={(e) => setFormData({ ...formData, stats_available_units: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Building Hours */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Building Hours</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekday Hours</label>
                <input
                  type="text"
                  value={formData.hours_weekdays}
                  onChange={(e) => setFormData({ ...formData, hours_weekdays: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Security Hours</label>
                <input
                  type="text"
                  value={formData.hours_security}
                  onChange={(e) => setFormData({ ...formData, hours_security: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.contact_address}
                  onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Hero Image</h4>
            <div className="space-y-4">
              {building.hero_image && formData.keep_current_image && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img 
                    src={building.hero_image} 
                    alt="Current hero" 
                    className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload New Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {formData.hero_image_preview && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                  <img 
                    src={formData.hero_image_preview} 
                    alt="New hero preview" 
                    className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Call-to-Action */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Call-to-Action</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Title</label>
                <input
                  type="text"
                  value={formData.cta_title}
                  onChange={(e) => setFormData({ ...formData, cta_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Description</label>
                <textarea
                  value={formData.cta_description}
                  onChange={(e) => setFormData({ ...formData, cta_description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-xl sticky bottom-0">
          <button
            onClick={handleClose}
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