import { Toast } from "@base-ui-components/react";
import { useRef } from "react";
import { useSearchParams } from "react-router";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "~/components/panel";
import { ProblemDetailTabPanel } from "~/components/problem-detail-tab-panel";
import { ProblemSetToolbar } from "~/components/problem-set-toolbar";
import { ResultComparisonTabPanel } from "~/components/result-comparison-tab-panel";
import {
  SqlEditorPanel,
  type SqlEditorRef,
} from "~/components/sql-editor-panel";
import { usePlayableProblemSet } from "~/components/use-playable-problem-set";

export default function ProblemSetPlay() {
  const toastManager = Toast.useToastManager();
  const editorRef = useRef<SqlEditorRef>(null);
  const params = useSearchParams()[0];
  const {
    problemNavigator,
    playableProblemSet,
    changeProblemStatus,
    setErrorResult,
    reset,
  } = usePlayableProblemSet({
    initialParams: params,
    onAllRight: () => {
      const id = toastManager.add({
        title: "すべての問題に正解しました！",
        actionProps: {
          children: (
            <>
              <span className="i-tabler-repeat size-4" />
              <p>解き直す</p>
            </>
          ),
          onClick: () => {
            toastManager.close(id);
            reset();
            editorRef.current?.reset();
          },
        },
      });
    },
  });

  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 min-h-0">
        <div className="grid grid-rows-[minmax(0,1fr)_320px] gap-4">
          <SqlEditorPanel
            ref={editorRef}
            navigator={problemNavigator}
            onChangeProblemStatus={changeProblemStatus}
            onSetErrorResult={setErrorResult}
          />

          <ResultComparisonTabPanel problem={problemNavigator.currentProblem} />
        </div>
        <div className="grid grid-rows-[auto_270px_minmax(0,1fr)] gap-4 w-[600px] min-h-0">
          <ProblemSetToolbar
            playableProblemSet={playableProblemSet}
            navigator={problemNavigator}
          />

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
    </>
  );
}
