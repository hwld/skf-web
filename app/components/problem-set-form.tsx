import { Checkbox } from "@base-ui-components/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { allProblems } from "~/data/all-problems";
import type { Problem } from "~/models/problem";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { TextField } from "./input";
import { Tooltip } from "./tooltip";

export const problemSetFormSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  problemIds: z
    .array(z.object({ value: z.string() }))
    .min(1, "問題を選択してください"),
});
export type ProblemSetFormData = z.infer<typeof problemSetFormSchema>;

export function ProblemSetForm({
  defaultValues,
  onPreviewProblem,
  onSubmit,
  onCancel,
}: {
  defaultValues?: ProblemSetFormData;
  onPreviewProblem: (problem: Problem) => void;
  onSubmit: (data: ProblemSetFormData) => void;
  onCancel: () => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProblemSetFormData>({
    defaultValues,
    resolver: zodResolver(problemSetFormSchema),
  });

  const {
    fields: selectedProblemIds,
    append: appendProblemId,
    remove: removeProblemid,
  } = useFieldArray({
    control,
    name: "problemIds",
  });

  function handleSelectedChange(problemId: string, selected: boolean) {
    if (selected) {
      appendProblemId({ value: problemId });
    } else {
      removeProblemid(
        selectedProblemIds.findIndex(({ value }) => value === problemId),
      );
    }
  }

  return (
    <form
      className="grid grid-rows-[auto_1fr_auto] gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        label="タイトル"
        placeholder="問題セットのタイトルを入力してください"
        error={errors.title?.message}
        {...register("title")}
      />
      <div className="grid grid-rows-[auto_1fr] gap-2 min-h-0">
        <p className="text-xs">問題</p>
        <div
          aria-invalid={!!errors.problemIds?.message}
          className="border border-base-700 rounded-lg p-2 gap-2 grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] overflow-auto aria-[invalid=true]:border-red-400"
        >
          {allProblems.map((p) => {
            return (
              <ProblemCard
                key={p.id}
                problem={p}
                selected={
                  !!selectedProblemIds.find(({ value }) => value === p.id)
                }
                onPreview={onPreviewProblem}
                onSelectedChange={handleSelectedChange}
              />
            );
          })}
        </div>
        <div className="h-4">
          {errors.problemIds?.message ? (
            <p className="text-xs text-red-400">{errors.problemIds.message}</p>
          ) : null}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button color="secondary" onClick={onCancel}>
          キャンセル
        </Button>
        <Button
          type="submit"
          color="primary"
          leftIconClass={
            defaultValues ? "i-tabler-edit" : "i-tabler-folder-plus"
          }
        >
          {defaultValues ? "更新する" : "作成する"}
        </Button>
      </div>
    </form>
  );
}

function ProblemCard({
  problem,
  onPreview,
  selected,
  onSelectedChange,
}: {
  problem: Problem;
  onPreview: (problem: Problem) => void;
  selected: boolean;
  onSelectedChange: (id: string, selected: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] has-[label:hover]:bg-base-700 transition-all duration-100 border items-center h-12 rounded-md pr-2 bg-base-800 has-checked:border-primary-400 border-base-700">
      {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
      <label className="grid grid-cols-[auto_1fr] items-center gap-2 h-full cursor-pointer px-2">
        <Checkbox.Root
          checked={selected}
          onCheckedChange={() => onSelectedChange(problem.id, !selected)}
          className="grid place-items-center size-4 border rounded-xs border-base-100 data-checked:border-primary-400"
        >
          <Checkbox.Indicator className="size-2 bg-primary-400 rounded-xs" />
        </Checkbox.Root>
        {problem.title}
      </label>
      <Tooltip
        trigger={
          <IconButton
            iconClass="i-tabler-eye"
            onClick={() => onPreview(problem)}
          />
        }
      >
        問題のプレビューを表示
      </Tooltip>
    </div>
  );
}
