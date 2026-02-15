import { useState, useEffect } from 'react';

interface Building {
  id: string;
  name: string;
  totalUnits: number;
  availableUnits: number;
}

interface Unit {
  id: string;
  unitNumber: string;
  floor: number;
  size: number;
  pricePerSqm: number;
  status: string;
  condition: string;
}

interface NewUnit {
  title: string;
  floor: number;
  size: number;
  capacity: number;
  price: number;
  status: string;
  condition: string;
  location: string;
}

export default function PropertyManagement() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUnit, setNewUnit] = useState<NewUnit>({
    title: '',
    floor: 0,
    size: 0,
    capacity: 0,
    price: 0,
    status: 'Available',
    condition: 'Bare',
    location: ''
  });

  useEffect(() => {
    loadBuildings();
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      loadUnits(selectedBuilding);
    }
  }, [selectedBuilding]);

  const loadBuildings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/buildings');
      if (!response.ok) throw new Error('Failed to load buildings');
      const data = await response.json();
      setBuildings(data);
      if (data.length > 0) {
        setSelectedBuilding(data[0].id);
      }
      setError(null);
    } catch (error: any) {
      console.error('Failed to load buildings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async (buildingId: string) => {
    try {
      const encodedBuildingId = encodeURIComponent(buildingId);
      const response = await fetch(`http://localhost:5000/api/buildings/${encodedBuildingId}/units`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load units');
      }
      const data = await response.json();
      setUnits(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error: any) {
      console.error('Failed to load units:', error);
      setError(error.message);
      setUnits([]);
    }
  };

  const handleAddUnit = async () => {
    if (!selectedBuilding) return;

    const token = localStorage.getItem('adminToken');
    try {
      const unitData = {
        ...newUnit,
        id: `${selectedBuilding.replace(/\s+/g, '-').toUpperCase()}-${newUnit.title.replace(/\s+/g, '-')}`,
        building: selectedBuilding,
        image: '/images/units/default.jpg',
        images: JSON.stringify(['/images/units/default.jpg']),
        description: `Unit ${newUnit.title}`,
        floor_plan: JSON.stringify({}),
        availability: JSON.stringify({})
      };

      const response = await fetch('http://localhost:5000/api/units', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(unitData)
      });

      if (!response.ok) throw new Error('Failed to add unit');

      setShowAddModal(false);
      setNewUnit({
        title: '',
        floor: 0,
        size: 0,
        capacity: 0,
        price: 0,
        status: 'Available',
        condition: 'Bare',
        location: ''
      });
      loadUnits(selectedBuilding);
      setError(null);
    } catch (error: any) {
      console.error('Failed to add unit:', error);
      setError(error.message);
    }
  };

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    setShowEditModal(true);
  };

  const handleSaveUnit = async () => {
    if (!editingUnit) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/units/${editingUnit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          size: editingUnit.size,
          price: editingUnit.pricePerSqm,
          status: editingUnit.status,
          condition: editingUnit.condition
        })
      });

      if (!response.ok) throw new Error('Failed to update unit');

      setShowEditModal(false);
      setEditingUnit(null);
      if (selectedBuilding) {
        loadUnits(selectedBuilding);
      }
      setError(null);
    } catch (error: any) {
      console.error('Failed to update unit:', error);
      setError(error.message);
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (!confirm('Are you sure you want to delete this unit?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/units/${unitId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete unit');

      if (selectedBuilding) {
        loadUnits(selectedBuilding);
      }
      setError(null);
    } catch (error: any) {
      console.error('Failed to delete unit:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Property Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={!selectedBuilding}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Unit
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">⚠️ {error}</p>
        </div>
      )}

      {/* Building Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Select Building</label>
        <select
          value={selectedBuilding || ''}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 font-medium"
        >
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name} • {building.availableUnits} of {building.totalUnits} units available
            </option>
          ))}
        </select>
      </div>

      {/* Units Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-white border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Units ({units.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Unit Number</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Floor</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Size</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Price/sqm</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {units.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="9" y1="9" x2="15" y2="9" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                      </svg>
                      <p className="text-lg font-medium">No units found</p>
                      <p className="text-sm mt-1">Add your first unit to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                units.map((unit, index) => (
                  <tr key={unit.id} className={`hover:bg-red-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{unit.unitNumber}</div>
                      <div className="text-xs text-gray-500">{unit.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Floor {unit.floor}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{unit.size} sqm</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₱{unit.pricePerSqm.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        unit.status === 'Available' ? 'bg-green-100 text-green-800' : 
                        unit.status === 'Coming Soon' ? 'bg-yellow-100 text-yellow-800' :
                        unit.status === 'Taken' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {unit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        unit.condition === 'Fitted' ? 'bg-purple-100 text-purple-800' :
                        unit.condition === 'Warm Shell' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {unit.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEditUnit(unit)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDeleteUnit(unit.id)}
                          className="text-gray-600 hover:text-red-600 font-semibold text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Unit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-gray-900">Add New Unit</h3>
              <p className="text-sm text-gray-500 mt-1">Add a new unit to {selectedBuilding}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Number/Title *</label>
                  <input
                    type="text"
                    value={newUnit.title}
                    onChange={(e) => setNewUnit({ ...newUnit, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 101, GF-A"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Floor *</label>
                  <input
                    type="number"
                    value={newUnit.floor}
                    onChange={(e) => setNewUnit({ ...newUnit, floor: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Size (sqm) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newUnit.size}
                    onChange={(e) => setNewUnit({ ...newUnit, size: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="100.50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    value={newUnit.capacity}
                    onChange={(e) => setNewUnit({ ...newUnit, capacity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price/sqm *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newUnit.price}
                    onChange={(e) => setNewUnit({ ...newUnit, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={newUnit.status}
                    onChange={(e) => setNewUnit({ ...newUnit, status: e.target.value })}
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
                    value={newUnit.condition}
                    onChange={(e) => setNewUnit({ ...newUnit, condition: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Bare">Bare</option>
                    <option value="Warm Shell">Warm Shell</option>
                    <option value="Fitted">Fitted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newUnit.location}
                  onChange={(e) => setNewUnit({ ...newUnit, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Building address"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewUnit({
                    title: '',
                    floor: 0,
                    size: 0,
                    capacity: 0,
                    price: 0,
                    status: 'Available',
                    condition: 'Bare',
                    location: ''
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUnit}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Add Unit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-xl">
              <h3 className="text-xl font-bold text-white">Edit Unit {editingUnit.unitNumber}</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Size (sqm)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingUnit.size}
                  onChange={(e) => setEditingUnit({ ...editingUnit, size: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price per sqm</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingUnit.pricePerSqm}
                  onChange={(e) => setEditingUnit({ ...editingUnit, pricePerSqm: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={editingUnit.status}
                  onChange={(e) => setEditingUnit({ ...editingUnit, status: e.target.value })}
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
                  value={editingUnit.condition}
                  onChange={(e) => setEditingUnit({ ...editingUnit, condition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Bare">Bare</option>
                  <option value="Warm Shell">Warm Shell</option>
                  <option value="Fitted">Fitted</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-xl">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUnit(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUnit}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}