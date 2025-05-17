import { Separator } from "@base-ui-components/react";
import { type ReactNode, useState } from "react";
import { useNavigate } from "react-router";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "~/components/panel";
import {
  ProblemSetForm,
  type ProblemSetFormData,
} from "~/components/problem-set-form";
import type { Problem } from "~/models/problem";
import { Paths } from "../routes/paths";

type Props = {
  title: ReactNode;
  onSubmit: (data: ProblemSetFormData) => void;
  defaultValues?: ProblemSetFormData;
};

export default function ProblemSetFormLayout({
  title,
  onSubmit,
  defaultValues,
}: Props) {
  const navigate = useNavigate();
  const [previewProblemn, setPreviewProblem] = useState<undefined | Problem>(
    undefined,
  );

  function handlePreviewProblem(problem: Problem) {
    setPreviewProblem(problem);
  }

  function handleCancel() {
    navigate(Paths.home);
  }

  return (
    <div className="grid grid-cols-[1fr_minmax(200px,600px)] gap-4 min-h-0 h-full">
      <div className="bg-base-800 rounded-lg border border-base-700 p-6 grid grid-rows-[auto_minmax(0px,1fr)] gap-6 h-full min-h-0">
        {title}
        <ProblemSetForm
          defaultValues={defaultValues}
          onPreviewProblem={handlePreviewProblem}
          onSubmit={onSubmit}
          onCancel={handleCancel}
        />
      </div>
      <div className="min-h-0">
        <ProblemPreviewPanel problem={previewProblemn} />
      </div>
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
