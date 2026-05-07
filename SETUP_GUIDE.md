# HR Assistant Setup Guide

## Quick Start

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Start Backend
Make sure your backend is running on http://localhost:8000

```bash
cd backend
uvicorn main:app --reload
```

### 3. Start Frontend
```bash
npm run dev
```

### 4. Test the Features

#### Test Recruiter Flow:
1. Open http://localhost:5173
2. Wait 3 seconds for the floating popup to appear
3. Click "Start Conversation"
4. Fill in the recruiter form:
   - Name: John Doe
   - Email: john@company.com
   - Company: Tech Corp
   - Role: Senior AI Engineer
   - Notes: (optional)
5. Click "Start Conversation"
6. Chat with the AI assistant
7. Click "End Session" to see analysis

#### Test Admin Panel:
1. Navigate to http://localhost:5173/admin/login
2. Enter password: `admin123`
3. Click "Login"
4. View all sessions in the dashboard
5. Use filters to search by company, role, or interest level
6. Click "View" on any session to see full details
7. Click "Export" to download session as JSON
8. Click "Export All (CSV)" to download all sessions

## Features Overview

### 🎯 Floating Popup
- Appears after 3 seconds on homepage
- Shows only once per session
- Smooth animations
- Direct link to HR Assistant

### 💬 HR Assistant
- **Step 1**: Recruiter information form with validation
- **Step 2**: Interactive chat with AI (Markdown support)
- **Step 3**: Session analysis with insights

### 🔐 Admin Panel
- Secure JWT authentication
- Session management
- Advanced filtering
- Export capabilities (JSON & CSV)

## API Endpoints Used

### HR Assistant
- `POST /api/hr/start_session` - Start new session
- `POST /api/hr/chat` - Send message
- `POST /api/hr/end_session` - End session & get analysis

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/sessions` - List all sessions
- `GET /api/admin/session/{id}` - Get session details
- `GET /api/admin/export/{id}` - Export single session
- `GET /api/admin/export_all?format=csv` - Export all sessions

## Troubleshooting

### Popup Not Showing
- Clear sessionStorage: `sessionStorage.clear()` in browser console
- Refresh the page
- Wait 3 seconds

### Admin Login Fails
- Check backend is running
- Verify password is "admin123"
- Check browser console for errors

### Chat Not Working
- Verify backend is running on http://localhost:8000
- Check network tab for API errors
- Ensure session_id is being stored

### Build Warnings
The "chunks larger than 500 kB" warning is normal for this app size. To optimize:
```bash
# Use code splitting in production
npm run build
```

## File Structure

```
src/
├── components/
│   ├── HRPopup.jsx              # Floating popup
│   └── ...
├── pages/
│   ├── HRAssistant.jsx          # HR assistant page
│   ├── AdminLogin.jsx           # Admin login
│   ├── AdminDashboard.jsx       # Admin dashboard
│   ├── HomePage.jsx             # Updated homepage
│   └── ...
└── main.jsx                     # Routes configuration
```

## Environment

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **Admin Password**: admin123

## Next Steps

1. ✅ Test recruiter flow end-to-end
2. ✅ Test admin panel functionality
3. ✅ Verify all API integrations
4. ✅ Check responsive design on mobile
5. ✅ Test session persistence
6. ✅ Verify export functionality

## Production Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to your hosting
```

### Backend URL
Update API URLs in:
- `src/pages/HRAssistant.jsx`
- `src/pages/AdminLogin.jsx`
- `src/pages/AdminDashboard.jsx`

Change `http://localhost:8000` to your production backend URL.

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify backend is running
3. Check network tab for failed requests
4. Clear localStorage/sessionStorage if needed

## Success Criteria ✅

- [x] Floating popup appears after 3 seconds
- [x] Popup shows only once per session
- [x] Recruiter form validates inputs
- [x] Chat interface works smoothly
- [x] Typing indicator shows while loading
- [x] Session analysis displays correctly
- [x] Admin login authenticates properly
- [x] Dashboard shows all sessions
- [x] Filters work correctly
- [x] Session details modal displays full info
- [x] Export functions work (JSON & CSV)
- [x] Responsive design on all devices
- [x] Smooth animations throughout

Enjoy your new HR Assistant system! 🎉
