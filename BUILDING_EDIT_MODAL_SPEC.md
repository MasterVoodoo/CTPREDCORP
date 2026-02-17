# Building Management UI Specification

## Building Table - Additional Columns

The table should show a summary view with a "View Details" button:

### Columns:
1. **Name** (with ID below)
2. **Display Name**
3. **Location** (short_location)
4. **Contact** (phone + email)
5. **Badge**
6. **Total Units**
7. **Available Units**
8. **Actions** (View Details | Edit | Delete)

## Comprehensive Edit Building Modal

The edit modal should include ALL fields from the add building form:

### Sections:

#### 1. Basic Information
- Building ID (read-only)
- Building Name
- Display Name
- Badge

#### 2. Location
- Full Location
- Short Location

#### 3. Description
- Paragraph 1 (textarea)
- Paragraph 2 (textarea)
- Paragraph 3 (textarea)

#### 4. Building Statistics
- Total Floors (number)
- Total Units (number)
- Occupancy Rate (%) (number)
- Available Units (number)

#### 5. Building Hours
- Weekday Hours (text)
- Security Hours (text)

#### 6. Contact Information
- Phone
- Email
- Address

#### 7. Hero Image
- Current image preview
- Upload new image (optional)
- "Keep current image" checkbox

#### 8. Call-to-Action
- CTA Title
- CTA Description (textarea)

### Edit Modal Behavior:

1. When opening edit modal, populate all fields with current building data
2. Parse JSON fields (description, stats, building_hours, contact) back into individual fields
3. Show current hero image if available
4. On save, send FormData with all fields (like add building)
5. If no new image uploaded, send flag to keep existing image

## View Details Modal (Optional)

A read-only modal showing all building data in an organized, easy-to-read format with proper formatting for:
- Description paragraphs
- Stats in a grid
- Contact info formatted nicely
- Current hero image displayed

## Backend Requirements

The backend needs to:
1. Return all fields when fetching buildings
2. Parse JSON fields (description, stats, building_hours, contact) in the response
3. Accept FormData on PUT /api/buildings/:id with the same structure as POST
4. Handle optional image upload on edit (keep existing if not provided)
