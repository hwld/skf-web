import { Dialog } from "@base-ui-components/react";
import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Paths } from "~/routes/paths";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { ProblemStatusBadge } from "./problem-status-badge";
import { ProgressBar } from "./progress-bar";
import { Tooltip, TooltipProvider } from "./tooltip";
import type {
  PlayableProblem,
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
          <ProblemListDialogTrigger
            problemSet={playableProblemSet}
            navigator={navigator}
          />
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

function ProblemListDialogTrigger({
  problemSet,
  navigator,
}: { problemSet: PlayableProblemSet; navigator: ProblemNavigator }) {
  const [open, setOpen] = useState(false);

  function handleClickProblemItem(id: string) {
    navigator.selectProblem(id);
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Tooltip
            trigger={
              <IconButton
                iconClass="i-tabler-list"
                onClick={() => setOpen(true)}
              />
            }
          >
            問題一覧を表示する
          </Tooltip>
        }
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black opacity-50 duration-100 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup className="fixed top-0 right-0 bottom-0 w-[500px] bg-base-800 rounded-l-lg border-l border-base-600 translate-x-0 data-[starting-style]:opacity-0 data-[starting-style]:translate-x-10 data-[ending-style]:translate-x-2 data-[ending-style]:opacity-0 transition-all duration-150 ease-in-out opacity-100 grid grid-rows-[auto_1fr]">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2 p-4 border-b border-base-600">
            <Dialog.Title className="grid grid-cols-[auto_1fr] items-center gap-1">
              <span className="i-tabler-folder size-6" />
              <p className="text-base font-bold">{problemSet.title}</p>
            </Dialog.Title>
            <Dialog.Close render={<IconButton iconClass="i-tabler-x" />} />
          </div>
          <div className="grid gap-1 p-4 overflow-auto">
            {problemSet.playableProblems.map((problem) => {
              return (
                <ProblemListItem
                  key={problem.id}
                  problem={problem}
                  active={navigator.currentProblem.id === problem.id}
                  onClick={handleClickProblemItem}
                />
              );
            })}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ProblemListItem({
  problem,
  active,
  onClick,
}: {
  problem: PlayableProblem;
  active: boolean;
  onClick: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={clsx(
        "grid grid-cols-[auto_1fr] px-2 text-start gap-2 h-8 items-center border rounded-sm",
        active
          ? "border-primary-400 bg-primary-400/10"
          : "border-transparent hover:bg-primary-400/10",
      )}
      onClick={() => onClick(problem.id)}
    >
      <ProblemStatusBadge status={problem.status} />
      <p>{problem.title}</p>
    </button>
  );
}
