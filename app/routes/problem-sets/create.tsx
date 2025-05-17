import { Checkbox, Separator } from "@base-ui-components/react";
import { useState } from "react";
import { Button } from "~/components/button";
import { IconButton } from "~/components/icon-button";
import PageTitle from "~/components/page-title";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "~/components/panel";
import { Tooltip } from "~/components/tooltip";
import { allProblems } from "~/data/all-problems";
import type { Problem } from "~/models/problem";

export default function ProblemSetCreate() {
  const [previewProblemn, setPreviewProblem] = useState<undefined | Problem>(
    undefined,
  );

  function handlePreview(problem: Problem) {
    setPreviewProblem(problem);
  }

  return (
    <div className="grid grid-cols-[1fr_minmax(200px,500px)] gap-4 min-h-0 h-full">
      <div className="bg-base-800 rounded-lg border border-base-700 p-6 grid grid-rows-[auto_minmax(0px,1fr)] gap-6 h-full min-h-0">
        <PageTitle iconClass="i-tabler-folder-plus" title="問題セットの作成" />
        <div className="grid grid-rows-[auto_1fr_auto] gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-xs w-fit">
              タイトル
            </label>
            <input
              id="title"
              name="title"
              className="border h-8 rounded-sm border-base-600 bg-white/5 placeholder:text-base-400 px-2 max-w-[500px] w-full"
              placeholder="問題セットのタイトルを入力してください..."
            />
          </div>
          <div className="grid grid-rows-[auto_1fr] gap-2 min-h-0">
            <p className="text-xs">問題</p>
            <div className="border border-base-600 rounded-lg p-2 gap-2 grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] overflow-auto">
              {allProblems.map((p) => {
                return (
                  <ProblemCard
                    key={p.id}
                    problem={p}
                    onPreview={handlePreview}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button color="secondary">キャンセル</Button>
            <Button color="primary" leftIconClass="i-tabler-folder-plus">
              作成する
            </Button>
          </div>
        </div>
      </div>
      <div className="min-h-0">
        <ProblemPreviewPanel problem={previewProblemn} />
      </div>
    </div>
  );
}

function ProblemCard({
  problem,
  onPreview,
}: { problem: Problem; onPreview: (problem: Problem) => void }) {
  return (
    <div className="grid grid-cols-[1fr_auto] has-[label:hover]:bg-base-600 transition-all duration-100 border items-center h-12 rounded-md pr-2 bg-base-700 has-checked:border-primary-400 border-transparent">
      {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
      <label className="grid grid-cols-[auto_1fr] items-center gap-2 h-full cursor-pointer px-2">
        <Checkbox.Root
          name={"problemIds"}
          value={problem.id}
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

function ProblemPreviewPanel({ problem }: { problem: Problem | undefined }) {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle iconClass="i-tabler-eye" title="Preview" />
      </PanelHeader>
      <PanelBody>
        {problem ? (
          <div className="flex flex-col gap-6 min-h-full">
            <p className="font-bold text-base">{problem.title}</p>
            <div className="flex flex-col gap-2">
              <p className="text-base-300 text-xs">問題文</p>
              <p className="whitespace-pre-wrap">{problem.description}</p>
            </div>
            <Separator orientation="horizontal" className="h-px bg-base-600" />
            <div className="flex flex-col gap-2">
              <p className="text-base-300 text-xs">回答例</p>
              <div className="border p-2 border-base-700 rounded-md [&_pre]:bg-transparent! [&_pre]:whitespace-pre-wrap!">
                <div
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{
                    __html: problem.solutions[0].sqlHtml,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full grid place-items-center">
            <p className="flex items-center gap-1 text-xs">
              <span className="text-nowrap">問題の</span>
              <span className="i-tabler-eye" />
              <span className="text-nowrap">
                をクリックすると問題のプレビューが表示されます
              </span>
            </p>
          </div>
        )}
      </PanelBody>
    </Panel>
  );
}
