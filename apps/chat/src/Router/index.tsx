import { createBrowserRouter } from "react-router-dom";
import Authenticate from "@Pages/Authenticate";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <div>Placeholder Home blah</div>,
    },
    { path: "/login", element: <Authenticate /> },
  ],
  {
    basename: "/apps/chat/", // Matches Vite base and NGINX subpath
  }
);
export default router;

// Additional route properties that can be added as needed:
// loader: async () => fetch('/api/data'), // Example for prefetching (uncomment and customize as needed)
// action: () => { /* Handle form submissions or mutations */ },
// errorElement: <div>Error Page</div>, // Fallback UI for errors in this route
// children: [ /* Array of nested child routes */ ],
// index: true, // Marks this as an index route (default for parent)
// caseSensitive: false, // Whether path matching is case-sensitive (default: false)
// id: 'home', // Unique ID for the route (useful for data APIs)
// hydrateFallbackElement: <div>Loading...</div>, // SSR-specific fallback during hydration
// shouldRevalidate: () => true, // Function to control revalidation after actions/loaders
// handle: { /* Arbitrary data object for custom use in hooks */ },
// lazy: () => import('./SomeLazyComponent'), // Lazy-load the route's component/loader/etc.
