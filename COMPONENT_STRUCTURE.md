# Component Structure

## 📁 File Organization

```
src/
├── components/
│   ├── HRPopup.jsx                 # Floating recruitment popup
│   ├── ChatContainer.jsx           # Existing chat component
│   ├── AddUserForm.jsx            # Existing form
│   ├── AuthForm.jsx               # Existing auth
│   └── ...
│
├── pages/
│   ├── HRAssistant.jsx            # NEW: HR chat interface
│   ├── AdminLogin.jsx             # NEW: Admin authentication
│   ├── AdminDashboard.jsx         # NEW: Session management
│   ├── HomePage.jsx               # UPDATED: Added popup & admin link
│   ├── ProjectsPage.jsx           # Existing
│   └── ...
│
├── context/
│   └── AuthContext.jsx            # Existing auth context
│
├── services/
│   ├── authService.js             # Existing
│   └── chatService.js             # Existing
│
└── main.jsx                       # UPDATED: Added new routes
```

## 🧩 Component Hierarchy

### Home Page Flow
```
HomePage
├── HRPopup (conditional: messages.length === 0)
│   └── Framer Motion animations
├── Navigation
│   ├── Home button
│   ├── Projects link
│   ├── Admin link (NEW)
│   └── Profile link
├── Featured Content Carousel
└── Chat Interface (when messages > 0)
```

### HR Assistant Flow
```
HRAssistant
├── Step 1: Form
│   ├── Name input
│   ├── Email input (validated)
│   ├── Company input
│   ├── Role input
│   ├── Notes textarea
│   └── Submit button
│
├── Step 2: Chat
│   ├── Messages container
│   │   ├── Welcome message
│   │   ├── User messages (right-aligned)
│   │   ├── Bot messages (left-aligned, Markdown)
│   │   └── Typing indicator
│   ├── Input field
│   ├── Send button
│   └── End Session button
│
└── Step 3: Analysis
    ├── Summary section
    ├── Key topics (tags)
    ├── Role fit analysis
    ├── Interest level badge
    ├── Next steps list
    └── Back to Home button
```

### Admin Panel Flow
```
AdminLogin
├── Lock icon
├── Title
├── Password input
├── Error message (conditional)
├── Login button
└── Back to Home link

AdminDashboard
├── Header
│   ├── Title
│   └── Logout button
│
├── Filters Section
│   ├── Company filter
│   ├── Role filter
│   ├── Interest level dropdown
│   └── Export All button
│
├── Sessions Table
│   ├── Table header
│   ├── Table rows (mapped from sessions)
│   │   ├── Recruiter info
│   │   ├── Company
│   │   ├── Role
│   │   ├── Date
│   │   ├── Interest badge
│   │   └── Actions (View, Export)
│   └── Empty state
│
└── Session Details Modal (conditional)
    ├── Modal header
    │   ├── Recruiter name
    │   ├── Email
    │   └── Close button
    ├── Basic info grid
    ├── Additional notes
    ├── Chat history
    └── Analysis sections
```

## 🔄 State Management

### HRPopup Component
```javascript
State:
- isVisible: boolean
- isDismissed: boolean

SessionStorage:
- hr_popup_shown: 'true' | null
```

### HRAssistant Component
```javascript
State:
- step: 'form' | 'chat' | 'analysis'
- sessionId: string | null
- formData: { name, email, company, role, additional_notes }
- messages: Array<{ content, isUser }>
- inputMessage: string
- isLoading: boolean
- analysis: object | null
- errors: object

Effects:
- scrollToBottom on messages change
```

### AdminLogin Component
```javascript
State:
- password: string
- error: string
- isLoading: boolean

LocalStorage:
- admin_token: JWT string
```

### AdminDashboard Component
```javascript
State:
- sessions: Array<Session>
- filteredSessions: Array<Session>
- filters: { company, role, interest_level }
- selectedSession: Session | null
- isLoading: boolean
- showModal: boolean

LocalStorage:
- admin_token: JWT string

Effects:
- fetchSessions on mount
- applyFilters on filters/sessions change
- token validation
```

## 🎨 Styling Approach

### Tailwind Classes Used
```
Layout:
- min-h-screen, max-w-*, mx-auto, px-*, py-*
- flex, flex-col, flex-row, items-*, justify-*
- grid, grid-cols-*

Spacing:
- space-x-*, space-y-*, gap-*
- m-*, p-*

Colors:
- bg-blue-*, bg-purple-*, bg-green-*, bg-yellow-*
- text-white, text-gray-*
- border-gray-*

Effects:
- rounded-*, shadow-*
- hover:*, focus:*
- transition-*, duration-*

Responsive:
- sm:*, md:*, lg:*
```

