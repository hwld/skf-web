import { useNavigate } from "react-router";
import { Paths } from "~/routes/paths";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { ProblemStatusBadge } from "./problem-status-badge";
import { ProgressBar } from "./progress-bar";
import { Tooltip, TooltipProvider } from "./tooltip";
import type {
  PlayableProblemSet,
  ProblemNavigator,
} from "./use-playable-problem-set";

export function ProblemSetToolbar({
  playableProblemSet,
  navigator,
}: {
  playableProblemSet: PlayableProblemSet;
  navigator: ProblemNavigator;
}) {
  const navigate = useNavigate();

  function handleEnd() {
    navigate(Paths.home);
  }

  return (
    <div className="bg-base-800 border border-base-700 rounded-lg pl-4 pt-4 pr-3 pb-3 items-end grid grid-cols-[1fr_auto] gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs">{playableProblemSet.title}</p>
        <div className="grid grid-cols-[auto_1fr] items-center gap-1">
          <ProblemStatusBadge status={navigator.currentProblem.status} />
          <p className="text-base font-bold truncate">
            {navigator.currentProblem.title}
          </p>
        </div>
        <ProgressBar value={navigator.progressRate} />
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip trigger={<IconButton iconClass="i-tabler-list" />}>
            問題一覧を表示する
          </Tooltip>
          <Tooltip trigger={<IconButton iconClass="i-tabler-download" />}>
            問題セットをインポートする
          </Tooltip>
        </TooltipProvider>
        <Button
          color="secondary"
          leftIconClass="i-tabler-x"
          onClick={handleEnd}
        >
          終了
        </Button>
      </div>
    </div>
  );
}
