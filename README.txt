MEAL POPS REDESIGN, DESIGN A, READY FOR VERCEL

What's inside
  index.html      Homepage (desktop)
  Mobile.html     Homepage (mobile)
  All other pages for individuals, restaurants, businesses, events,
  the restaurant directory, about, how it works, terms and privacy,
  plus their mobile versions (the files starting with M)
  AdminLogin.html The admin portal sign in page (design only, not connected)
  The .png, .js files sit next to the pages (no folders needed)

Phones are sent to the mobile version of a page automatically.

Option 1: GitHub (recommended)
  1. Create a new repository on github.com and upload everything in this folder
     (the files inside it, not the folder itself).
  2. Go to vercel.com, sign in with GitHub, click "Add New" then "Project".
  3. Pick the repository, leave all settings as they are, click Deploy.
  4. Vercel gives you a live link. Send that to your boss.

Option 2: Vercel command line
  1. Install Node.js, then open a terminal inside this folder.
  2. Run:  npx vercel
  3. Answer the prompts (the defaults are fine). You'll get a live link.

No build step is needed. These are plain HTML files.


ADMIN SIGN IN SETUP (one time, about 15 minutes)

The admin pages use Supabase Auth for real accounts:
  AdminLogin.html        Sign in (phones get MAdminLogin.html)
  AdminSetPassword.html  Where invited admins choose a password,
                         and where password reset links land
  AdminDashboard.html    Only opens for signed in admins

1. Get a Supabase project
   Ask your dev team for the Meal POPs Supabase project, or create a
   free one at supabase.com.

2. Turn off public sign ups (important)
   Authentication, then Sign In / Providers. Keep Email turned on,
   and turn OFF "Allow new users to sign up". This keeps the admin
   portal invite only.

3. Set the website address
   Authentication, then URL Configuration.
   Site URL: your Vercel link, for example https://mealpops-design-a.vercel.app
   Redirect URLs: add https://YOUR-SITE.vercel.app/AdminSetPassword.html

4. Connect the website
   Project Settings, then API. Copy the Project URL and the
   "anon public" key into admin-config.js, then upload that
   file to GitHub again. Never use the "service_role" key.

5. Invite your first admin
   Authentication, then Users, then Invite user. Enter their email.
   They click the link in the email, choose a password, and land on
   the dashboard. After that they sign in at /AdminLogin.html.

Good to know
  The dashboard check runs in the browser, so it protects the screens.
  When real data is added (restaurants, members, and so on), protect
  that data in Supabase with Row Level Security so only signed in
  admins can read or change it.


ANIMATIONS
  motion.js adds the page fades, scroll reveals, hover effects and
  count ups. Every page loads it with one line in its <head>. Delete
  that line from a page to turn animations off there.
