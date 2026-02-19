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
    cta_description: building.cta_description || ''
  });

  const [heroImage, setHeroImage] = useState<string>(building.hero_image || '');
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ctpred.com.ph';

  useEffect(() => {
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

    if (building.building_hours) {
      const hours = typeof building.building_hours === 'string' ? JSON.parse(building.building_hours) : building.building_hours;
      setFormData(prev => ({
        ...prev,
        hours_weekdays: hours.weekdays || '',
        hours_security: hours.security || ''
      }));
    }

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file is too large. Maximum size is 5MB');
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      // IMPORTANT: Use query parameter for type
      const response = await fetch(`${API_BASE_URL}/api/uploads/single?type=buildings`, {
        method: 'POST',
        body: uploadFormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      console.log('Building image uploaded:', data);
      setHeroImage(data.path);
      setHeroImagePreview(`${API_BASE_URL}${data.path}`);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveNewImage = async () => {
    if (heroImage && heroImage !== building.hero_image) {
      try {
        await fetch(`${API_BASE_URL}/api/uploads`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: heroImage })
        });
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }
    setHeroImage(building.hero_image || '');
    setHeroImagePreview('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const description = [
        formData.description_paragraph_1,
        formData.description_paragraph_2,
        formData.description_paragraph_3
      ].filter(p => p.trim());

      const stats = {
        totalFloors: formData.stats_total_floors,
        totalUnits: formData.stats_total_units,
        occupancyRate: formData.stats_occupancy_rate,
        availableUnits: formData.stats_available_units
      };

      const buildingHours = {
        weekdays: formData.hours_weekdays,
        security: formData.hours_security
      };

      const contact = {
        phone: formData.contact_phone,
        email: formData.contact_email,
        address: formData.contact_address
      };

      const buildingData = {
        name: formData.name,
        displayName: formData.display_name || formData.name,
        location: formData.location,
        shortLocation: formData.short_location || formData.location,
        description: description,
        stats: stats,
        buildingHours: buildingHours,
        contact: contact,
        heroImage: heroImage,
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
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Building ID</label>
                <input type="text" value={formData.id} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Building Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                <input type="text" value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Badge</label>
                <input type="text" value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Premium Location" disabled={loading} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Location</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Location</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Floor Levels</label>
                <input type="text" value={formData.short_location} onChange={(e) => setFormData({ ...formData, short_location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Description</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 1</label>
                <textarea value={formData.description_paragraph_1} onChange={(e) => setFormData({ ...formData, description_paragraph_1: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 2</label>
                <textarea value={formData.description_paragraph_2} onChange={(e) => setFormData({ ...formData, description_paragraph_2: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 3</label>
                <textarea value={formData.description_paragraph_3} onChange={(e) => setFormData({ ...formData, description_paragraph_3: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Building Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors</label>
                <input type="text" value={formData.stats_total_floors} onChange={(e) => setFormData({ ...formData, stats_total_floors: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Units</label>
                <input type="text" value={formData.stats_total_units} onChange={(e) => setFormData({ ...formData, stats_total_units: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupancy Rate (%)</label>
                <input type="text" value={formData.stats_occupancy_rate} onChange={(e) => setFormData({ ...formData, stats_occupancy_rate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Units</label>
                <input type="text" value={formData.stats_available_units} onChange={(e) => setFormData({ ...formData, stats_available_units: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Building Hours</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekday Hours</label>
                <input type="text" value={formData.hours_weekdays} onChange={(e) => setFormData({ ...formData, hours_weekdays: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Security Hours</label>
                <input type="text" value={formData.hours_security} onChange={(e) => setFormData({ ...formData, hours_security: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input type="text" value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input type="text" value={formData.contact_address} onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Hero Image</h4>
            <div className="space-y-4">
              {building.hero_image && !heroImagePreview && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img src={building.hero_image.startsWith('http') ? building.hero_image : `${API_BASE_URL}${building.hero_image}`} alt="Current hero" className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300" />
                </div>
              )}
              
              {heroImagePreview && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">New Image:</p>
                    <button onClick={handleRemoveNewImage} className="text-sm text-red-600 hover:text-red-700" disabled={loading}>Remove new image</button>
                  </div>
                  <img src={heroImagePreview} alt="New hero preview" className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{heroImagePreview ? 'Upload Different Image' : 'Upload New Image (Optional)'}</label>
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 transition-colors">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">{uploadingImage ? 'Uploading...' : 'Click to upload image'}</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP up to 5MB</p>
                    </div>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={loading || uploadingImage} />
                </label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Call-to-Action</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Title</label>
                <input type="text" value={formData.cta_title} onChange={(e) => setFormData({ ...formData, cta_title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Description</label>
                <textarea value={formData.cta_description} onChange={(e) => setFormData({ ...formData, cta_description: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={loading} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-xl sticky bottom-0">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors" disabled={loading || uploadingImage}>Cancel</button>
          <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading || uploadingImage}>
            {loading ? 'Saving...' : uploadingImage ? 'Uploading...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}