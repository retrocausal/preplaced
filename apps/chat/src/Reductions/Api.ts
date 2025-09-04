import type { ApiState, ApiAction } from "@/Types";

export const ApiReductions = (state: ApiState, action: ApiAction): ApiState => {
  const cloned = { ...state };
  const { type, value } = action;
  switch (type) {
    case "INIT":
      cloned.inProgress = true;
      cloned.response = null;
      cloned.error = null;
      break;
    case "SUCCESS":
      cloned.inProgress = false;
      cloned.response = value?.response ?? null;
      cloned.error = null;
      break;
    case "FAILURE":
      cloned.inProgress = false;
      cloned.response = value?.response ?? null;
      cloned.error = value?.error ?? null;
      break;
    default:
  }
  return cloned;
};
