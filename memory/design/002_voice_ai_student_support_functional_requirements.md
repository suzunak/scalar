# Voice AI Student Support System - User Scenarios

## Scenario 1: First-Time Student Gets Help with API Error

### Context
**Student:** Maria, a junior developer working on her first open source contribution  
**Project:** Scalar API Reference  
**Issue:** #847 - Add dark mode toggle to settings panel  
**Problem:** Getting a 404 error when trying to fetch theme preferences from API

### User Journey

1. **Login & Session Start**
   - Maria logs into the web app using her email and password
   - System loads her profile and displays "Working on: Scalar API Reference - Issue #847"
   - She clicks "Start Voice Session" button
   - System displays: "Hi Maria! I can see you're working on the dark mode toggle. How can I help today?"

2. **Describing the Problem**
   - Maria speaks: "I'm trying to fetch the theme preferences from the API but I keep getting a 404 error"
   - System transcribes in real-time, showing text in the UI
   - AI asks: "Can you tell me which endpoint you're trying to call?"
   - Maria: "I'm using /api/preferences/theme"
   - AI: "Let me check the project's API documentation..."

3. **AI Provides Solution**
   - AI searches knowledge bank and project README
   - AI responds: "I found the issue. In the Scalar API Reference project, the preferences endpoint is actually /api/user/preferences and theme is a property in the response object."
   - UI displays code snippet:
     ```javascript
     // Correct endpoint
     fetch('/api/user/preferences')
       .then(res => res.json())
       .then(data => {
         const theme = data.theme;
       });
     ```
   - AI: "Does this make sense? Would you like me to explain how the preferences object is structured?"

4. **Verification & Follow-up**
   - Maria: "Yes, that makes sense! Let me try it."
   - AI: "Great! Let me know if you run into any other issues."
   - Maria clicks "End Session"
   - System displays session summary:
     - **Problem:** 404 error on theme API endpoint
     - **Solution:** Use /api/user/preferences endpoint instead
     - **Next Steps:** Update fetch call in code
   - Summary sent to Maria's email

### Outcome
✅ Maria resolved her issue in 3 minutes  
✅ No expert escalation needed  
✅ Conversation saved for future reference

---

## Scenario 2: Student Stuck for Hours, Gets Escalated to Expert

### Context
**Student:** James, working on a complex authentication bug  
**Project:** Express API Integration  
**Issue:** #1203 - JWT tokens not refreshing properly  
**Problem:** Spent 3 hours debugging, tried multiple solutions from AI

### User Journey

1. **Multiple Sessions Over Time**
   - **Session 1 (Monday 2pm):** James asks about JWT refresh tokens
     - AI provides standard JWT refresh implementation
     - James tries it, still doesn't work
     - Session ends after 45 minutes
   
   - **Session 2 (Monday 4pm):** James returns, frustrated
     - AI: "I see we discussed JWT refresh earlier. What's happening now?"
     - James: "The tokens are being created but the refresh endpoint returns 401"
     - AI suggests checking middleware order and token validation
     - James tries suggestions, session ends after 1 hour
   
   - **Session 3 (Tuesday 10am):** James back again
     - AI recognizes recurring issue
     - James: "Still getting 401 on refresh. I've checked everything you suggested"
     - System detects: 3 sessions on same issue, 2.5+ hours total active time

2. **Escalation Suggestion**
   - AI: "I notice we've been working on this JWT refresh issue across three sessions now. The solutions I've provided haven't fully resolved it. Would you like me to escalate this to an expert who can review your code directly?"
   - UI displays escalation prompt with button: "Yes, Get Expert Help" / "No, Keep Trying"
   - James clicks "Yes, Get Expert Help"

3. **Escalation Creation**
   - System compiles escalation package:
     - Student: James Chen (james@university.edu)
     - Project: Express API Integration
     - Issue: #1203 - JWT tokens not refreshing properly
     - Sessions: 3 (spanning 2 days)
     - Problem: Refresh endpoint returns 401, standard solutions not working
     - AI Solutions Attempted:
       - Standard JWT refresh implementation
       - Middleware ordering checks
       - Token validation verification
     - Student's Code: Link to branch `james/jwt-refresh-fix`
     - Recent Commits: Shows last 3 commits related to auth
   
4. **Expert Notification**
   - System sends email to experts@university.edu
   - System posts to Discord #escalations channel:
     ```
     🆘 New Escalation - Created: 2025-10-29 10:15am
     Student: James Chen
     Project: Express API Integration
     Issue: JWT refresh endpoint returning 401
     Tech: Node.js, Express, JWT
     [View Case] [Claim Case]
     ```

