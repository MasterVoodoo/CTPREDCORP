import { useState } from 'react';

interface Props {
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
}

export default function BuildingAddModal({ onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    display_name: '',
    location: '',
    short_location: '',
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
    cta_title: '',
    cta_description: '',
    hero_image: null as File | null,
    hero_image_preview: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
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
      alert('Building ID and Name are required');
      return;
    }

    const submitData = new FormData();
    
    // Basic fields
    submitData.append('id', formData.id);
    submitData.append('name', formData.name);
    submitData.append('display_name', formData.display_name || formData.name);
    submitData.append('location', formData.location);
    submitData.append('short_location', formData.short_location || formData.location);
    
    // Description
    submitData.append('description_paragraph_1', formData.description_paragraph_1);
    submitData.append('description_paragraph_2', formData.description_paragraph_2);
    submitData.append('description_paragraph_3', formData.description_paragraph_3);
    
    // Stats
    submitData.append('stats_total_floors', formData.stats_total_floors);
    submitData.append('stats_total_units', formData.stats_total_units);
    submitData.append('stats_occupancy_rate', formData.stats_occupancy_rate);
    submitData.append('stats_available_units', formData.stats_available_units);
    
    // Hours
    submitData.append('hours_weekdays', formData.hours_weekdays);
    submitData.append('hours_security', formData.hours_security);
    
    // Contact
    submitData.append('contact_phone', formData.contact_phone);
    submitData.append('contact_email', formData.contact_email);
    submitData.append('contact_address', formData.contact_address);
    
    // Image
    if (formData.hero_image) {
      submitData.append('hero_image', formData.hero_image);
    }
    
    // CTA
    submitData.append('badge', formData.badge);
    submitData.append('cta_title', formData.cta_title);
    submitData.append('cta_description', formData.cta_description);

    await onSave(submitData);
  };

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" style={{ animation: 'fadeIn 0.3s ease-out', backdropFilter: 'blur(4px)' }}>
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" style={{ animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-xl sticky top-0 z-10">
          <h3 className="text-xl font-bold text-white">Add New Building</h3>
          <p className="text-sm text-red-100 mt-1">Create a new building in your portfolio</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Building ID *</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., makati-skyscraper"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Building Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Makati Skyscraper"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Optional display name"
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
                  placeholder="e.g., Makati City, Metro Manila"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Short Location</label>
                <input
                  type="text"
                  value={formData.short_location}
                  onChange={(e) => setFormData({ ...formData, short_location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Makati CBD"
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 2</label>
                <textarea
                  value={formData.description_paragraph_2}
                  onChange={(e) => setFormData({ ...formData, description_paragraph_2: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 3</label>
                <textarea
                  value={formData.description_paragraph_3}
                  onChange={(e) => setFormData({ ...formData, description_paragraph_3: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  type="number"
                  value={formData.stats_total_floors}
                  onChange={(e) => setFormData({ ...formData, stats_total_floors: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="45"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Units</label>
                <input
                  type="number"
                  value={formData.stats_total_units}
                  onChange={(e) => setFormData({ ...formData, stats_total_units: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="200+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupancy Rate (%)</label>
                <input
                  type="number"
                  value={formData.stats_occupancy_rate}
                  onChange={(e) => setFormData({ ...formData, stats_occupancy_rate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="85"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Units</label>
                <input
                  type="number"
                  value={formData.stats_available_units}
                  onChange={(e) => setFormData({ ...formData, stats_available_units: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="30"
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
                  placeholder="8 AM - 6 PM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Security Hours</label>
                <input
                  type="text"
                  value={formData.hours_security}
                  onChange={(e) => setFormData({ ...formData, hours_security: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="24/7"
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
                  placeholder="(02) 1234-5678"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="info@building.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.contact_address}
                  onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Full address"
                />
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Hero Image</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {formData.hero_image_preview && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                  <img 
                    src={formData.hero_image_preview} 
                    alt="Hero preview" 
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
                  placeholder="Schedule a Tour"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Description</label>
                <textarea
                  value={formData.cta_description}
                  onChange={(e) => setFormData({ ...formData, cta_description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Visit us today to explore available spaces"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-xl sticky bottom-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
          >
            Add Building
          </button>
        </div>
      </div>
    </div>
  );
}