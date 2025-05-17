import clsx from "clsx";
import type { ComponentProps } from "react";
import { NavLink, type NavLinkProps } from "react-router";

const buttonClass =
  "size-7 group hover:bg-base-500 rounded-sm grid place-items-center transition duration-100";
const _iconClass = "size-5 text-base-300 group-hover:text-base-100";

type BaseProps = { iconClass: string };

export function ProblemSetCardButton({
  iconClass,
  ...props
}: BaseProps & ComponentProps<"button">) {
  return (
    <button {...props} className={buttonClass}>
      <span className={clsx(iconClass, _iconClass)} />
    </button>
  );
}

export function ProblemSetCardButtonLink({
  iconClass,
  ...props
}: BaseProps & NavLinkProps) {
  return (
    <NavLink {...props} className={buttonClass}>
      <span className={clsx(iconClass, _iconClass)} />
    </NavLink>
  );
}
