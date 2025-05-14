import clsx from "clsx";
import PageTitle from "~/components/page-title";
import { buildInProblemSet } from "~/data/build-in-problem-set";
import type { ProblemSet } from "~/models/problem";

export function meta() {
	return [{ title: "skf-web" }, { name: "description", content: "skf-web" }];
}

export default function Home() {
	return (
		<main className="rounded-lg bg-base-800 border gap-10 border-base-700 grid grid-cols-[1fr_auto] p-6">
			<div className="flex flex-col gap-4">
				<PageTitle iconClass="i-tabler-folders" title="問題セット" />

				<button
					type="button"
					className="border border-primary-600 bg-primary-700/15 rounded-lg p-4 w-full gap-2 flex flex-col items-center hover:bg-primary-700/25 transition duration-100"
				>
					<span className="i-tabler-folder-plus size-8" />
					<p>Problem Setを作成する</p>
					<p className="text-base-300 text-xs">
						※LocalStorageに保存されるため、キャッシュ削除などで消えてしまう可能性があります。
					</p>
				</button>

				<div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
					{buildInProblemSet.map((set) => {
						return <ProblemSetCard key={set.id} problemSet={set} />;
					})}
				</div>
			</div>
			<div className="bg-base-950 rounded-lg border border-base-700 p-10 gap-6 hidden xl:flex flex-col 2xl:w-[700px]">
				<div className="grid place-items-center gap-6 sticky top-[100px] mt-[200px]">
					<img src="./logo.svg" className="h-10 2xl:h-16" alt="アプリロゴ" />
					<div className="text-center text-xs 2xl:text-sm">
						<p>データサイエンス100本ノック(構造化データ加工編) -SQL-</p>
						<p> をブラウザで解くことのできるWebアプリです</p>
					</div>
				</div>
			</div>
		</main>
	);
}

type ProblemSetCardProps = { problemSet: ProblemSet };

function ProblemSetCard({ problemSet }: ProblemSetCardProps) {
	return (
		<div className="h-[140px] bg-base-700 rounded-lg flex flex-col justify-between p-4">
			<div className="grid grid-cols-[auto_1fr] gap-2 items-center">
				<span className="i-tabler-folder size-5" />
				<p className="text-base font-bold truncate">{problemSet.title}</p>
			</div>
			<div className="flex justify-between items-end">
				<button
					type="button"
					className="size-12 rounded-full bg-primary-400 flex items-center justify-center hover:bg-primary-300 transition duration-100"
				>
					<span className="i-tabler-player-play-filled size-6 text-base-700 ml-0.5" />
				</button>
				<div className="flex gap-2">
					<ProblemSetCardButton iconClass="i-tabler-upload" />
					<ProblemSetCardButton iconClass="i-tabler-edit" />
					<ProblemSetCardButton iconClass="i-tabler-trash" />
				</div>
			</div>
		</div>
	);
}

type ProblemSetCardButtonProps = { iconClass: string };

function ProblemSetCardButton({ iconClass }: ProblemSetCardButtonProps) {
	return (
		<button
			type="button"
			className="size-7 group hover:bg-base-500 rounded-sm grid place-items-center transition duration-100"
		>
			<span
				className={clsx(
					iconClass,
					"size-5 text-base-300 group-hover:text-base-100",
				)}
			/>
		</button>
	);
}
