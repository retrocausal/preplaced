import type { FunctionComponent } from "react";
type Props = {
  width?: string | number;
  height?: string | number;
  fill?: string;
};

export const CaretDown: FunctionComponent = (props: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width ?? "100%"}
    height={props.height ?? "100%"}
    viewBox="0 0 12 12"
  >
    <path
      fill={props.fill ?? "currentColor"}
      d="M3.076 4.617A1 1 0 0 1 4 4h4a1 1 0 0 1 .707 1.707l-2 2a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1-.217-1.09ZM4 5l1.823 1.823a.25.25 0 0 0 .354 0L8 5H4Z"
    ></path>
  </svg>
);
