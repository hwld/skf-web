import { useSearchParams } from "react-router";
import { Button } from "~/components/button";
import { IconButton } from "~/components/icon-button";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "~/components/panel";
import { ProblemDetailTabPanel } from "~/components/problem-detail-tab-panel";
import { ProblemStatusBadge } from "~/components/problem-status-badge";
import { ProgressBar } from "~/components/progress-bar";
import { ResultComparisonTabPanel } from "~/components/result-comparison-tab-panel";
import { SqlEditorPanel } from "~/components/sql-editor-panel";
import { Tooltip, TooltipProvider } from "~/components/tooltip";
import { usePlayableProblemSet } from "~/components/use-playable-problem-set";

export default function ProblemSetPlay() {
  const params = useSearchParams()[0];
  const {
    problemNavigator,
    playableProblemSet,
    changeProblemStatus,
    setErrorResult,
  } = usePlayableProblemSet(params);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 min-h-0">
      <div className="grid grid-rows-[minmax(0,1fr)_320px] gap-4">
        <SqlEditorPanel
          navigator={problemNavigator}
          onChangeProblemStatus={changeProblemStatus}
          onSetErrorResult={setErrorResult}
        />

        <ResultComparisonTabPanel problem={problemNavigator.currentProblem} />
      </div>
      <div className="grid grid-rows-[auto_270px_minmax(0,1fr)] gap-4 w-[600px] min-h-0">
        {/* 問題セットのツールバー */}
        <div className="bg-base-800 border border-base-700 rounded-lg pl-4 pt-4 pr-3 pb-3 items-end grid grid-cols-[1fr_auto] gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs">{playableProblemSet.title}</p>
            <div className="grid grid-cols-[auto_1fr] items-center gap-1">
              <ProblemStatusBadge
                status={problemNavigator.currentProblem.status}
              />
              <p className="text-base font-bold truncate">
                {problemNavigator.currentProblem.title}
              </p>
            </div>
            <ProgressBar value={problemNavigator.progressRate} />
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
            <Button color="secondary" leftIconClass="i-tabler-x">
              終了
            </Button>
          </div>
        </div>

        <Panel>
          <PanelHeader>
            <PanelTitle iconClass="i-tabler-file-text" title="Problem" />
          </PanelHeader>
          <PanelBody>
            <div className="whitespace-pre-wrap">
              {problemNavigator.currentProblem.description}
            </div>
          </PanelBody>
        </Panel>

        <ProblemDetailTabPanel problem={problemNavigator.currentProblem} />
      </div>
    </div>
  );
}
