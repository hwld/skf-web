import clsx from "clsx";

type Props = { iconClass: string; title: string };
export default function PageTitle({ iconClass, title }: Props) {
  return (
    <h2 className="grid grid-cols-[auto_1fr] items-center gap-2">
      <span className={clsx(iconClass, "size-6")} />
      <p className="text-lg">{title}</p>
    </h2>
  );
}
