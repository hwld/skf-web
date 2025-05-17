import { NavLink } from "react-router";
import type { ProblemSet } from "~/models/problem";
import { Paths } from "~/routes/paths";
import {
  ProblemSetCardButton,
  ProblemSetCardButtonLink,
} from "./problem-set-card-button";
import { Tooltip, TooltipProvider } from "./tooltip";

type ProblemSetCardProps = { problemSet: ProblemSet };

export function ProblemSetCard({ problemSet }: ProblemSetCardProps) {
  return (
    <div className="h-[140px] bg-base-700 rounded-lg flex flex-col justify-between p-4">
      <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
        <span className="i-tabler-folder size-5" />
        <p className="text-base font-bold truncate">{problemSet.title}</p>
      </div>
      <div className="flex justify-between items-end">
        <NavLink
          to={Paths.playProblemSet(problemSet)}
          className="size-12 rounded-full bg-primary-400 flex items-center justify-center hover:bg-primary-300 transition duration-100"
        >
          <span className="i-tabler-player-play-filled size-6 text-base-700 ml-0.5" />
        </NavLink>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip
              trigger={<ProblemSetCardButton iconClass="i-tabler-upload" />}
            >
              問題セットを共有する
            </Tooltip>
            {problemSet.isBuildIn ? null : (
              <>
                <Tooltip
                  trigger={
                    <ProblemSetCardButtonLink
                      to={Paths.editProblemSet(problemSet.id)}
                      iconClass="i-tabler-edit"
                    />
                  }
                >
                  問題セットを編集する
                </Tooltip>
                <Tooltip
                  trigger={<ProblemSetCardButton iconClass="i-tabler-trash" />}
                >
                  問題セットを削除する
                </Tooltip>
              </>
            )}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
