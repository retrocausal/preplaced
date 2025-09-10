import { createBrowserRouter } from "react-router-dom";
import Root from "@/Core/Components/Root";
import Authenticate from "@Pages/Authenticate";
import PATHS from "@/API";
import { ApiClient } from "@/Core/Fetch";
import type { LoaderData } from "@/Types";
import { CryptoUtil } from "@/Utils/crypto";
import Home from "@/Pages/Home";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      loader: async () => {
        const oNetOps = new ApiClient("GET");
        const response = await oNetOps.execute(PATHS.ROOMS);
        const { metadata } = response;
        if (metadata?.location) {
          const navIssuer: LoaderData = {
            navigation: { to: metadata.location },
            as: "NAVIGATE",
          };
          return { ...navIssuer };
        } else {
          return { fetched: { ...response } };
        }
      },
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/logout",
          loader: async ({ request }) => {
            const oNetOps = new ApiClient("POST");
            try {
              await oNetOps.execute(PATHS.LOGOUT); // Server clears HTTP-only cookies
            } catch (error) {
            } finally {
              const from =
                request.headers.get("Referer") || window.location.pathname;
              const navIssuer: LoaderData = {
                navigation: { to: import.meta.env.VITE_AUTH_BASE, from },
                as: "NAVIGATE",
              };
              const chatUser = localStorage.getItem(
                import.meta.env.VITE_APP_USER
              );
              if (chatUser) {
                CryptoUtil.deleteKey();
                localStorage.removeItem(import.meta.env.VITE_APP_USER);
              }
              return { ...navIssuer };
            }
          },
        },
      ],
    },
    {
      path: "/login",
      element: <Authenticate />,
    },
  ],
  {
    basename: import.meta.env.VITE_APP_BASE,
  }
);

export default router;

// Additional route properties that can be added as needed:
// loader: async () => fetch('/api/data'), // Example for prefetching
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
