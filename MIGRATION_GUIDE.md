# Migration Guide: Hash-based to React Router

This guide explains the changes made during the refactoring and how to use the new structure.

## 🔄 Major Changes

### 1. Routing System
**Before (Hash-based):**
```javascript
window.location.hash = "#about";
// URL: http://localhost:5173/#about
```

**After (React Router):**
```javascript
navigate("/about");
// URL: http://localhost:5173/about
```

### 2. Project Structure

**Before:**
```
src/
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   └── ... (all components mixed)
└── App.tsx (700+ lines with all routing logic)
```

**After:**
```
src/
├── components/
│   ├── layout/          # Layout components
│   ├── shared/          # Shared components
│   └── ui/             # UI library
├── pages/              # Page components
│   ├── admin/
│   └── sustainability/
├── lib/
│   └── api/           # API layer
├── hooks/             # Custom hooks
├── types/             # TypeScript types
├── config/            # Configuration
└── App.tsx           # Clean routing setup
```

### 3. API Layer

**Before:**
```javascript
// Direct fetch calls scattered throughout components
const response = await fetch(`${API_URL}/api/buildings`);
const data = await response.json();
```

**After:**
```javascript
// Centralized API service
import { buildingsService } from '@/lib/api';
const response = await buildingsService.getAll();
```

### 4. Data Fetching

**Before:**
```javascript
// Manual state management in each component
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  fetchData();
}, []);
```

**After:**
```javascript
// Custom hooks
const { buildings, loading, error } = useBuildings();
```

## 📋 URL Mapping

| Old URL (Hash) | New URL (React Router) |
|---------------|----------------------|
| `/#about` | `/about` |
| `/#services` | `/services` |
| `/#contact` | `/contact` |
| `/#properties` | `/properties` |
| `/#ctp-red-corp` | `/properties/ctp-red-corp` |
| `/#unit-CRC-001` | `/units/CRC-001` |
| `/#all-available-spaces` | `/spaces` |
| `/#schedule-appointment` | `/schedule` |
| `/#tenant-portal` | `/tenant-portal` |
| `/#sustainability-board-directors` | `/sustainability/board-of-directors` |
| `/admin` | `/admin/login` (if not authenticated) |
| `/admin` | `/admin` (if authenticated) |

## 🚀 How to Use the New Structure

### Creating a New Page

1. Create page component in `src/pages/`:
```typescript
// src/pages/NewPage.tsx
export default function NewPage() {
  return <div>New Page Content</div>;
}
```

2. Add route in `src/App.tsx`:
```typescript
<Route path="/new-page" element={<NewPage />} />
```

3. Link to it:
```typescript
import { Link } from 'react-router-dom';
<Link to="/new-page">Go to New Page</Link>
```

### Adding a New API Service

1. Define types in `src/types/index.ts`:
```typescript
export interface NewEntity {
  id: string;
  name: string;
}
```

2. Create service in `src/lib/api/services/`:
```typescript
// src/lib/api/services/newEntity.service.ts
export const newEntityService = {
  async getAll() {
    return apiClient.get<NewEntity[]>('/api/entities');
  },
};
```

3. Create custom hook in `src/hooks/`:
```typescript
// src/hooks/useNewEntity.ts
export const useNewEntities = () => {
  const [entities, setEntities] = useState<NewEntity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetch = async () => {
      const response = await newEntityService.getAll();
      if (response.success) setEntities(response.data);
      setLoading(false);
    };
    fetch();
  }, []);
  
  return { entities, loading };
};
```

## 🔧 Backend Improvements

### New Middleware Structure

```javascript
// Before: Everything in server.js
// After: Organized middleware
backend/
├── middleware/
│   ├── auth.js          # Authentication
│   ├── errorHandler.js  # Error handling
│   └── validation.js    # Input validation
└── utils/
    └── logger.js        # Logging utility
```

### Using New Middleware

```javascript
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const { validateBuilding } = require('./middleware/validation');

router.post('/buildings', 
  authenticateToken,
  authorizeRoles('admin', 'super_admin'),
  validateBuilding,
  createBuilding
);
```

## ⚠️ Breaking Changes

1. **Hash URLs no longer work** - Update all bookmarks and links
2. **Direct component imports** - Use page components instead
3. **API calls** - Use centralized services instead of direct fetch
4. **Navigation** - Use `useNavigate()` hook instead of `window.location.hash`

## 🎯 Benefits

1. **Better SEO** - Clean URLs without hashes
2. **Type Safety** - Full TypeScript coverage
3. **Maintainability** - Clear separation of concerns
4. **Reusability** - Custom hooks and services
5. **Performance** - Code splitting ready
6. **Developer Experience** - Better IDE support and autocomplete

## 📝 Notes

- The old `App.tsx` has been completely rewritten
- All components remain functional, just reorganized
- Backend API endpoints remain unchanged
- Database schema unchanged
- Environment variables remain the same

## 🐛 Troubleshooting

**Issue: 404 on page refresh**
- Solution: Vite dev server handles this automatically. For production, ensure your web server is configured to serve `index.html` for all routes.

**Issue: API calls failing**
- Solution: Check `VITE_API_URL` in your `.env` file

**Issue: Components not found**
- Solution: Update imports to use `@/` alias (configured in `vite.config.ts`)

## 📚 Additional Resources

- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