5. **James Receives Confirmation**
   - UI displays: "Your request has been sent to an expert. You'll receive an email response within 24 hours."
   - Email sent to James with escalation summary
   - James can continue working or end session

### Outcome
✅ System recognized when AI couldn't solve the problem  
✅ Escalation happened at appropriate time  
✅ Expert has full context to help effectively  
✅ James doesn't waste more time stuck

---

## Scenario 3: Expert Reviews and Responds to Escalation

### Context
**Expert:** Dr. Sarah Johnson, experienced backend developer  
**Escalated Case:** James's JWT refresh token issue  
**Time:** Tuesday 2pm (4 hours after escalation)

### User Journey

1. **Expert Receives Notification**
   - Sarah checks her email, sees escalation notification
   - Opens Discord, sees post in #escalations channel
   - Clicks "View Case" link to expert dashboard

2. **Reviewing the Case**
   - Expert dashboard shows:
     ```
     Queue (5 cases)
     ┌────────────────────────────────────────────────────────┐
     │ James Chen - JWT refresh 401 error                     │
     │ Project: Express API Integration | Created: 4h ago     │
     │ Tags: Node.js, Express, JWT, Authentication            │
     │ Status: New                                            │
     └────────────────────────────────────────────────────────┘
     ```
   - Sarah filters by "Node.js" (her expertise)
   - Clicks on James's case
   - Views full escalation package:
     - Conversation history (3 sessions)
     - AI attempted solutions
     - James's GitHub branch link
     - Issue #1203 details

3. **Investigating the Code**
   - Sarah clicks GitHub link to James's branch
   - Reviews `auth.middleware.js` and `refresh.route.js`
   - Spots the issue: James is checking for token in `req.headers.authorization` but the refresh token is sent in `req.cookies.refreshToken`
   - This wasn't caught by AI because it's a project-specific cookie implementation

4. **Responding to Student**
   - Sarah clicks "Respond" button
   - System opens email template pre-filled with James's email and context
   - Sarah writes:
     ```
     Hi James,

     I reviewed your JWT refresh implementation and found the issue. 
     Your refresh endpoint is looking for the token in the Authorization 
     header, but in this project, refresh tokens are stored in HTTP-only 
     cookies.

     In your refresh.route.js, change line 12 from:
     const token = req.headers.authorization?.split(' ')[1];

     To:
     const token = req.cookies.refreshToken;

     Also, make sure you have cookie-parser middleware installed and 
     configured in your app.js.

     Let me know if this works or if you need more help!

     - Sarah
     ```
   - Sends email
   - System logs response in case timeline

5. **Creating Resolution Post**
   - Sarah thinks this is a common issue others might face
   - Clicks "Create Resolution Post"
   - Fills in form:
     - **Title:** JWT Refresh Token 401 Error with Cookie-based Authentication
     - **Problem:** Refresh endpoint returns 401 because token location is incorrect
     - **Solution:** 
       ```
       In Express projects using cookie-based auth, refresh tokens 
       are typically stored in HTTP-only cookies, not Authorization headers.
       
       Check:
       1. Token is in req.cookies.refreshToken, not req.headers.authorization
       2. cookie-parser middleware is installed and configured
       3. Refresh token is being set as a cookie in login endpoint
       ```
     - **Code Example:**
       ```javascript
       // In refresh.route.js
       router.post('/refresh', (req, res) => {
         const refreshToken = req.cookies.refreshToken; // Not from headers!
         // ... rest of refresh logic
       });
       ```
     - **Tags:** JWT, Express, Authentication, Cookies
   - Clicks "Post Publicly"

6. **Closing the Case**
   - Sarah marks case as "Resolved"
   - Adds private note: "Cookie vs header auth token issue. Added to Solutions Feed."
   - Case moves from Queue to "My Resolved Cases"

### Outcome
✅ Expert quickly identified issue with full context  
✅ Student received detailed, actionable guidance  
✅ Solution shared publicly for other students  
✅ Knowledge gap identified and documented

---

## Scenario 4: Student Finds Solution in Solutions Feed

### Context
**Student:** Lisa, working on authentication for a different project  
**Project:** FastAPI Integration  
**Issue:** #542 - Implement refresh token endpoint  
**Situation:** Getting 401 errors, sounds familiar...

### User Journey

1. **Starting Research Before AI Session**
   - Lisa logs into the web app
   - Before starting a voice session, she notices "Solutions Feed" in sidebar
   - Clicks to browse recent expert solutions

