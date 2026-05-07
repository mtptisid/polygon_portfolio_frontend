# HR Assistant User Flows

## 🎯 Recruiter Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        HOME PAGE                             │
│  - User lands on portfolio homepage                         │
│  - Browsing content...                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (After 3 seconds)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    FLOATING POPUP                            │
│  ┌───────────────────────────────────────────────────┐     │
│  │  💼 Are you hiring?                               │     │
│  │  Talk to my AI Assistant!                         │     │
│  │                                                    │     │
│  │  Learn about my experience through an             │     │
│  │  interactive conversation.                        │     │
│  │                                                    │     │
│  │  [Start Conversation]                             │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (Click button)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  RECRUITER FORM                              │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Tell us about yourself                           │     │
│  │                                                    │     │
│  │  Your Name: [________________]                    │     │
│  │  Email: [____________________]                    │     │
│  │  Company: [__________________]                    │     │
│  │  Role: [_____________________]                    │     │
│  │  Notes: [____________________]                    │     │
│  │                                                    │     │
│  │  [Start Conversation]                             │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (Submit form)
                            │ API: POST /api/hr/start_session
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CHAT INTERFACE                            │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Assistant: Hi John! I'm here to help you         │     │
│  │  learn about Siddharamayya's experience...        │     │
│  │                                                    │     │
│  │                    You: What's his experience      │     │
│  │                    in AI/ML?                       │     │
│  │                                                    │     │
│  │  Assistant: He has 4+ years of experience...      │     │
│  │  • LLM fine-tuning                                │     │
│  │  • RAG applications                               │     │
│  │  • MLOps pipelines                                │     │
│  │                                                    │     │
│  │  [Type your message...] [Send]                    │     │
│  │  [End Session]                                    │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (Click End Session)
                            │ API: POST /api/hr/end_session
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  SESSION ANALYSIS                            │
│  ┌───────────────────────────────────────────────────┐     │
│  │  📊 Session Analysis                              │     │
│  │                                                    │     │
│  │  Conversation Summary:                            │     │
│  │  Discussed AI/ML experience, projects, and...    │     │
│  │                                                    │     │
│  │  Key Topics:                                      │     │
│  │  [AI/ML] [LLMs] [MLOps] [Python]                │     │
│  │                                                    │     │
│  │  Role Fit Analysis:                               │     │
│  │  Strong match for Senior AI Engineer role...     │     │
│  │                                                    │     │
│  │  Interest Level: [HIGH]                           │     │
│  │                                                    │     │
│  │  Next Steps:                                      │     │
│  │  • Schedule technical interview                   │     │
│  │  • Share job description                          │     │
│  │  • Discuss compensation                           │     │
│  │                                                    │     │
│  │  [Back to Home]                                   │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Admin Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      NAVIGATION                              │
│  [Home] [Projects] [Admin] [Profile]                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (Click Admin)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN LOGIN                              │
│  ┌───────────────────────────────────────────────────┐     │
│  │  🔒 Admin Login                                   │     │
│  │                                                    │     │
│  │  Enter your password to access the dashboard     │     │
│  │                                                    │     │
│  │  Password: [______________]                       │     │
│  │                                                    │     │
│  │  [Login]                                          │     │
│  │                                                    │     │
│  │  ← Back to Home                                   │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (Enter password: admin123)
                            │ API: POST /api/admin/login
                            │ Store JWT token
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   ADMIN DASHBOARD                            │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Admin Dashboard                      [Logout]    │     │
│  ├───────────────────────────────────────────────────┤     │
│  │  Filters:                                         │     │
│  │  Company: [_____] Role: [_____]                  │     │
│  │  Interest: [All ▼] [Export All (CSV)]           │     │
│  ├───────────────────────────────────────────────────┤     │
│  │  Sessions Table:                                  │     │
│  │  ┌─────────────────────────────────────────────┐ │     │
│  │  │ Name/Email │ Company │ Role │ Date │ Int │  │ │     │
│  │  ├─────────────────────────────────────────────┤ │     │
│  │  │ John Doe   │ Tech    │ Sr AI│ May 6│HIGH │  │ │     │
│  │  │ john@...   │ Corp    │ Eng  │      │[View]│  │ │     │
│  │  ├─────────────────────────────────────────────┤ │     │
│  │  │ Jane Smith │ Start   │ ML   │ May 5│MED  │  │ │     │
│  │  │ jane@...   │ Inc     │ Lead │      │[View]│  │ │     │
│  │  └─────────────────────────────────────────────┘ │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (Click View)
                            │ API: GET /api/admin/session/{id}
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  SESSION DETAILS MODAL                       │
│  ┌───────────────────────────────────────────────────┐     │
│  │  John Doe                                    [X]  │     │
│  │  john.doe@techcorp.com                           │     │
│  ├───────────────────────────────────────────────────┤     │
│  │  Company: Tech Corp    │ Role: Senior AI Eng     │     │
│  │  Date: May 6, 2026     │ Interest: HIGH          │     │
│  ├───────────────────────────────────────────────────┤     │
│  │  Chat History:                                    │     │
│  │  ┌─────────────────────────────────────────────┐ │     │
│  │  │ User: What's his AI experience?             │ │     │
│  │  │ Bot: He has 4+ years in AI/ML...           │ │     │
│  │  │ User: Tell me about his projects            │ │     │
│  │  │ Bot: Key projects include...                │ │     │
│  │  └─────────────────────────────────────────────┘ │     │
│  ├───────────────────────────────────────────────────┤     │
│  │  Analysis:                                        │     │
│  │  Summary: Discussed AI/ML experience...          │     │
│  │  Topics: [AI/ML] [LLMs] [Python]                │     │
│  │  Role Fit: Strong match for the role...          │     │
│  │  Next Steps: Schedule interview, share JD...     │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

