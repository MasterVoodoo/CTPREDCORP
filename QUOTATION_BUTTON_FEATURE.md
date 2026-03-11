# Get Quotation Button Feature

## Overview
Replaced the scroll-to-top floating button with a "Get Quotation" button that opens a popup form for collecting client inquiries.

## Implementation Details

### Component Location
- **File**: `src/components/shared/QuotationButton.tsx`
- **Integration**: Added to `src/components/layout/Layout.tsx`

### UI Features

#### Floating Button
- **Position**: Fixed at bottom-right corner (24px from bottom and right)
- **Icon**: FileText icon from lucide-react
- **Color**: Primary red (#dc2626) with hover effect (#b91c1c)
- **Animation**: Scale transform on hover (1.1x)
- **Z-index**: 9999 (always on top)

#### Popup Modal
- **Trigger**: Click on floating button
- **Backdrop**: Semi-transparent black overlay (50% opacity)
- **Position**: Centered on screen
- **Max Width**: 500px
- **Max Height**: 90vh with scroll
- **Close Options**: 
  - Click backdrop
  - Click X button in header
  - Click Cancel button

### Form Fields

1. **Full Name** (Required)
   - Type: Text input
   - Placeholder: "John Doe"

2. **Company Name** (Required)
   - Type: Text input
   - Placeholder: "Acme Corporation"

3. **Industry** (Required)
   - Type: Select dropdown
   - Options:
     - Technology
     - Finance & Banking
     - Healthcare
     - Retail
     - Manufacturing
     - Real Estate
     - Education
     - Consulting
     - Legal Services
     - Marketing & Advertising
     - Other

4. **Email Address** (Required)
   - Type: Email input
   - Placeholder: "john@example.com"
   - Validation: Email format

5. **Phone Number** (Optional)
   - Type: Tel input
   - Placeholder: "+63 912 345 6789"

6. **Space Requirements / Message** (Optional)
   - Type: Textarea (4 rows)
   - Placeholder: "Tell us about your space requirements, preferred floor, size, move-in date, etc."

7. **Send Copy Checkbox** (Optional)
   - Type: Checkbox
   - Label: "Send me a copy of this inquiry"

### Form Actions

- **Cancel Button**: Closes the modal without submitting
- **Submit Inquiry Button**: 
  - Primary red color
  - Currently logs form data to console
  - Closes modal after submission
  - **TODO**: Add backend integration

## State Management

```typescript
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({
  name: "",
  company: "",
  industry: "",
  email: "",
  phone: "",
  requirements: "",
  sendCopy: false,
});
```

## Dependencies Used

- `lucide-react`: FileText and X icons
- `@/components/ui/button`: Button component
- `@/components/ui/input`: Input component
- `@/components/ui/label`: Label component
- `@/components/ui/checkbox`: Checkbox component
- `@/components/ui/select`: Select dropdown component
- `@/components/ui/textarea`: Textarea component

## Styling Approach

- Uses inline styles for modal and floating button (for precise positioning and z-index control)
- Uses Tailwind classes for form elements (via UI components)
- Maintains consistent design with existing UI components

## Next Steps (TODO)

### Backend Integration
1. Create API endpoint for quotation inquiries
   - Route: `/api/quotations` (POST)
   - Database table: `quotations`
   
2. Add email notification system
   - Send inquiry to company email
   - Send copy to customer if checkbox is checked
   
3. Add form validation
   - Client-side validation (already has HTML5 validation)
   - Server-side validation
   
4. Add success/error notifications
   - Toast notifications on submit success/failure
   - Loading state during submission
   
5. Add reCAPTCHA or similar spam protection

### Database Schema (Suggested)

```sql
CREATE TABLE quotations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  requirements TEXT,
  send_copy BOOLEAN DEFAULT FALSE,
  status ENUM('new', 'contacted', 'quoted', 'closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Admin Panel Integration
- Add quotations management section
- View all inquiries
- Update status (new, contacted, quoted, closed)
- Add notes/responses
- Export to CSV

## Testing Checklist

- [ ] Button appears on all public pages
- [ ] Button doesn't appear on admin pages
- [ ] Modal opens on button click
- [ ] Modal closes on backdrop click
- [ ] Modal closes on X button click
- [ ] Modal closes on Cancel button
- [ ] Form validation works (required fields)
- [ ] Select dropdown shows all industries
- [ ] Checkbox toggles correctly
- [ ] Form submits successfully
- [ ] Form data is logged correctly
- [ ] Responsive design works on mobile
- [ ] Hover effects work correctly
- [ ] Z-index doesn't conflict with other elements

## Files Modified

1. `src/components/shared/QuotationButton.tsx` - New component
2. `src/components/layout/Layout.tsx` - Replaced ScrollToTop with QuotationButton
3. `src/components/ui/checkbox.tsx` - Fixed imports (removed version numbers)

## Files Removed

- `src/components/shared/ScrollToTop.tsx` - No longer used (can be deleted if needed)

## Build Status

✅ Build successful
✅ No TypeScript errors
✅ No linting errors
✅ Ready for deployment
