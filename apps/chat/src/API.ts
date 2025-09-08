import Proxify from "@/proxy";

const BASE = "/chat";

const PATHS = {
  AUTH: "/auth/login",
  LOGOUT: "/auth/logout",
  ROOMS: "/list",
};

export default Proxify(PATHS, BASE);
