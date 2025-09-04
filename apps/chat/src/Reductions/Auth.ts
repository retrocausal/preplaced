import type { Auth, AuthAction } from "@/Types";

export const AuthReductions = (state: Auth, action: AuthAction): Auth => {
  switch (action?.type) {
    case "value":
      break;

    default:
      break;
  }
  return state;
};
