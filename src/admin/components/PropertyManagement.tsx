import { useState, useEffect } from 'react';
import BuildingEditModal from './BuildingEditModal';

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
  totalUnits: number;
  availableUnits: number;
}

interface Unit {
  id: string;
  title: string;
  building: string;
  floor: number;
  size: number;
  price: number;
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
  building: string;
}

interface NewBuilding {
  id: string;
  name: string;
  display_name: string;
  location: string;
  short_location: string;
  description_paragraph_1: string;
  description_paragraph_2: string;
  description_paragraph_3: string;
  stats_total_floors: string;
  stats_total_units: string;
  stats_occupancy_rate: string;
  stats_available_units: string;
  hours_weekdays: string;
  hours_security: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  hero_image: File | null;
  hero_image_preview: string;
  badge: string;
  cta_title: string;
  cta_description: string;
}

export default function PropertyManagement() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Unit states
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [showDeleteUnitModal, setShowDeleteUnitModal] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);
  
  // Building states
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);
  const [showEditBuildingModal, setShowEditBuildingModal] = useState(false);
  const [showDeleteBuildingModal, setShowDeleteBuildingModal] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState<Building | null>(null);
  
  // Filter states
  const [filterBuilding, setFilterBuilding] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [newUnit, setNewUnit] = useState<NewUnit>({
    title: '',
    floor: 0,
    size: 0,
    capacity: 0,
    price: 0,
    status: 'Available',
    condition: 'Bare',
    location: '',
    building: ''
  });

  const [newBuilding, setNewBuilding] = useState<NewBuilding>({
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
    hero_image: null,
    hero_image_preview: '',
    badge: '',
    cta_title: '',
    cta_description: ''
  });

  useEffect(() => {
    loadBuildings();
    loadAllUnits();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allUnits, filterBuilding, filterStatus, filterCondition, searchQuery]);

  // Helper functions to parse JSON fields
  const parseStats = (stats: any) => {
    if (!stats) return null;
    try {
      return typeof stats === 'string' ? JSON.parse(stats) : stats;
    } catch {
      return null;
    }
  };

  const parseHours = (hours: any) => {
    if (!hours) return null;
    try {
      return typeof hours === 'string' ? JSON.parse(hours) : hours;
    } catch {
      return null;
    }
  };

  const parseContact = (contact: any) => {
    if (!contact) return null;
    try {
      return typeof contact === 'string' ? JSON.parse(contact) : contact;
    } catch {
      return null;
    }
  };

  const parseDescription = (description: any) => {
    if (!description) return [];
    try {
      if (Array.isArray(description)) return description;
      return typeof description === 'string' ? JSON.parse(description) : [];
    } catch {
      return [];
    }
  };

  const loadBuildings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/buildings');
      if (!response.ok) throw new Error('Failed to load buildings');
      const data = await response.json();
      setBuildings(data);
      setError(null);
    } catch (error: any) {
      console.error('Failed to load buildings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAllUnits = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/units');
      if (!response.ok) throw new Error('Failed to load units');
      const data = await response.json();
      setAllUnits(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error: any) {
      console.error('Failed to load units:', error);
      setError(error.message);
      setAllUnits([]);
    }
  };

  const applyFilters = () => {
    let filtered = [...allUnits];

    if (filterBuilding !== 'all') {
      filtered = filtered.filter(unit => unit.building === filterBuilding);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(unit => unit.status === filterStatus);
    }

    if (filterCondition !== 'all') {
      filtered = filtered.filter(unit => unit.condition === filterCondition);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(unit => 
        unit.title.toLowerCase().includes(query) ||
        unit.id.toLowerCase().includes(query) ||
        unit.building.toLowerCase().includes(query)
      );
    }

    setFilteredUnits(filtered);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setNewBuilding({
        ...newBuilding,
        hero_image: file,
        hero_image_preview: previewUrl
      });
    }
  };

  // Unit handlers
  const handleAddUnit = async () => {
    if (!newUnit.building) {
      setError('Please select a building');
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      const unitData = {
        ...newUnit,
        id: `${newUnit.building.replace(/\s+/g, '-').toUpperCase()}-${newUnit.title.replace(/\s+/g, '-')}`,
        image: '/images/units/default.jpg',
        images: JSON.stringify(['/images/units/default.jpg']),
        description: `Unit ${newUnit.title}`,
        floorPlan: {},
        availability: {}
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

      setShowAddUnitModal(false);
      setNewUnit({
        title: '',
        floor: 0,
        size: 0,
        capacity: 0,
        price: 0,
        status: 'Available',
        condition: 'Bare',
        location: '',
        building: ''
      });
      loadAllUnits();
      loadBuildings();
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
          title: editingUnit.title,
          building: editingUnit.building,
          location: '',
          floor: editingUnit.floor,
          size: editingUnit.size,
          capacity: 0,
          price: editingUnit.price,
          status: editingUnit.status,
          condition: editingUnit.condition,
          image: '',
          images: [],
          description: '',
          floorPlan: {},
          availability: {}
        })
      });

      if (!response.ok) throw new Error('Failed to update unit');

      setShowEditModal(false);
      setEditingUnit(null);
      loadAllUnits();
      loadBuildings();
      setError(null);
    } catch (error: any) {
      console.error('Failed to update unit:', error);
      setError(error.message);
    }
  };

  const handleDeleteUnitClick = (unit: Unit) => {
    setUnitToDelete(unit);
    setShowDeleteUnitModal(true);
  };

  const confirmDeleteUnit = async () => {
    if (!unitToDelete) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/units/${unitToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete unit');

      setShowDeleteUnitModal(false);
      setUnitToDelete(null);
      loadAllUnits();
      loadBuildings();
      setError(null);
    } catch (error: any) {
      console.error('Failed to delete unit:', error);
      setError(error.message);
    }
  };

  // Building handlers
  const handleAddBuilding = async () => {
    if (!newBuilding.name || !newBuilding.id) {
      setError('Building ID and name are required');
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      const formData = new FormData();
      
      formData.append('id', newBuilding.id);
      formData.append('name', newBuilding.name);
      formData.append('display_name', newBuilding.display_name || newBuilding.name);
      formData.append('location', newBuilding.location);
      formData.append('short_location', newBuilding.short_location || newBuilding.location);
      formData.append('description_paragraph_1', newBuilding.description_paragraph_1);
      formData.append('description_paragraph_2', newBuilding.description_paragraph_2);
      formData.append('description_paragraph_3', newBuilding.description_paragraph_3);
      formData.append('stats_total_floors', newBuilding.stats_total_floors);
      formData.append('stats_total_units', newBuilding.stats_total_units);
      formData.append('stats_occupancy_rate', newBuilding.stats_occupancy_rate);
      formData.append('stats_available_units', newBuilding.stats_available_units);
      formData.append('hours_weekdays', newBuilding.hours_weekdays);
      formData.append('hours_security', newBuilding.hours_security);
      formData.append('contact_phone', newBuilding.contact_phone);
      formData.append('contact_email', newBuilding.contact_email);
      formData.append('contact_address', newBuilding.contact_address);
      
      if (newBuilding.hero_image) {
        formData.append('hero_image', newBuilding.hero_image);
      }
      
      formData.append('badge', newBuilding.badge);
      formData.append('cta_title', newBuilding.cta_title);
      formData.append('cta_description', newBuilding.cta_description);

      const response = await fetch('http://localhost:5000/api/buildings', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to add building');

      setShowAddBuildingModal(false);
      setNewBuilding({
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
        hero_image: null,
        hero_image_preview: '',
        badge: '',
        cta_title: '',
        cta_description: ''
      });
      loadBuildings();
      setError(null);
    } catch (error: any) {
      console.error('Failed to add building:', error);
      setError(error.message);
    }
  };

  const handleEditBuilding = (building: Building) => {
    setEditingBuilding(building);
    setShowEditBuildingModal(true);
  };

  const handleSaveBuilding = async (formData: FormData) => {
    if (!editingBuilding) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/buildings/${editingBuilding.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update building');

      setShowEditBuildingModal(false);
      setEditingBuilding(null);
      loadBuildings();
      setError(null);
    } catch (error: any) {
      console.error('Failed to update building:', error);
      setError(error.message);
    }
  };

  const handleDeleteBuildingClick = (building: Building) => {
    setBuildingToDelete(building);
    setShowDeleteBuildingModal(true);
  };

  const confirmDeleteBuilding = async () => {
    if (!buildingToDelete) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/buildings/${buildingToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete building');

      setShowDeleteBuildingModal(false);
      setBuildingToDelete(null);
      loadBuildings();
      setError(null);
    } catch (error: any) {
      console.error('Failed to delete building:', error);
      setError(error.message);
    }
  };

  const clearFilters = () => {
    setFilterBuilding('all');
    setFilterStatus('all');
    setFilterCondition('all');
    setSearchQuery('');
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
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        
        .add-unit-button, .add-building-button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .add-unit-button:hover, .add-building-button:hover { transform: translateY(-2px); background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.4), 0 2px 4px -1px rgba(220, 38, 38, 0.3); }
        
        .edit-button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .edit-button:hover { transform: translateY(-2px); background-color: #DBEAFE !important; color: #3B82F6 !important; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3); }
        
        .delete-button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .delete-button:hover { transform: translateY(-2px); background-color: #FEE2E2 !important; color: #DC2626 !important; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.3); }
        
        .content-fade-in { animation: slideIn 0.5s ease-out; }
        .modal-overlay { animation: fadeIn 0.3s ease-out; backdrop-filter: blur(4px); }
        .modal-content { animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        
        .buildings-table { min-width: 1400px; }
        .units-table { min-width: 1200px; }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage buildings and units across your portfolio</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">⚠️ {error}</p>
        </div>
      )}

      {/* Buildings Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Buildings</h3>
          <button
            onClick={() => setShowAddBuildingModal(true)}
            className="add-building-button flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Building
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-white border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">All Buildings ({buildings.length})</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="buildings-table w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '180px'}}>Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '150px'}}>Location</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '200px'}}>Description</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '180px'}}>Stats</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '180px'}}>Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '200px'}}>Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '180px'}}>CTA</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '150px'}}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {buildings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3">
                          <rect x="2" y="2" width="20" height="20" rx="2"/>
                          <line x1="7" y1="2" x2="7" y2="22"/>
                          <line x1="17" y1="2" x2="17" y2="22"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <line x1="2" y1="7" x2="7" y2="7"/>
                          <line x1="2" y1="17" x2="7" y2="17"/>
                          <line x1="17" y1="17" x2="22" y2="17"/>
                          <line x1="17" y1="7" x2="22" y2="7"/>
                        </svg>
                        <p className="text-lg font-medium">No buildings found</p>
                        <p className="text-sm mt-1">Add your first building to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  buildings.map((building, index) => {
                    const stats = parseStats(building.stats);
                    const hours = parseHours(building.building_hours);
                    const contact = parseContact(building.contact);
                    const description = parseDescription(building.description);
                    
                    return (
                      <tr key={building.id} className={`hover:bg-red-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-gray-900">{building.display_name || building.name}</div>
                          <div className="text-xs text-gray-500">{building.id}</div>
                          {building.badge && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                              {building.badge}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-700">{building.short_location || building.location || '-'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-gray-600 line-clamp-2">
                            {description[0] || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs space-y-1">
                            {stats ? (
                              <>
                                <div className="text-gray-600"><span className="font-medium">Floors:</span> {stats.totalFloors || '-'}</div>
                                <div className="text-gray-600"><span className="font-medium">Units:</span> {stats.totalUnits || '-'}</div>
                                <div className="text-gray-600"><span className="font-medium">Occupancy:</span> {stats.occupancyRate || '-'}%</div>
                                <div className="text-green-600 font-medium">Available: {stats.availableUnits || '-'}</div>
                              </>
                            ) : '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs space-y-1">
                            {hours ? (
                              <>
                                <div className="text-gray-600"><span className="font-medium">Weekdays:</span> {hours.weekdays || '-'}</div>
                                <div className="text-gray-600"><span className="font-medium">Security:</span> {hours.security || '-'}</div>
                              </>
                            ) : '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs space-y-1">
                            {contact ? (
                              <>
                                {contact.phone && <div className="text-gray-600">{contact.phone}</div>}
                                {contact.email && <div className="text-gray-600">{contact.email}</div>}
                                {contact.address && <div className="text-gray-500 line-clamp-1">{contact.address}</div>}
                              </>
                            ) : '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs space-y-1">
                            {building.cta_title && <div className="font-medium text-gray-700 line-clamp-1">{building.cta_title}</div>}
                            {building.cta_description && <div className="text-gray-500 line-clamp-2">{building.cta_description}</div>}
                            {!building.cta_title && !building.cta_description && '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditBuilding(building)}
                              className="edit-button px-2 py-1 text-gray-700 border border-gray-300 rounded font-semibold text-xs transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBuildingClick(building)}
                              className="delete-button px-2 py-1 text-gray-700 border border-gray-300 rounded font-semibold text-xs transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Units Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Units</h3>
          <button
            onClick={() => setShowAddUnitModal(true)}
            className="add-unit-button flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Unit
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Filters</h4>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Unit ID, number, building..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Building</label>
              <select
                value={filterBuilding}
                onChange={(e) => setFilterBuilding(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Buildings</option>
                {buildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Taken">Taken</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Conditions</option>
                <option value="Bare">Bare</option>
                <option value="Warm Shell">Warm Shell</option>
                <option value="Fitted">Fitted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Units Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                All Units ({filteredUnits.length} {filteredUnits.length !== allUnits.length && `of ${allUnits.length}`})
              </h4>
              {(filterBuilding !== 'all' || filterStatus !== 'all' || filterCondition !== 'all' || searchQuery) && (
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  Filters active
                </span>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="units-table w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '150px'}}>Unit</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '150px'}}>Building</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '100px'}}>Floor</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '100px'}}>Size</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '120px'}}>Price/sqm</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '120px'}}>Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '130px'}}>Condition</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider" style={{minWidth: '150px'}}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUnits.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <line x1="9" y1="9" x2="15" y2="9" />
                          <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <p className="text-lg font-medium">No units found</p>
                        <p className="text-sm mt-1">
                          {searchQuery || filterBuilding !== 'all' || filterStatus !== 'all' || filterCondition !== 'all' 
                            ? 'Try adjusting your filters' 
                            : 'Add your first unit to get started'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUnits.map((unit, index) => (
                    <tr key={unit.id} className={`hover:bg-red-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{unit.title}</div>
                        <div className="text-xs text-gray-500">{unit.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{unit.building}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Floor {unit.floor}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{unit.size} sqm</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₱{(unit.price || 0).toLocaleString()}</td>
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
                            className="edit-button px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg font-semibold text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUnitClick(unit)}
                            className="delete-button px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg font-semibold text-sm transition-colors"
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
      </div>

      {/* Add Building Modal */}
      {showAddBuildingModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddBuildingModal(false)}>
          <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Add New Building</h3>
                <button
                  onClick={() => setShowAddBuildingModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Building ID *</label>
                    <input
                      type="text"
                      value={newBuilding.id}
                      onChange={(e) => setNewBuilding({ ...newBuilding, id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., makati-skyscraper"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Building Name *</label>
                    <input
                      type="text"
                      value={newBuilding.name}
                      onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., Makati Skyscraper"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={newBuilding.display_name}
                      onChange={(e) => setNewBuilding({ ...newBuilding, display_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Optional display name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                    <input
                      type="text"
                      value={newBuilding.badge}
                      onChange={(e) => setNewBuilding({ ...newBuilding, badge: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., New Listing"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Location</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Location</label>
                    <input
                      type="text"
                      value={newBuilding.location}
                      onChange={(e) => setNewBuilding({ ...newBuilding, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., Makati City, Metro Manila"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Location</label>
                    <input
                      type="text"
                      value={newBuilding.short_location}
                      onChange={(e) => setNewBuilding({ ...newBuilding, short_location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., Makati CBD"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Description</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 1</label>
                    <textarea
                      value={newBuilding.description_paragraph_1}
                      onChange={(e) => setNewBuilding({ ...newBuilding, description_paragraph_1: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 2</label>
                    <textarea
                      value={newBuilding.description_paragraph_2}
                      onChange={(e) => setNewBuilding({ ...newBuilding, description_paragraph_2: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 3</label>
                    <textarea
                      value={newBuilding.description_paragraph_3}
                      onChange={(e) => setNewBuilding({ ...newBuilding, description_paragraph_3: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors</label>
                    <input
                      type="text"
                      value={newBuilding.stats_total_floors}
                      onChange={(e) => setNewBuilding({ ...newBuilding, stats_total_floors: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., 45"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Units</label>
                    <input
                      type="text"
                      value={newBuilding.stats_total_units}
                      onChange={(e) => setNewBuilding({ ...newBuilding, stats_total_units: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., 200+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupancy Rate</label>
                    <input
                      type="text"
                      value={newBuilding.stats_occupancy_rate}
                      onChange={(e) => setNewBuilding({ ...newBuilding, stats_occupancy_rate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., 85"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Units</label>
                    <input
                      type="text"
                      value={newBuilding.stats_available_units}
                      onChange={(e) => setNewBuilding({ ...newBuilding, stats_available_units: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., 30"
                    />
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weekdays</label>
                    <input
                      type="text"
                      value={newBuilding.hours_weekdays}
                      onChange={(e) => setNewBuilding({ ...newBuilding, hours_weekdays: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., 8 AM - 6 PM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Security</label>
                    <input
                      type="text"
                      value={newBuilding.hours_security}
                      onChange={(e) => setNewBuilding({ ...newBuilding, hours_security: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., 24/7"
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      value={newBuilding.contact_phone}
                      onChange={(e) => setNewBuilding({ ...newBuilding, contact_phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., (02) 1234-5678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={newBuilding.contact_email}
                      onChange={(e) => setNewBuilding({ ...newBuilding, contact_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., info@building.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={newBuilding.contact_address}
                      onChange={(e) => setNewBuilding({ ...newBuilding, contact_address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Call to Action</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CTA Title</label>
                    <input
                      type="text"
                      value={newBuilding.cta_title}
                      onChange={(e) => setNewBuilding({ ...newBuilding, cta_title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., Schedule a Tour"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CTA Description</label>
                    <textarea
                      value={newBuilding.cta_description}
                      onChange={(e) => setNewBuilding({ ...newBuilding, cta_description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Hero Image</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {newBuilding.hero_image_preview && (
                    <div className="mt-4">
                      <img src={newBuilding.hero_image_preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowAddBuildingModal(false);
                  setNewBuilding({
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
                    hero_image: null,
                    hero_image_preview: '',
                    badge: '',
                    cta_title: '',
                    cta_description: ''
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBuilding}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Add Building
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      {showAddUnitModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddUnitModal(false)}>
          <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Unit</h3>
                <button
                  onClick={() => setShowAddUnitModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Building *</label>
                  <select
                    value={newUnit.building}
                    onChange={(e) => setNewUnit({ ...newUnit, building: e.target.value })}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit Number/Title *</label>
                  <input
                    type="text"
                    value={newUnit.title}
                    onChange={(e) => setNewUnit({ ...newUnit, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 1501"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor *</label>
                    <input
                      type="number"
                      value={newUnit.floor}
                      onChange={(e) => setNewUnit({ ...newUnit, floor: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., 15"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size (sqm) *</label>
                    <input
                      type="number"
                      value={newUnit.size}
                      onChange={(e) => setNewUnit({ ...newUnit, size: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., 50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per sqm (₱) *</label>
                  <input
                    type="number"
                    value={newUnit.price}
                    onChange={(e) => setNewUnit({ ...newUnit, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 1200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
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
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddUnitModal(false);
                    setNewUnit({
                      title: '',
                      floor: 0,
                      size: 0,
                      capacity: 0,
                      price: 0,
                      status: 'Available',
                      condition: 'Bare',
                      location: '',
                      building: ''
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
        </div>
      )}

      {/* Edit Building Modal */}
      {showEditBuildingModal && editingBuilding && (
        <BuildingEditModal
          building={editingBuilding}
          onClose={() => {
            setShowEditBuildingModal(false);
            setEditingBuilding(null);
          }}
          onSave={handleSaveBuilding}
        />
      )}

      {/* Delete Building Modal */}
      {showDeleteBuildingModal && buildingToDelete && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Building</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-semibold">{buildingToDelete.name}</span>? This will also delete all units in this building. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteBuildingModal(false);
                    setBuildingToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteBuilding}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Unit Modal */}
      {showDeleteUnitModal && unitToDelete && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Unit</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-semibold">{unitToDelete.title}</span> in <span className="font-semibold">{unitToDelete.building}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteUnitModal(false);
                    setUnitToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUnit}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Unit Modal */}
      {showEditModal && editingUnit && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Unit</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit Number/Title</label>
                  <input
                    type="text"
                    value={editingUnit.title}
                    onChange={(e) => setEditingUnit({ ...editingUnit, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                    <input
                      type="number"
                      value={editingUnit.floor}
                      onChange={(e) => setEditingUnit({ ...editingUnit, floor: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size (sqm)</label>
                    <input
                      type="number"
                      value={editingUnit.size}
                      onChange={(e) => setEditingUnit({ ...editingUnit, size: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per sqm (₱)</label>
                  <input
                    type="number"
                    value={editingUnit.price}
                    onChange={(e) => setEditingUnit({ ...editingUnit, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
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
              </div>

              <div className="flex gap-3 mt-6">
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
        </div>
      )}
    </div>
  );
}