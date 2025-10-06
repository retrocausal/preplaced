import useApiService from "@/Core/hooks/Api";
import PATHS from "@/API";
import { useCallback, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CryptoUtil } from "@/Utils/crypto";

export default function useAuthentication(location: string = "/") {
  const path = PATHS.AUTH;
  const navigate = useNavigate();
  const { fetch, inProgress } = useApiService(path, "POST");
  const [exception, setException] = useState<string | null>(null);
  const submit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form as HTMLFormElement);
      const username = formData.get("username");
      const password = formData.get("password");
      if (!username || !password) {
        setException("Please fill in both username and password");
      } else {
        const chatUser = await fetch({
          payload: formData,
          navOptions: { replace: true },
        });
        const { error, data } = chatUser;
        const { message } = error || {};
        if (message) {
          setException(message);
        } else {
          if (data) {
            const encUser = await CryptoUtil.encrypt({ ...data });
            localStorage.setItem(import.meta.env.VITE_APP_USER, encUser);
            navigate(location, { replace: true });
          }
        }
      }
      return false;
    },
    [fetch, setException, location, navigate]
  );
  return {
    submit,
    exception,
    setException,
    inProgress,
  };
}
