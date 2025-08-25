import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 25, // 10 virtual users
  duration: "30s", // Run for 30 seconds
};

export default function () {
  const params = {
    headers: {
      Cookie:
        "chatUser=s%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxIiwiaWF0IjoxNzU2MDI5NDU1LCJleHAiOjE3NTYwNjkwNTV9.BOO5sObXgOxNRfUfBAaR8q1ACSrDDqBbH4pDfkUzJm0.aYa%2B4bCXXmNjrtRio6enykjYB59%2BY9G744%2F7hgzrD40",
    },
  };
  const res = http.get(
    "https://preplaced.schrodingers.cat/api/chat/list?userId=68a1ba78906e41c6e786c89a",
    params
  );
  check(res, { "status is 200": (r) => r.status === 200 }) ||
    console.log(`Failed with status: ${res.status}`);
}
