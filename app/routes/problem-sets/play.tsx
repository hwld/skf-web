import { Separator, Tabs } from "@base-ui-components/react";
import { KeyCode, KeyMod, type editor } from "monaco-editor";
import { useMemo, useRef } from "react";
import { useSearchParams } from "react-router";
import { Button } from "~/components/button";
import { useDb } from "~/components/db-provider";
import { IconButton } from "~/components/icon-button";
import { Kbd, KbdList } from "~/components/kbd";
import {
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  PanelTitle,
  TabPanelIndicator,
  TabPanelTitle,
} from "~/components/panel";
import { ProblemStatusBadge } from "~/components/problem-status-badge";
import { ProgressBar } from "~/components/progress-bar";
import { SqlEditor, type SqlEditorCommand } from "~/components/sql-editor";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/table";
import { Tooltip, TooltipProvider } from "~/components/tooltip";
import { usePlayableProblemSet } from "~/components/use-playable-problem-set";

const expectedTitle = "Expected";
const sqlSolutionTitle = "SQL Solution";

export default function ProblemSetPlay() {
  const params = useSearchParams()[0];
  const {
    playableProblemSet,
    currentProblem,
    isFirstProblem,
    nextProblem,
    isLastProblem,
    prevProblem,
    progressRate,
    changeProblemStatus,
    setErrorResult,
  } = usePlayableProblemSet(params);

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
      handler: prevProblem,
    },
    {
      id: "next",
      keybinding: KeyMod.CtrlCmd | KeyCode.KeyL,
      handler: nextProblem,
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

        //TODO: 期待する結果と判定を行う

        changeProblemStatus(currentProblem.id, "right", {
          ...lastResult,
          rows: lastResult.rows.slice(0, 100) as string[][],
          isTruncated: lastResult.rows.length > 100,
        });
      } catch (e) {
        if (e instanceof Error) {
          setErrorResult(currentProblem.id, e.message);
        }
      } finally {
        await tx.rollback();
      }
    });
  }

  const resultContent = useMemo(() => {
    switch (currentProblem.status) {
      case "idle": {
        return (
          <p className="text-base-300">
            SQLを実行すると、ここに結果が表示されます
          </p>
        );
      }
      case "error": {
        return <p className="text-red-400">Error: {currentProblem.message}</p>;
      }
      case "right":
      case "wrong": {
        return (
          <>
            <p className="text-base-300 text-xs">実行結果</p>
            <Table>
              <TableHead>
                <TableRow>
                  {currentProblem.result.fields.map((f) => {
                    return <TableHeader key={f.name}>{f.name}</TableHeader>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentProblem.result.rows.length > 0 ? (
                  <>
                    {currentProblem.result.rows.map((row, i) => {
                      return (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        <TableRow key={i}>
                          {row.map((v, i) => {
                            return <TableData key={`${i}-${v}`}>{v}</TableData>;
                          })}
                        </TableRow>
                      );
                    })}
                    {currentProblem.result.isTruncated ? (
                      <TableRow>
                        <TableData
                          colSpan={currentProblem.result.fields.length}
                        >
                          <span className="text-base-300 text-xs">
                            100行を超えると省略されます...
                          </span>
                        </TableData>
                      </TableRow>
                    ) : null}
                  </>
                ) : (
                  <TableRow>
                    <TableData colSpan={currentProblem.result.fields.length}>
                      データが存在しません
                    </TableData>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        );
      }
      default: {
        throw new Error(currentProblem satisfies never);
      }
    }
  }, [currentProblem]);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 min-h-0">
      <div className="grid grid-rows-[1fr_320px] gap-4">
        <Panel>
          <PanelHeader>
            <PanelTitle iconClass="i-tabler-code" title="SQL editor" />
          </PanelHeader>
          <PanelBody noPadding>
            <SqlEditor
              ref={editorRef}
              problem={currentProblem}
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
                      disabled={isFirstProblem}
                      onClick={prevProblem}
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
                      disabled={isLastProblem}
                      onClick={nextProblem}
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

        <Panel>
          <PanelHeader>
            <PanelTitle iconClass="i-tabler-prompt" title="Result" />
          </PanelHeader>
          <PanelBody>
            <div className="flex flex-col gap-2 w-fit">{resultContent}</div>
          </PanelBody>
        </Panel>
      </div>
      <div className="grid grid-rows-[auto_270px_1fr] gap-4 w-[600px] min-h-0">
        <div className="bg-base-800 border border-base-700 rounded-lg pl-4 pt-4 pr-3 pb-3 items-end grid grid-cols-[1fr_auto] gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs">{playableProblemSet.title}</p>
            <div className="grid grid-cols-[auto_1fr] items-center gap-1">
              <ProblemStatusBadge status={currentProblem.status} />
              <p className="text-base font-bold truncate">
                {currentProblem.title}
              </p>
            </div>
            <ProgressBar value={progressRate} />
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
              {currentProblem.description}
            </div>
          </PanelBody>
        </Panel>

        <Tabs.Root render={Panel} defaultValue={expectedTitle}>
          <PanelHeader>
            <Tabs.List className="flex gap-2 h-full items-center relative">
              <TabPanelTitle
                iconClass="i-tabler-database"
                title={expectedTitle}
              />
              <Separator
                orientation="vertical"
                className="w-px bg-base-500 h-2/3"
              />
              <TabPanelTitle
                iconClass="i-tabler-code"
                title={sqlSolutionTitle}
              />
              <TabPanelIndicator />
            </Tabs.List>
          </PanelHeader>
          <Tabs.Panel render={PanelBody} value={expectedTitle}>
            <div className="flex flex-col gap-6">
              {currentProblem.solutions.map((solution, index) => {
                const lines = solution.expectedCsv.split("\n");
                const columnNames = lines[0].split(",");
                const firstRows = lines[1].split(",");
                const paris = columnNames.map((column, index) => ({
                  column,
                  value: firstRows[index],
                }));

                return (
                  <div key={solution.sql} className="flex flex-col gap-2">
                    <p className="text-base-300 text-xs">
                      期待する列名と最初の行の値
                      {currentProblem.solutions.length > 1
                        ? ` ${index + 1}`
                        : ""}
                    </p>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>列名</TableHeader>
                          <TableHeader>最初の行の値</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paris.map(({ column, value }) => {
                          return (
                            <TableRow key={`${column}-${value}`}>
                              <TableData>{column}</TableData>
                              <TableData>{value}</TableData>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>
          </Tabs.Panel>
          <Tabs.Panel render={PanelBody} value={sqlSolutionTitle}>
            <div className="flex flex-col gap-6">
              {currentProblem.solutions.map((solution, index) => (
                <div key={solution.sql} className="flex flex-col gap-2">
                  {index > 0 ? (
                    <Separator
                      orientation="horizontal"
                      className="h-px bg-base-500"
                    />
                  ) : null}
                  <p className="text-base-300 text-xs">回答例{index + 1}</p>
                  <p className="whitespace-pre-wrap">{solution.sql}</p>
                </div>
              ))}
            </div>
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </div>
  );
}
