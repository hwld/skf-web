import clsx from "clsx";
import type { ReactNode } from "react";
import { type VariantProps, tv } from "tailwind-variants";

const button = tv({
  slots: {
    base: "flex gap-1 transition duration-100 rounded-sm border items-center px-2",
    icon: "",
  },
  variants: {
    size: {
      md: { base: "h-8", icon: "size-5" },
      sm: { base: "h-7", icon: "size-4" },
    },
    color: {
      primary: {
        base: "bg-primary-400 text-base-900 border-transparent hover:bg-primary-300",
        icon: "text-base-900",
      },
      secondary: {
        base: "text-base-100 border-base-500 hover:bg-white/15",
        icon: "text-base-100",
      },
    },
    disabled: {
      true: { base: "pointer-events-none opacity-50 select-none" },
    },
  },
  defaultVariants: { size: "md", color: "primary" },
});

type ButtonProps = VariantProps<typeof button> & {
  leftIconClass?: string;
  rightIconClass?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function Button({
  color,
  size,
  disabled,
  leftIconClass,
  rightIconClass,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const classes = button({
    color,
    size,
    disabled,
  });

  return (
    <button
      {...props}
      type="button"
      className={classes.base()}
      disabled={disabled}
      onClick={onClick}
    >
      {leftIconClass ? (
        <span className={clsx(leftIconClass, classes.icon())} />
      ) : null}
      {children}
      {rightIconClass ? (
        <span className={clsx(rightIconClass, classes.icon())} />
      ) : null}
    </button>
  );
}
