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
    location: ''
  });

  const handleSubmit = async () => {
    if (!formData.building) {
      alert('Please select a building');
      return;
    }
    if (!formData.title) {
      alert('Unit number/title is required');
      return;
    }

    const unitData = {
      ...formData,
      id: `${formData.building.replace(/\s+/g, '-').toUpperCase()}-${formData.title.replace(/\s+/g, '-')}`,
      image: '/images/units/default.jpg',
      images: JSON.stringify(['/images/units/default.jpg']),
      description: `Unit ${formData.title}`,
      floorPlan: {},
      availability: {}
    };

    await onSave(unitData);
  };

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" style={{ animation: 'fadeIn 0.3s ease-out', backdropFilter: 'blur(4px)' }}>
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-2xl" style={{ animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-xl">
          <h3 className="text-xl font-bold text-white">Add New Unit</h3>
          <p className="text-sm text-red-100 mt-1">Create a new unit in a building</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Building Selection */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Building Selection</h4>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Building *</label>
              <select
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

          {/* Unit Information */}
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
                  />
                </div>
              </div>
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
                >
                  <option value="Bare">Bare</option>
                  <option value="Warm Shell">Warm Shell</option>
                  <option value="Fitted">Fitted</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-xl">
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
            Add Unit
          </button>
        </div>
      </div>
    </div>
  );
}