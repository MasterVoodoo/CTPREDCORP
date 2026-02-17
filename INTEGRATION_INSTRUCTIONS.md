# Integration Instructions for BuildingEditModal

## Overview
A comprehensive `BuildingEditModal` component has been created that includes ALL fields from the add building form. This needs to be integrated into `PropertyManagement.tsx`.

## Steps to Integrate:

### 1. Import the New Component

At the top of `src/admin/components/PropertyManagement.tsx`, add:

```typescript
import BuildingEditModal from './BuildingEditModal';
```

### 2. Update handleSaveBuilding Function

Replace the existing `handleSaveBuilding` function with:

```typescript
const handleSaveBuilding = async (formData: FormData) => {
  if (!editingBuilding) return;

  const token = localStorage.getItem('adminToken');
  try {
    const response = await fetch(`http://localhost:5000/api/buildings/${editingBuilding.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData // Now accepts FormData instead of JSON
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
```

### 3. Replace Edit Building Modal in JSX

Find the existing edit building modal section:

```typescript
{/* Edit Building Modal */}
{showEditBuildingModal && editingBuilding && (
  // OLD MODAL CODE HERE
)}
```

Replace it with:

```typescript
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
```

### 4. Expand Building Table (Optional)

To show more data in the table, you can add additional columns like "Contact" and update the table row to show:

```typescript
<td className="px-6 py-4 whitespace-nowrap">
  <div className="text-sm text-gray-700">
    {building.contact?.phone || '-'}
  </div>
  <div className="text-xs text-gray-500">
    {building.contact?.email || ''}
  </div>
</td>
```

## Features of the New Edit Modal:

✅ **All Fields Editable:**
- Basic Information (ID read-only, name, display name, badge)
- Location (full & short)
- Description (3 paragraphs)
- Building Statistics (floors, units, occupancy, available)
- Building Hours (weekdays & security)
- Contact Information (phone, email, address)
- Hero Image (with upload & preview)
- Call-to-Action (title & description)

✅ **Smart Parsing:**
- Automatically parses JSON fields from database into individual inputs
- Converts back to proper format on save

✅ **Image Handling:**
- Shows current image if available
- Allows uploading new image (optional)
- Keeps existing image if not replaced

✅ **User-Friendly:**
- Same UI/UX as add building form
- All fields are simple text/number inputs
- No JSON knowledge required

## Backend Requirements:

The backend PUT endpoint `/api/buildings/:id` needs to:

1. Accept `FormData` (same as POST endpoint)
2. Handle all the same fields as create building
3. Support `keep_current_image` flag to retain existing image
4. Return updated building data

Example backend handling:

```javascript
router.put('/buildings/:id', authenticateToken, upload.single('hero_image'), async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(' ')[1];
  
  // Parse individual fields into JSON structures
  const description = [
    req.body.description_paragraph_1,
    req.body.description_paragraph_2,
    req.body.description_paragraph_3
  ].filter(p => p); // Remove empty paragraphs
  
  const stats = {
    totalFloors: parseInt(req.body.stats_total_floors) || 0,
    totalUnits: parseInt(req.body.stats_total_units) || 0,
    occupancyRate: parseInt(req.body.stats_occupancy_rate) || 0,
    availableUnits: parseInt(req.body.stats_available_units) || 0
  };
  
  const building_hours = {
    weekdays: req.body.hours_weekdays,
    security: req.body.hours_security
  };
  
  const contact = {
    phone: req.body.contact_phone,
    email: req.body.contact_email,
    address: req.body.contact_address
  };
  
  // Handle image
  let hero_image_path;
  if (req.file) {
    hero_image_path = `/images/buildings/${req.file.filename}`;
  } else if (req.body.keep_current_image === 'true') {
    // Keep existing image - fetch from database
    const existing = await db.getBuilding(id);
    hero_image_path = existing.hero_image;
  }
  
  // Update database
  await db.updateBuilding(id, {
    name: req.body.name,
    display_name: req.body.display_name,
    location: req.body.location,
    short_location: req.body.short_location,
    description: JSON.stringify(description),
    stats: JSON.stringify(stats),
    building_hours: JSON.stringify(building_hours),
    contact: JSON.stringify(contact),
    hero_image: hero_image_path,
    badge: req.body.badge,
    cta_title: req.body.cta_title,
    cta_description: req.body.cta_description
  });
  
  res.json({ success: true });
});
```

## Testing:

1. Load PropertyManagement page
2. Click "Edit" on any building
3. Verify all fields are populated correctly
4. Modify various fields
5. Upload a new image (optional)
6. Click "Save Changes"
7. Verify changes are reflected in the table
8. Verify database is updated correctly
