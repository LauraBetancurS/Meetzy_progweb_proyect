![Meetzy  ](https://daqupzktljfqadeqbujj.supabase.co/storage/v1/object/sign/read.me/metzzy%20logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZDAzZTgxYy1hMzBhLTQxYzctOGU0Ni1jOTY3ZjIwM2Q0MjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZWFkLm1lL21ldHp6eSBsb2dvLnBuZyIsImlhdCI6MTc2NDAwMDEzMiwiZXhwIjoxNzk1NTM2MTMyfQ.IeeWU2l6yNU2uLf_2KpkttHhxwlTqHki3RtIcyNcQ80)





# Meetzy — Technical Documentation  
### Single Page Application built with React, TypeScript, Redux Toolkit & Supabase

Meetzy is a modern, scalable Single Page Application designed to help users explore events, join communities, respond to polls, manage profiles, and receive personalized event recommendations — all within a seamless dashboard experience.

The app uses **Supabase as a fully integrated Backend-as-a-Service**, providing authentication, database management, and file storage without the need for a custom backend server.

---

# 1. Project Overview

Meetzy centralizes social planning by allowing authenticated users to:

- Browse and explore **events**
- Join and interact with **communities**
- Create and respond to **live polls**
- View and update their **profile**
- Manage **subscriptions**
- Take a **recommendation quiz** that suggests events based on preferences

The system is built as a **client-side SPA**, with architecture focused on modularity, maintainability, and predictable state management.

---

# 2. Workflow Overview

## 2.1 User Journey

![User Journey ](https://daqupzktljfqadeqbujj.supabase.co/storage/v1/object/sign/read.me/user%20journey.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZDAzZTgxYy1hMzBhLTQxYzctOGU0Ni1jOTY3ZjIwM2Q0MjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZWFkLm1lL3VzZXIgam91cm5leS5wbmciLCJpYXQiOjE3NjM5OTk1MTUsImV4cCI6MTc5NTUzNTUxNX0.8IERL8UC81c4yxAFMH92aF8qPI0X1zz5cLQZQAQ9BrM)


Navigation is fully client-side (React Router), and all state/data is handled by Redux Toolkit slices + Supabase service modules.

---

# 3. System Architecture

Meetzy follows a modular, domain-driven structure with separation between UI components, data management, global state, and Supabase services.

## 3.1 Folder Structure

![Folder structure  ](https://daqupzktljfqadeqbujj.supabase.co/storage/v1/object/sign/read.me/folder%20structure.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZDAzZTgxYy1hMzBhLTQxYzctOGU0Ni1jOTY3ZjIwM2Q0MjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZWFkLm1lL2ZvbGRlciBzdHJ1Y3R1cmUucG5nIiwiaWF0IjoxNzYzOTk5OTEwLCJleHAiOjE3OTU1MzU5MTB9.rA6v9U7_oB0qvqmZjXzV9DSHfJqfUvZdiFASM3aTL-4)



---

# 4. Supabase Integration

Meetzy uses **Supabase as its backend**, handling:

- Authentication
- Database (PostgreSQL)
- File storage (avatars, images)
- Row Level Security
- Auto-generated API

## 4.1 Architecture Flow (Supabase)
![FArchitecture Flow  ](https://daqupzktljfqadeqbujj.supabase.co/storage/v1/object/sign/read.me/Architecture%20Flow%20(Supabase).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZDAzZTgxYy1hMzBhLTQxYzctOGU0Ni1jOTY3ZjIwM2Q0MjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZWFkLm1lL0FyY2hpdGVjdHVyZSBGbG93IChTdXBhYmFzZSkucG5nIiwiaWF0IjoxNzYzOTk5OTM3LCJleHAiOjE3OTU1MzU5Mzd9.3I_2Fbc4GTXGlyf6WolP1bb82cKhybG0HZR9lDAY0Fc)



## 4.2 Service Modules

Each domain has a matching service file:

| Service File             | Responsibility                                 |
|--------------------------|------------------------------------------------|
| supabaseClient.ts        | Creates and exports Supabase client            |
| usersService.ts          | Profile CRUD, session sync                     |
| supaavatar.ts            | Avatar upload/retrieval (Supabase Storage)     |
| supaevents.ts            | Event CRUD + recommendation queries            |
| communitiesServices.ts   | Community CRUD + membership                    |
| pollServices.ts          | Poll creation, fetching, voting                |
| postsServices.ts         | Posts/feed CRUD                                |

---

# 5. Redux Architecture (Slice-by-Slice)

Each slice contains:

- State interface  
- Initial state  
- Reducers  
- Actions  
- Thunks (async logic)  
- Selectors  

---

## 5.1 AuthSlice

**Purpose:** Handles authentication state synchronized with Supabase.

**State:**
- `user`
- `status` (`idle`, `loading`, `authenticated`, `error`)
- `error`

**Actions & Flow:**
1. UI triggers login
2. Supabase validates credentials
3. AuthSlice updates store with user data
4. Protected routes unlock

---

## 5.2 a11ySlice

**Purpose:** Accessibility preferences like:


- Readability enhancements  

These values modify UI behavior globally.

---

## 5.3 EventsSlice

**Purpose:** Manages all event-related data.

**State includes:**
- `events`
- `selectedEvent`
- `status`
- `error`

**Thunks:**
- `fetchEvents`
- `fetchEventById`
- `createEvent`

**Connected Services:** `supaevents.ts`

---

## 5.4 CommunitiesSlice

**Purpose:** Loads communities and manages membership.

**State includes:**
- `communities`
- `myCommunities`
- `status`
- `error`

**Services Used:** `communitiesServices.ts`

---

## 5.5 PollsSlice

**Purpose:** Live polls system (creation, voting, results).

**State:**
- `polls`
- `selectedPoll`
- `votes`
- `status`
- `error`

**Services:** `pollServices.ts`

---

## 5.6 PostsSlices

**Purpose:** Event/community posts.

**State includes:**
- `posts`
- `status`
- `error`

**Services:** `postsServices.ts`

---

## 5.7 ProfileSlice

**Purpose:** Stores and updates user profile info.

**State includes:**
- `profile`
- `status`
- `error`

**Services:**
- `usersService.ts`
- `supaavatar.ts`

---

## 5.8 SubscriptionsSlice

**Purpose:** Tracks user subscriptions to events or communities.

**State includes:**
- `subscriptions`
- `status`
- `error`

**Services:** integrated inside communities & events modules depending on use-case

---

# 6. Routing

### ProtectedRoute.tsx

- Guards routes based on `AuthSlice`
- If not authenticated → redirect to login
- If authenticated → render children components



---

# 7. Event Recommendation Quiz

One of the main features of the final delivery.

## 7.1 How It Works

1. User answers several quiz questions.  
2. `utils/scoring.ts` computes a score for each event category.  
3. The dominant categories are selected.  
4. `supaevents.ts` fetches events matching those categories.  
5. UI shows the recommended list.

---

## 7.2 Quiz Flow Diagram
![Quiz Flow Diagram  ](https://daqupzktljfqadeqbujj.supabase.co/storage/v1/object/sign/read.me/Quiz%20Flow%20Diagram.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZDAzZTgxYy1hMzBhLTQxYzctOGU0Ni1jOTY3ZjIwM2Q0MjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZWFkLm1lL1F1aXogRmxvdyBEaWFncmFtLnBuZyIsImlhdCI6MTc2Mzk5OTk4NywiZXhwIjoxNzk1NTM1OTg3fQ.3OzvztHaPsykafdY-Jnz4hU5oXm-qFqEj-_877zMw3w)



---

# 8. Technical Decisions

### Why Supabase?
- Easy and secure managed backend  
- Native authentication  
- SQL-powered queries  
- Direct integration with React and TypeScript  

### Why Redux Toolkit?
- Predictable state management  
- Feature-sliced architecture  
- Scalable for multi-feature apps  

### Why this folder structure?
- Clean separation of concerns  
- Easy to scale modules  
- Maintainable by multiple developers  

### Security
- Environment variables for Supabase keys  
- Row Level Security  
- Protected routes  
- No secrets committed to repo  

---

# 9. Branch Management & Commit Strategy

## 9.1 Branches Used

- `main` — production/stable  
- `development` — integration branch  
- `DanielaDev` — feature branch  
- `lauritadev` — feature branch  

## 9.2 Branch Naming Convention

feature/<feature-name>
fix/<bug-description>
style/<ui-change>
chore/<tooling-or-cleanup>
docs/<documentation>

shell
Copiar código

## 9.3 Commit Naming Convention

feat: add quiz scoring algorithm
fix: poll vote duplication bug
style: adjust dashboard grid layout
refactor: cleanup supabase user mapping
chore: update dependencies
docs: add supabase architecture diagram

