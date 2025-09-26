import Proxify from "@/proxy";

const BASE = "/chat";

const PATHS = {
  AUTH: "/auth/login",
  LOGOUT: "/auth/logout",
  ROOMS: "/list",
  CONVERSATION: "/conversation",
};

export default Proxify(PATHS, BASE);
