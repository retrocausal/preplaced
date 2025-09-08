import type { ApiState, ApiAction } from "@/Types";

export const ApiReductions = (state: ApiState, action: ApiAction): ApiState => {
  const cloned = { ...state };
  const { type, value } = action;
  switch (type) {
    case "INIT":
      cloned.inProgress = true;
      cloned.response = null;
      break;
    case "COMPLETE":
      cloned.inProgress = false;
      cloned.response = value?.response ?? null;
      break;
    default:
  }
  return cloned;
};
