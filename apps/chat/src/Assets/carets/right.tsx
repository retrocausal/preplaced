import type { FunctionComponent } from "react";
type Props = {
  width?: string | number;
  height?: string | number;
  fill?: string;
};
export const CaretRight: FunctionComponent = (props: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width ?? "100%"}
    height={props.height ?? "100%"}
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      fill={props.fill ?? "currentColor"}
      d="M4 3.994c0-.887 1.07-1.335 1.702-.712l2.037 2.006a1 1 0 0 1 0 1.425L5.702 8.719C5.069 9.34 4 8.893 4 8.006V3.994ZM7.037 6L5 3.994v4.012L7.037 6Z"
    ></path>
  </svg>
);