2. **Searching Solutions Feed**
   - Feed shows recent resolution posts from experts
   - Lisa types in search box: "refresh token 401"
   - Results show Sarah's post from yesterday: "JWT Refresh Token 401 Error with Cookie-based Authentication"
   - Post shows: 3 bookmarks, Posted by Dr. Sarah Johnson, Tags: JWT, Express, Authentication, Cookies

3. **Reading the Solution**
   - Lisa clicks on the post
   - Reads the problem description and solution
   - Code example shows checking `req.cookies.refreshToken`
   - Lisa thinks: "Wait, I'm using FastAPI with Python, but maybe it's the same concept..."

4. **Adapting Solution to Her Project**
   - Lisa starts a voice session to confirm
   - "Hi, I just read a solution about JWT refresh tokens in cookies. I'm using FastAPI - is it the same concept?"
   - AI: "Yes! In FastAPI, refresh tokens can also be stored in cookies. Let me show you the FastAPI equivalent..."
   - AI provides Python/FastAPI code example
   - Lisa implements it, problem solved!

5. **Bookmarking for Future**
   - Lisa returns to Solutions Feed
   - Clicks "Bookmark" on Sarah's original post
   - Post is now saved in her "Saved Solutions" list

### Outcome
✅ Lisa solved her problem without needing AI session or escalation  
✅ Expert's solution helped multiple students across different projects  
✅ Knowledge sharing reduced overall support load  
✅ Solutions Feed proved valuable resource

---

## Scenario 5: Student Resolves Common Issue and Contributes

### Context
**Student:** Alex, experienced developer working on a tricky issue  
**Project:** Vue Component Library  
**Issue:** #789 - Fix reactive props not updating in nested components  
**Situation:** Alex figures out the solution after some trial and error

### User Journey

1. **Working Through the Problem**
   - Alex has 2 voice sessions with AI about Vue reactivity
   - AI provides some standard solutions, but none quite work
   - Alex experiments with different approaches
   - Finally discovers the issue: needs `toRefs()` for destructured props in nested components

2. **System Detects Resolution**
   - Alex returns for 3rd session
   - "I figured it out! The problem was destructuring props without toRefs"
   - AI: "That's great! I'm glad you found the solution."
   - System checks: this issue type (Vue reactive props) has appeared in 5 other student sessions recently

3. **Contribution Prompt**
   - AI: "I notice several other students have been struggling with Vue reactivity issues in nested components. Would you be willing to document your solution to help them?"
   - UI displays: "Contribute Your Solution" button
   - Alex clicks "Sure, I can do that"

4. **Documenting the Solution**
   - System opens contribution form pre-filled with:
     - **Problem:** From conversation context
     - **Your Solution:** Empty (Alex fills this in)
   - Alex writes:
     ```
     Problem: Reactive props not updating in deeply nested Vue components
     
     When I destructured props in a nested component, changes from parent 
     weren't triggering updates.
     
     Solution: Use toRefs() when destructuring props to maintain reactivity
     
     Before (not working):
     const { user, settings } = props;
     
     After (working):
     import { toRefs } from 'vue';
     const { user, settings } = toRefs(props);
     
     Key lesson: Destructuring breaks reactivity unless you use toRefs()
     ```
   - Alex adds tags: Vue, Reactivity, Props, Composition API
   - Clicks "Submit for Review"

5. **Admin Review & Approval**
   - Contribution goes to admin queue
   - Admin (Dr. Martinez) reviews submission
   - Validates the solution is correct
   - Clicks "Approve and Add to Knowledge Bank"
   - Solution is now searchable by AI and visible to all students

6. **Recognition**
   - Alex receives email: "Your contribution has been approved! Thank you for helping other students."
   - Alex's profile shows contribution badge
   - When AI uses this solution, it attributes to Alex: "Based on a solution from Alex..."

### Outcome
✅ Alex's hard-earned knowledge helps other students  
✅ Knowledge bank grows organically with real student experiences  
✅ Students incentivized to document solutions  
✅ Community learning culture established

---

## Key Success Metrics Visible in Scenarios:

1. **Time to Resolution**
   - Maria: 3 minutes (AI only)
   - James: 4 hours to escalation + expert response
   - Lisa: < 5 minutes (self-service via Solutions Feed)

2. **Knowledge Reuse**
   - Sarah's solution → helped Lisa and 2+ other students
   - Alex's contribution → available to all future students

3. **Expert Efficiency**
   - Sarah had full context, resolved quickly
   - Filtering and claiming system prevents duplicate work

4. **System Learning**
   - AI learns from expert responses
   - Knowledge bank grows from student contributions
   - Admins identify content gaps from patterns

5. **Student Satisfaction**
   - Quick help for simple issues
   - Human support when needed
   - Ability to help others and contribute
