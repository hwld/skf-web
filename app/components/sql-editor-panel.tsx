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

  // TODO:
  async function handleClickRun() {
    const sql = editorRef.current?.getValue();
    if (!sql || !db) {
      return;
    }

    // COMMITを入力されると意味ないんだけど、ミスをできるだけ減らすためにユーザーの操作をトランザクションで囲んで必ずロールバックする
    await db.transaction(async (tx) => {
      try {
        const userResult = (await tx.exec(sql, { rowMode: "array" })).at(-1) as
          | Results<string[]>
          | undefined;
        if (!userResult) {
          return;
        }

        const solutionResults = await Promise.all(
          navigator.currentProblem.solutions
            .map(async (s) => {
              return (await tx.exec(s.sql, { rowMode: "array" })).at(-1) as
                | Results<string[]>
                | undefined;
            })
            .filter(
              (result): result is Promise<Results<string[]>> =>
                result !== undefined,
            ),
        );

        const isRight = solutionResults.some((solutionResult) => {
          return isProblemResultEqual(
            userResult as Results<string[]>,
            solutionResult as Results<string[]>,
          );
        });

        onChangeProblemStatus(
          navigator.currentProblem.id,
          isRight ? "right" : "wrong",
          {
            user: {
              ...userResult,
              rows: userResult.rows.slice(0, 100),
              isTruncated: userResult.rows.length > 100,
            },
            solutions: solutionResults.map((s) => ({
              ...s,
              isTruncated: false,
            })),
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
