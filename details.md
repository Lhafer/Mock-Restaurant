Restaurant Website Template — Development Plan

1. Set up the base frontend
   Create a reusable React + Vite template.
   Keep restaurant-specific information out of the source code wherever possible.
   Use environment variables for Supabase configuration.
   Deploy the frontend through Vercel.

   Current app setup:
   - React + Vite app with a single shared frontend shell.
   - Supabase client is initialized from Vite env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
   - Auth/session state is handled via a custom hook, with login and password setup flows built into the main app entry.

2. Set up Supabase

Start with the Free plan during development.

Use one Supabase project for all restaurants.

Set up:

- Supabase Auth — manager and worker accounts/login.
- PostgreSQL — restaurant, role, and menu data.
- Supabase Storage — restaurant images.
- Row Level Security (RLS) — isolate each restaurant's data.

Current implementation notes:

- The app expects a multi-tenant architecture where each user can be linked to a restaurant via either restaurant_managers or restaurant_workers.
- The app already distinguishes between manager and worker roles in the dashboard.
- Managers can invite workers from the dashboard using a Supabase Edge Function.

3. Design the database

Something roughly like:

restaurants
├── id
├── name
├── slug
└── ...

restaurant_managers
├── user_id
├── restaurant_id
└── created_at

restaurant_workers
├── user_id
├── restaurant_id
└── created_at

menu_categories
├── id
├── restaurant_id
├── name
├── sort_order
└── ...

menu_items
├── id
├── category_id
├── name
├── description
├── price
├── image_path
├── sort_order
├── is_available
├── is_published
└── ...

Everything gets associated with a restaurant_id so multiple restaurants can safely share the same Supabase project.

Additional database rules from the current app:

- Users should be linked to exactly one restaurant assignment for their role.
- Workers should be able to read their assigned menu and toggle item availability only.
- Managers should be able to create categories, add items, and manage worker access.
- Public menu access should only show published and available items.

4. Configure Storage

Create a single bucket:

restaurant-images/

Organize files by restaurant:

restaurant-images/
├── restaurant-1/
│ ├── item-1.webp
│ └── item-2.webp
├── restaurant-2/
│ └── item-1.webp
└── ...

Create Storage RLS policies so managers can only upload, modify, or delete files belonging to their restaurant.

For images, have the frontend resize/compress them before uploading.

Current app note:

- The main frontend is not yet doing direct image uploads; the current implementation is primarily menu CRUD and role-based access. Storage work should be added as a future security-focused enhancement.

5. Build the manager dashboard

Create a protected /admin area.

The manager should be able to:

- Login
- Determine their restaurant
- Load their menu
- Edit menu
- Invite workers
- Toggle item availability
- Upload/replace images
- Save everything to Supabase

Current implementation details already present in the codebase:

- App flow: login -> check user metadata for password setup -> require a password reset if needed -> load restaurant context -> render dashboard.
- The dashboard reads the current user's role and restaurant data, then loads categories and menu items.
- Managers can add categories and menu items directly from forms.
- Workers can view the same menu and toggle item is_available without changing menu structure.
- Worker invitation logic is implemented via a Supabase Edge Function named super-handler and a second create-worker function scaffold.
- If the invited user already exists, the function may reassign or reset their password instead of creating a duplicate account.

6. Build the public website

The public site simply retrieves the restaurant's data from Supabase:

Vercel
↓
React
↓
Supabase
├── Restaurant data
├── Menu data
└── Image URLs

The frontend renders the returned data using reusable components.

Current project note:

- The current codebase focuses on the admin/manager side rather than a full public storefront.
- Public data access should remain read-only and should filter to published, available items only.

7. Test security before deploying clients

Specifically test:

- Manager A cannot read Restaurant B's menu.
- Manager A cannot modify Restaurant B's menu.
- Manager A cannot delete Restaurant B's images.
- Worker A cannot edit categories or create new menu items.
- Worker A can only update item availability for their restaurant.
- Unauthenticated users cannot access the admin dashboard.
- Public users can view the necessary menu/images.
- Supabase service-role credentials never reach the frontend.

Current security pattern in codebase:

- RLS is enforced through functions like manager_restaurant_ids() and worker_restaurant_ids().
- The Edge Function validates the active user session and calls adminClient only on the server-side.
- A trigger protects menu_items so workers cannot change fields beyond is_available.

8. Scale the template

Start with:

- Supabase Free
- Vercel
- 1 Supabase project
- multiple restaurants

Use the Free plan while developing/testing. Once you have paying restaurants and need production reliability, upgrade the same Supabase project to Pro rather than changing the architecture.

9. Working notes from the current codebase

The repository already contains a workable starter implementation with these patterns:

- Frontend admin shell with login, password setup, and dashboard rendering.
- Manager/worker role split using restaurant_managers and restaurant_workers tables.
- RLS-friendly data access functions in src/lib/menuApi.js.
- Supabase Edge Functions in supabase/functions/ for worker invitations and account handling.
- SQL migration in supabase/migrations/002_worker_roles_and_availability.sql that enforces worker restrictions and availability toggling.

Important implementation rule:

- Do not put restaurant-specific business logic in the frontend source. Keep shared logic reusable and rely on Supabase RLS + server-side Edge Functions for authorization boundaries.

20+ Restaurants

The main design principle is one reusable frontend + one multi-tenant Supabase backend, with RLS providing the separation between restaurants.
