import { useState } from "react";
import { NavLink } from "react-router";
import type { ProblemSet } from "~/models/problem";
import { Paths } from "~/routes/paths";
import { Button } from "./button";
import { Dialog, DialogTitle } from "./dialog";
import {
  ProblemSetCardButton,
  ProblemSetCardButtonLink,
} from "./problem-set-card-button";
import { Tooltip, TooltipProvider } from "./tooltip";
import { useProblemSets } from "./use-problem-sets";

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
                <DeleteProblemSetDialogTrigger problemSet={problemSet} />
              </>
            )}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

function DeleteProblemSetDialogTrigger({
  problemSet,
}: { problemSet: ProblemSet }) {
  const [open, setOpen] = useState(false);
  const { removeProblemSet } = useProblemSets();

  const [pendingDelete, setPendingDelete] = useState(false);
  function handleDelete() {
    setPendingDelete(true);
    setOpen(false);
  }

  function handleAfterClose() {
    if (pendingDelete) {
      removeProblemSet(problemSet.id);
      setPendingDelete(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onCloseAnimationEnd={handleAfterClose}
      trigger={
        <Tooltip trigger={<ProblemSetCardButton iconClass="i-tabler-trash" />}>
          問題セットを削除する
        </Tooltip>
      }
    >
      <DialogTitle>"問題セット1" を削除してもよろしいですか？</DialogTitle>
      <div className="text-base-300">
        問題セットを削除すると元にもどすことはできません。削除を行う場合は「削除する」ボタンを押してください。キャンセルする場合は「キャンセル」ボタンを押してください。
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button color="secondary" onClick={() => setOpen(false)}>
          キャンセル
        </Button>
        <Button leftIconClass="i-tabler-trash" onClick={handleDelete}>
          削除する
        </Button>
      </div>
    </Dialog>
  );
}
