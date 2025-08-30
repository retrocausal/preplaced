import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	// Loads React plugin for fast-refresh and JSX/TSX handling; enables targeted HMR updates for React components.
	plugins: [react(), tsconfigPaths({ root: "./" })],
	// Prefixes all asset URLs with '/apps/chat/'
	base: "/apps/chat/",
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@Providers": path.resolve(__dirname, "./src/Providers"),
			"@Reductions": path.resolve(__dirname, "./src/Reductions"),
			"@Pages": path.resolve(__dirname, "./src/Pages"),
			"@Router": path.resolve(__dirname, "./src/Router"),
		},
	},
	server: {
		// Restricts dev server to accept requests only from 'preplaced.schrodingers.cat' via NGINX proxy for security.
		allowedHosts: ["preplaced.schrodingers.cat"],
		// Locks dev server to port 5173 for consistent NGINX proxy routing.
		port: 5173,
		// Configures HMR to use separate client port.
		hmr: {
			// Directs browser HMR WS to port 5111 (proxied to 5173), isolating from main HTTP traffic on 443 to prevent subpath conflicts.
			clientPort: 5111, // Use a different port for WebSocket connections
		},
	},
});
