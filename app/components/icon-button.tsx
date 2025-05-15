import clsx from "clsx";
import { type VariantProps, tv } from "tailwind-variants";

const button = tv({
	slots: {
		base: "rounded-sm grid place-items-center transition duration-100 hover:bg-white/15 text-base-100",
		icon: "",
	},
	variants: {
		size: {
			md: { base: "size-8", icon: "size-5" },
			sm: { base: "size-7", icon: "size-4" },
		},
	},
	defaultVariants: { size: "md" },
});

type Props = VariantProps<typeof button> & { iconClass: string };

export function IconButton({ size, iconClass, ...props }: Props) {
	const classes = button({ size });

	return (
		<button {...props} type="button" className={classes.base()}>
			<span className={clsx(iconClass, classes.icon())} />
		</button>
	);
}
