import type { Results } from "@electric-sql/pglite";
import { KeyCode, KeyMod, type editor } from "monaco-editor";
import { useRef } from "react";
import { isProblemResultEqual } from "~/models/problem";
import { Button } from "./button";
import { useDb } from "./db-provider";
import { Kbd, KbdList } from "./kbd";
import {
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  PanelTitle,
} from "./panel";
import { SqlEditor, type SqlEditorCommand } from "./sql-editor";
import { Tooltip, TooltipProvider } from "./tooltip";
import type {
  ProblemNavigator,
  UsePlayableProblemSet,
} from "./use-playable-problem-set";

type Props = {
  navigator: ProblemNavigator;
  onChangeProblemStatus: UsePlayableProblemSet["changeProblemStatus"];
  onSetErrorResult: UsePlayableProblemSet["setErrorResult"];
};

export function SqlEditorPanel({
  navigator,
  onChangeProblemStatus,
  onSetErrorResult,
}: Props) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const editorCommands: SqlEditorCommand[] = [
    {
      id: "run",
      keybinding: KeyMod.CtrlCmd | KeyCode.Enter,
      handler: () => {
        handleClickRun();
      },
    },
    {
      id: "prev",
      keybinding: KeyMod.CtrlCmd | KeyCode.KeyD,
      handler: navigator.prevProblem,
    },
    {
      id: "next",
      keybinding: KeyMod.CtrlCmd | KeyCode.KeyL,
      handler: navigator.nextProblem,
    },
  ];
  const runCommandKbd = (
    <KbdList>
      <Kbd>Cmd</Kbd>+<Kbd>Enter</Kbd>
    </KbdList>
  );
  const prevCommandKbd = (
    <KbdList>
      <Kbd>Cmd</Kbd>+<Kbd>D</Kbd>
    </KbdList>
  );
  const nextCommandKbd = (
    <KbdList>
      <Kbd>Cmd</Kbd>+<Kbd>L</Kbd>
    </KbdList>
  );

  const db = useDb();
  const isDbLoading = db === undefined;

  async function handleClickRun() {
    const sql = editorRef.current?.getValue();
    if (!sql || !db) {
      return;
    }

    // COMMITを入力されると意味ないんだけど、ミスをできるだけ減らすためにユーザーの操作をトランザクションで囲んで必ずロールバックする
    await db.transaction(async (tx) => {
      try {
        const lastResult = (await tx.exec(sql, { rowMode: "array" })).at(-1);
        if (!lastResult) {
          return;
        }

        const isRight = navigator.currentProblem.solutions
          .map((solution) => {
            return isProblemResultEqual(
              lastResult as Results<string[]>,
              solution.expectedResult,
            );
          })
          .some(Boolean);

        onChangeProblemStatus(
          navigator.currentProblem.id,
          isRight ? "right" : "wrong",
          {
            ...lastResult,
            rows: lastResult.rows.slice(0, 100) as string[][],
            isTruncated: lastResult.rows.length > 100,
          },
        );
      } catch (e) {
        if (e instanceof Error) {
          onSetErrorResult(navigator.currentProblem.id, e.message);
        }
      } finally {
        await tx.rollback();
      }
    });
  }

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle iconClass="i-tabler-code" title="SQL editor" />
      </PanelHeader>
      <PanelBody noPadding noOverflow>
        <SqlEditor
          ref={editorRef}
          problem={navigator.currentProblem}
          commands={editorCommands}
        />
      </PanelBody>
      <PanelFooter>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip
              trigger={
                <Button
                  color="secondary"
                  leftIconClass="i-tabler-chevron-left"
                  disabled={navigator.isFirstProblem}
                  onClick={navigator.prevProblem}
                >
                  前の問題
                </Button>
              }
            >
              {prevCommandKbd}
            </Tooltip>
            <Tooltip
              trigger={
                <Button
                  color="secondary"
                  rightIconClass="i-tabler-chevron-right"
                  disabled={navigator.isLastProblem}
                  onClick={navigator.nextProblem}
                >
                  次の問題
                </Button>
              }
            >
              {nextCommandKbd}
            </Tooltip>
            <Tooltip
              trigger={
                <Button
                  leftIconClass={
                    isDbLoading
                      ? "i-tabler-loader animate-spin"
                      : "i-tabler-player-play-filled"
                  }
                  disabled={isDbLoading}
                  onClick={handleClickRun}
                >
                  {isDbLoading ? "DBを準備中" : "実行"}
                </Button>
              }
            >
              {runCommandKbd}
            </Tooltip>
          </TooltipProvider>
        </div>
      </PanelFooter>
    </Panel>
  );
}
