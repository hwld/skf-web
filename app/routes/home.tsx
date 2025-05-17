import { NavLink } from "react-router";
import PageTitle from "~/components/page-title";
import { ProblemSetCard } from "~/components/problem-set-card";
import { useProblemSets } from "~/components/use-problem-sets";
import { Paths } from "./paths";

export function meta() {
  return [{ title: "skf-web" }, { name: "description", content: "skf-web" }];
}

export default function Home() {
  const { problemSets } = useProblemSets();

  return (
    <main className="rounded-lg bg-base-900 border gap-10 border-base-700 grid grid-cols-[1fr_auto] p-6">
      <div className="flex flex-col gap-4">
        <PageTitle iconClass="i-tabler-folders" title="問題セット" />

        <NavLink
          to={Paths.createProblemSet}
          className="border border-primary-800 bg-primary-800/15 rounded-lg p-4 w-full gap-2 flex flex-col items-center hover:bg-primary-800/25 transition duration-100"
        >
          <span className="i-tabler-folder-plus size-8" />
          <p>問題セットを作成する</p>
          <p className="text-base-300 text-xs">
            ※LocalStorageに保存されるため、キャッシュ削除などで消えてしまう可能性があります。
          </p>
        </NavLink>

        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
          {problemSets.map((set) => {
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
