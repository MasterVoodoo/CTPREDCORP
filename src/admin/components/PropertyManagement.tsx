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

export default function PropertyManagement() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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
      const data = await response.json();
      setBuildings(data);
      if (data.length > 0) {
        setSelectedBuilding(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load buildings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async (buildingId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/buildings/${buildingId}/units`);
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.error('Failed to load units:', error);
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
        body: JSON.stringify(editingUnit)
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditingUnit(null);
        if (selectedBuilding) {
          loadUnits(selectedBuilding);
        }
      }
    } catch (error) {
      console.error('Failed to update unit:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Property Management</h2>
      </div>

      {/* Building Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Building</label>
        <select
          value={selectedBuilding || ''}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name} - {building.availableUnits}/{building.totalUnits} Available
            </option>
          ))}
        </select>
      </div>

      {/* Units Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size (sqm)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/sqm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {units.map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{unit.unitNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{unit.floor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{unit.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₱{unit.pricePerSqm.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      unit.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{unit.condition}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEditUnit(unit)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Unit {editingUnit.unitNumber}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size (sqm)</label>
                <input
                  type="number"
                  value={editingUnit.size}
                  onChange={(e) => setEditingUnit({ ...editingUnit, size: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per sqm</label>
                <input
                  type="number"
                  value={editingUnit.pricePerSqm}
                  onChange={(e) => setEditingUnit({ ...editingUnit, pricePerSqm: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingUnit.status}
                  onChange={(e) => setEditingUnit({ ...editingUnit, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  value={editingUnit.condition}
                  onChange={(e) => setEditingUnit({ ...editingUnit, condition: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="warm-shell">Warm Shell</option>
                  <option value="bare-shell">Bare Shell</option>
                  <option value="fitted">Fitted</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUnit(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUnit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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