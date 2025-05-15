export function Table({ children }: { children?: React.ReactNode }) {
	return (
		<div className="w-fit border-base-500 rounded-md overflow-hidden border">
			<table>{children}</table>
		</div>
	);
}

export function TableHead({ children }: { children?: React.ReactNode }) {
	return <thead className="group bg-white/10">{children}</thead>;
}

export function TableBody({ children }: { children?: React.ReactNode }) {
	return <tbody className="group">{children}</tbody>;
}

export function TableRow({ children }: { children?: React.ReactNode }) {
	return (
		// 最後のtrはborder-bをつけないが、theadのtrにはつける
		<tr className="border-base-500 not-last:border-b group-[thead]:border-b">
			{children}
		</tr>
	);
}

export function TableHeader({ children }: { children?: React.ReactNode }) {
	return (
		<th className="px-2 py-1 border-base-500 text-start font-normal not-last:border-r">
			{children}
		</th>
	);
}

export function TableData({
	children,
	colSpan,
}: { children?: React.ReactNode; colSpan?: number }) {
	return (
		<td
			className="px-2 py-1 border-base-500 text-start font-normal not-last:border-r"
			colSpan={colSpan}
		>
			{children}
		</td>
	);
}