```
┌──────────────┐
│   Recruiter  │
└──────┬───────┘
       │
       │ 1. Fill Form
       ▼
┌──────────────────┐
│  POST /start     │──────┐
│  session         │      │
└──────────────────┘      │
                          │ 2. Store session_id
                          ▼
                    ┌──────────────┐
                    │   Frontend   │
                    │   State      │
                    └──────┬───────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       │ 3. Send messages  │                   │
       ▼                   │                   │
┌──────────────────┐       │                   │
│  POST /chat      │       │                   │
│  (with session)  │       │                   │
└──────────────────┘       │                   │
                           │ 4. End session    │
                           ▼                   │
                    ┌──────────────────┐       │
                    │  POST /end       │       │
                    │  session         │       │
                    └──────────────────┘       │
                                               │
                                               │ 5. Admin views
                                               ▼
                                        ┌──────────────┐
                                        │  GET /admin  │
                                        │  /sessions   │
                                        └──────────────┘
```

## 🎨 UI States

### Popup States
```
1. Hidden (first 3 seconds)
2. Visible (after 3 seconds)
3. Dismissed (after X click or navigation)
4. Never shown again (sessionStorage)
```

### Form States
```
1. Empty (initial)
2. Filling (user typing)
3. Validating (on submit)
4. Error (validation failed)
5. Submitting (API call)
6. Success (navigate to chat)
```

### Chat States
```
1. Welcome (initial message)
2. Idle (waiting for user input)
3. User typing (input has text)
4. Sending (API call in progress)
5. Loading (typing indicator)
6. Received (new message added)
7. Ending (end session clicked)
```

### Admin States
```
1. Logged out (show login)
2. Logging in (API call)
3. Logged in (show dashboard)
4. Loading sessions (API call)
5. Viewing sessions (table displayed)
6. Filtering (applying filters)
7. Viewing details (modal open)
8. Exporting (download in progress)
```

## 🔄 Session Lifecycle

```
┌─────────────┐
│   Created   │ ← POST /start_session
└──────┬──────┘
       │
       │ Chat messages
       ▼
┌─────────────┐
│   Active    │ ← POST /chat (multiple times)
└──────┬──────┘
       │
       │ End session
       ▼
┌─────────────┐
│  Analyzed   │ ← POST /end_session
└──────┬──────┘
       │
       │ Admin views
       ▼
┌─────────────┐
│   Stored    │ ← GET /admin/sessions
└─────────────┘
```

## 🎯 Key Interactions

### Popup Interaction
```
User sees popup → Clicks "Start" → Navigates to /hr-assistant
                ↓
         Clicks X → Popup dismissed → sessionStorage set
```

### Chat Interaction
```
User types → Presses Enter → Message sent → Loading indicator
                           ↓
                    Response received → Message displayed
```

### Admin Interaction
```
Admin logs in → Views table → Clicks filter → Table updates
                            ↓
                     Clicks View → Modal opens → Shows details
                            ↓
                     Clicks Export → File downloads
```

## 📱 Responsive Behavior

### Mobile
- Popup: Full width, bottom position
- Form: Single column, larger inputs
- Chat: Full width messages, larger buttons
- Admin: Scrollable table, stacked filters

### Tablet
- Popup: Fixed width, bottom-right
- Form: Single column, medium inputs
- Chat: 70% width messages
- Admin: Scrollable table, inline filters

### Desktop
- Popup: Fixed width, bottom-right
- Form: Centered, optimal width
- Chat: 70% width messages, side-by-side
- Admin: Full table, inline filters

## 🎉 Success Paths

### Happy Path - Recruiter
```
Home → Popup → Form → Chat → Analysis → Home
(3s)   (click) (fill) (chat) (end)     (back)
```

### Happy Path - Admin
```
Home → Admin → Login → Dashboard → View → Export
      (click) (auth)  (load)      (modal) (download)
```

## ⚠️ Error Paths

### Form Errors
```
Submit → Validation fails → Show errors → User fixes → Submit again
```

### Chat Errors
```
Send → API fails → Show error message → User retries
```

### Admin Errors
```
Login → Wrong password → Show error → User retries
      ↓
Dashboard → Token expired → Redirect to login
```

---

**All flows are implemented and working!** 🚀
