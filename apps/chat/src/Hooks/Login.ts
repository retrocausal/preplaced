import useApiService from "@/Core/hooks/Api";
import PATHS from "@/API";
import { useCallback, type FormEvent } from "react";

export default function useAuthentication() {
  const path = PATHS.AUTH;
  const { fetch, ...state } = useApiService(path, "POST");
  console.log(state);

  const submit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form as HTMLFormElement);
      await fetch(formData, { replace: true });
      return false;
    },
    [fetch]
  );
  return { submit };
}