### Framer Motion Variants
```javascript
// Popup
initial: { opacity: 0, y: 50, scale: 0.9 }
animate: { opacity: 1, y: 0, scale: 1 }
exit: { opacity: 0, y: 50, scale: 0.9 }

// Form/Modal
initial: { opacity: 0, scale: 0.95 }
animate: { opacity: 1, scale: 1 }

// Messages
initial: { opacity: 0, y: 10 }
animate: { opacity: 1, y: 0 }

// Table rows
initial: { opacity: 0 }
animate: { opacity: 1 }
```

## 🔌 API Integration Points

### HRAssistant.jsx
```javascript
// Start session
POST /api/hr/start_session
Body: { name, email, company, role, additional_notes }
Response: { session_id, welcome_message }

// Send message
POST /api/hr/chat
Body: { session_id, content, model }
Response: { content }

// End session
POST /api/hr/end_session
Body: { session_id }
Response: { summary, key_topics, role_fit, interest_level, next_steps }
```

### AdminLogin.jsx
```javascript
// Login
POST /api/admin/login
Body: { password }
Response: { access_token }
```

### AdminDashboard.jsx
```javascript
// List sessions
GET /api/admin/sessions
Headers: { Authorization: Bearer <token> }
Response: Array<Session>

// Get session details
GET /api/admin/session/{id}
Headers: { Authorization: Bearer <token> }
Response: Session with full details

// Export session
GET /api/admin/export/{id}
Headers: { Authorization: Bearer <token> }
Response: JSON file

// Export all
GET /api/admin/export_all?format=csv
Headers: { Authorization: Bearer <token> }
Response: CSV file
```

## 🎯 Props Flow

### HRPopup
```
No props (self-contained)
Uses: useNavigate() for routing
```

### HRAssistant
```
No props (self-contained)
Uses: useNavigate() for routing
Internal state management
```

### AdminLogin
```
No props (self-contained)
Uses: useNavigate() for routing
LocalStorage for token
```

### AdminDashboard
```
No props (self-contained)
Uses: useNavigate() for routing
LocalStorage for token
Protected route logic
```

## 🔐 Authentication Flow

```
User enters password
       ↓
POST /api/admin/login
       ↓
Receive JWT token
       ↓
Store in localStorage
       ↓
Include in all admin API calls
       ↓
Token expires or logout
       ↓
Clear localStorage
       ↓
Redirect to login
```

## 📊 Data Models

### Session Object
```typescript
{
  session_id: string
  name: string
  email: string
  company: string
  role: string
  additional_notes?: string
  created_at: string (ISO date)
  interest_level?: 'high' | 'medium' | 'low'
  chat_history: Array<{
    content: string
    is_user: boolean
  }>
  analysis?: {
    summary: string
    key_topics: string[]
    role_fit: string
    interest_level: string
    next_steps: string[]
  }
}
```

### Message Object
```typescript
{
  content: string
  isUser: boolean
}
```

### Filter Object
```typescript
{
  company: string
  role: string
  interest_level: 'all' | 'high' | 'medium' | 'low'
}
```

## 🎨 Design Tokens

### Colors
```javascript
primary: '#2563EB'      // Blue
secondary: '#7C3AED'    // Purple
success: '#10B981'      // Green
warning: '#F59E0B'      // Yellow
error: '#EF4444'        // Red

// Interest levels
high: '#10B981'         // Green
medium: '#F59E0B'       // Yellow
low: '#6B7280'          // Gray
```

### Spacing Scale
```javascript
xs: '0.25rem'   // 4px
sm: '0.5rem'    // 8px
md: '1rem'      // 16px
lg: '1.5rem'    // 24px
xl: '2rem'      // 32px
2xl: '3rem'     // 48px
```

### Border Radius
```javascript
sm: '0.5rem'    // 8px
md: '0.75rem'   // 12px
lg: '1rem'      // 16px
xl: '1.5rem'    // 24px
2xl: '2rem'     // 32px
```

### Shadows
```javascript
sm: '0 1px 2px rgba(0,0,0,0.05)'
md: '0 4px 6px rgba(0,0,0,0.1)'
lg: '0 10px 15px rgba(0,0,0,0.1)'
xl: '0 20px 25px rgba(0,0,0,0.1)'
2xl: '0 25px 50px rgba(0,0,0,0.25)'
```

## 🚀 Performance Optimizations

1. **Lazy Loading**: Components loaded on-demand via routes
2. **Memoization**: React.memo for expensive components
3. **Debouncing**: Filter inputs debounced
4. **Pagination**: Table can be paginated (future enhancement)
5. **Code Splitting**: Automatic via Vite
6. **Asset Optimization**: Images optimized
7. **Bundle Size**: Monitored via build warnings

## ✅ Accessibility

- Semantic HTML elements
- ARIA labels on buttons
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast ratios met
- Screen reader friendly
- Form validation messages

---

**All components are production-ready!** 🎉
