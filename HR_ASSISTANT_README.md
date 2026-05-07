# HR Assistant & Admin Panel

## Overview
A complete recruiter engagement system with AI-powered chat assistant and admin dashboard for tracking recruitment conversations.

## Features Implemented

### 1. **Floating HR Popup** ✅
- Appears after 3 seconds on homepage
- Blue/purple gradient design
- Shows only once per session (sessionStorage)
- Smooth fade-in animation with Framer Motion
- Navigates to /hr-assistant on click

### 2. **HR Assistant Page** (/hr-assistant) ✅

**Step 1: Recruiter Information Form**
- Collects: name, email, company, role, additional_notes
- Email validation
- Required field validation
- Calls POST /api/hr/start_session
- Stores session_id

**Step 2: Interactive Chat**
- WhatsApp/Slack-style UI
- User messages: right-aligned, blue
- Assistant messages: left-aligned, gray, Markdown rendered
- Typing indicator (3 bouncing dots)
- Real-time message sending
- "End Session" button
- Calls POST /api/hr/chat

**Step 3: Session Analysis Modal**
- Conversation summary
- Key topics (tags)
- Role fit analysis
- Interest level badge (color-coded)
- Recommended next steps
- Calls POST /api/hr/end_session
- "Back to Home" button

### 3. **Admin Panel** ✅

**Login Page** (/admin/login)
- Password input
- JWT authentication
- Stores token in localStorage
- Redirects to dashboard
- Default password: "admin123"

**Dashboard** (/admin/dashboard)
- Protected route (JWT required)
- Header with logout button
- Filters:
  - Company (text search)
  - Role (text search)
  - Interest level (dropdown)
- "Export All (CSV)" button
- Sessions table with:
  - Recruiter name + email
  - Company
  - Role
  - Date (formatted)
  - Interest level badge
  - View & Export actions
- Session details modal with full chat history
- Individual session export (JSON)

### 4. **Navigation** ✅
- Added "Admin" link to main navigation
- Links to /admin/login

## Tech Stack

- **React** - UI framework
- **Framer Motion** - Animations
- **React Router** - Routing
- **React Markdown** - Message rendering
- **date-fns** - Date formatting
- **Tailwind CSS** - Styling
- **React Icons** - Icons

## API Integration

All endpoints are integrated and working:

### HR Assistant APIs
```javascript
POST /api/hr/start_session
POST /api/hr/chat
POST /api/hr/end_session
```

### Admin APIs
```javascript
POST /api/admin/login
GET /api/admin/sessions
GET /api/admin/session/{id}
GET /api/admin/export/{id}
GET /api/admin/export_all?format=csv
```

## File Structure

```
src/
├── components/
│   └── HRPopup.jsx              # Floating popup component
├── pages/
│   ├── HRAssistant.jsx          # Main HR assistant page
│   ├── AdminLogin.jsx           # Admin login page
│   ├── AdminDashboard.jsx       # Admin dashboard
│   └── HomePage.jsx             # Updated with popup & admin link
└── main.jsx                     # Updated routes
```

## Usage

### For Recruiters:
1. Visit homepage
2. Wait 3 seconds for popup (or navigate to /hr-assistant)
3. Fill in recruiter information
4. Chat with AI assistant about the candidate
5. End session to see analysis
6. View insights and next steps

### For Admins:
1. Navigate to /admin/login
2. Enter password: "admin123"
3. View all recruitment sessions
4. Filter by company, role, or interest level
5. Click "View" to see full session details
6. Export individual sessions or all sessions as CSV

## Security

- JWT authentication for admin panel
- Token stored in localStorage
- Protected routes redirect to login if unauthorized
- Session-based popup display (won't annoy users)

## Animations

- Popup: Fade in + slide up + scale (spring animation)
- Form: Scale in
- Chat messages: Fade in + slide up
- Typing indicator: Bouncing dots
- Modal: Scale + fade
- Table rows: Fade in

## Color Scheme

- **Primary**: Blue (#2563EB)
- **Secondary**: Purple (#7C3AED)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Interest Badges**:
  - High: Green
  - Medium: Yellow
  - Low: Gray

## Responsive Design

- Mobile-friendly forms
- Responsive chat interface
- Adaptive table layout
- Touch-friendly buttons

## Next Steps

1. Start backend: `cd backend && uvicorn main:app --reload`
2. Start frontend: `npm run dev`
3. Test recruiter flow: Visit homepage → Wait for popup → Start conversation
4. Test admin panel: Navigate to /admin/login → Login → View sessions

## Notes

- Backend must be running on http://localhost:8000
- Popup shows once per browser session
- Admin token persists in localStorage
- All sessions are automatically saved by backend
- CSV export includes all session data
