import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Paths } from "~/routes/paths";
import { Button } from "./button";
import { Dialog, DialogTitle } from "./dialog";
import { IconButton } from "./icon-button";
import { TextField } from "./input";
import { PlayableProblemListDialogTrigger } from "./playable-problem-list-dialog";
import {
  type ProblemSetFormData,
  problemSetFormSchema,
} from "./problem-set-form";
import { ProblemStatusBadge } from "./problem-status-badge";
import { ProgressBar } from "./progress-bar";
import { Tooltip, TooltipProvider } from "./tooltip";
import type {
  PlayableProblemSet,
  ProblemNavigator,
} from "./use-playable-problem-set";
import { useProblemSets } from "./use-problem-sets";

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
    <div className="bg-base-900 border border-base-700 rounded-lg pl-4 pt-4 pr-3 pb-3 items-end grid grid-cols-[1fr_auto] gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <p>{playableProblemSet.title}</p>
        </div>
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
          <PlayableProblemListDialogTrigger
            problemSet={playableProblemSet}
            navigator={navigator}
          />
          {playableProblemSet.isShared ? (
            <ImportProblemSetDialogTrigger problemSet={playableProblemSet} />
          ) : null}
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

function ImportProblemSetDialogTrigger({
  problemSet,
}: { problemSet: PlayableProblemSet }) {
  const [open, setOpen] = useState(false);
  const { importProblemSet } = useProblemSets();
  const formId = useId();

  function handleImport(data: ProblemSetFormData) {
    setOpen(false);
    importProblemSet({
      id: problemSet.id,
      title: data.title,
      problemIds: problemSet.playableProblems.map((problem) => problem.id),
      isBuildIn: problemSet.isBuildIn,
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Tooltip trigger={<IconButton iconClass="i-tabler-download" />}>
          問題セットをインポートする
        </Tooltip>
      }
    >
      <DialogTitle>問題セットのインポート</DialogTitle>
      <div className="flex flex-col gap-4">
        <p className="text-base-300">
          共有された問題セット「{problemSet.title}」
          をブラウザに保存することができます。
        </p>
        <ImportProblemSetForm
          id={formId}
          problemSet={problemSet}
          onSubmit={handleImport}
        />
        <div className="flex items-center justify-end gap-2">
          <Button color="secondary" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button type="submit" leftIconClass="i-tabler-download" form={formId}>
            インポートする
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

function ImportProblemSetForm({
  problemSet,
  id,
  onSubmit,
}: {
  problemSet: PlayableProblemSet;
  id: string;
  onSubmit: (data: ProblemSetFormData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: problemSet.title,
      problemIds: problemSet.playableProblems.map((p) => ({ value: p.id })),
    },
    resolver: zodResolver(problemSetFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={id}>
      <TextField
        label="タイトル"
        placeholder="問題セットのタイトルを入力してください..."
        error={errors.title?.message}
        {...register("title")}
      />
    </form>
  );
}
