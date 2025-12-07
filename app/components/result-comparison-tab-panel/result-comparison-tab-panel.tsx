import { Separator, Tabs } from "@base-ui-components/react";
import clsx from "clsx";
import { useMemo } from "react";
import {
  Panel,
  PanelBody,
  PanelHeader,
  TabPanelIndicator,
  TabPanelTitle,
} from "../panel";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import type { PlayableProblem } from "../use-playable-problem-set";
import relationshipsSvg from "./relationships.svg";
import {
  type ResultComparisonTab,
  ResultComparisonTabs,
  useResultComparisonTab,
} from "./tab-provider";

type Props = { problem: PlayableProblem };

export function ResultComparisonTabPanel({ problem }: Props) {
  const { tab, setTab } = useResultComparisonTab();

  return (
    <Tabs.Root render={Panel} value={tab} onValueChange={setTab}>
      <PanelHeader>
        <Tabs.List className="flex gap-2 h-full items-center relative">
          <TabPanelTitle
            iconClass="i-tabler-hierarchy"
            title={ResultComparisonTabs.relationships}
          />
          <Separator
            orientation="vertical"
            className="w-px bg-base-600 h-2/3"
          />
          <TabPanelTitle
            iconClass="i-tabler-prompt"
            title={ResultComparisonTabs.result}
          />
          <Separator
            orientation="vertical"
            className="w-px bg-base-600 h-2/3"
          />
          <TabPanelTitle
            iconClass="i-tabler-database"
            title={ResultComparisonTabs.expected}
          />
          <TabPanelIndicator />
        </Tabs.List>
      </PanelHeader>
      <RelationShipsTabPanelBody tab={ResultComparisonTabs.relationships} />
      <ResultTabPanelBody problem={problem} tab={ResultComparisonTabs.result} />
      <ExpectedTabPanelBody
        problem={problem}
        tab={ResultComparisonTabs.expected}
      />
    </Tabs.Root>
  );
}

function RelationShipsTabPanelBody({ tab }: { tab: ResultComparisonTab }) {
  return (
    <Tabs.Panel render={PanelBody} value={tab}>
      <div className="grid grid-rows-[auto_minmax(0,1fr)] gap-2 h-full">
        <p className="text-base-300 text-xs">
          テーブルのリレーションシップ (リレーションシップ以外を省略しています)
        </p>
        <img
          src={relationshipsSvg}
          alt="Relationships Diagram"
          className="h-full object-contain p-1 rounded-sm bg-base-600"
        />
      </div>
    </Tabs.Panel>
  );
}

function ResultTabPanelBody({
  problem,
  tab,
}: { problem: PlayableProblem; tab: ResultComparisonTab }) {
  const resultContent = useMemo(() => {
    switch (problem.status) {
      case "idle": {
        return (
          <p className="text-base-300">
            SQLを実行すると、ここに結果が表示されます
          </p>
        );
      }
      case "error": {
        return <p className="text-red-400">Error: {problem.message}</p>;
      }
      case "right":
      case "wrong": {
        return (
          <>
            <p
              className={clsx(
                "flex items-center gap-1",
                problem.status === "right" ? "text-green-400" : "text-red-400",
              )}
            >
              <span
                className={clsx(
                  "size-4",
                  problem.status === "right" ? "i-tabler-check" : "i-tabler-x",
                )}
              />
              {`実行結果 - ${problem.status === "right" ? "正解" : "不正解"}`}
            </p>
            <Table>
              <TableHead>
                <TableRow>
                  {problem.result.fields.map((f) => {
                    return <TableHeader key={f.name}>{f.name}</TableHeader>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {problem.result.rows.length > 0 ? (
                  <>
                    {problem.result.rows.map((row, i) => {
                      return (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        <TableRow key={i}>
                          {row.map((v, i) => {
                            return <TableData key={`${i}-${v}`}>{v}</TableData>;
                          })}
                        </TableRow>
                      );
                    })}
                    {problem.result.isTruncated ? (
                      <TableRow>
                        <TableData colSpan={problem.result.fields.length}>
                          <span className="text-base-300 text-xs">
                            100行を超えると省略されます...
                          </span>
                        </TableData>
                      </TableRow>
                    ) : null}
                  </>
                ) : (
                  <TableRow>
                    <TableData colSpan={problem.result.fields.length}>
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
        throw new Error(problem satisfies never);
      }
    }
  }, [problem]);

  return (
    <Tabs.Panel render={PanelBody} value={tab}>
      <div className="flex flex-col gap-2 w-fit">{resultContent}</div>
    </Tabs.Panel>
  );
}

function ExpectedTabPanelBody({
  problem,
  tab,
}: { problem: PlayableProblem; tab: ResultComparisonTab }) {
  const resultContent = useMemo(() => {
    switch (problem.status) {
      case "idle": {
        return (
          <p className="text-base-300">
            SQLを実行すると、ここに期待する結果が表示されます
          </p>
        );
      }
      case "error": {
        return <p className="text-red-400">エラーが発生しています</p>;
      }
      case "right":
      case "wrong": {
        return problem.solutionResults.map((result, i) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={i} className="flex flex-col gap-2">
              <p className="text-base-300 text-xs">
                {`期待する結果${problem.solutions.length > 1 ? i + 1 : ""} (列名と順序はSampleと一致している必要がある)`}
              </p>
              <Table>
                <TableHead>
                  <TableRow>
                    {result.fields.map((field) => {
                      return (
                        <TableHeader key={field.name}>{field.name}</TableHeader>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.rows.map((row, i) => {
                    return (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <TableRow key={i}>
                        {row.map((v, i) => {
                          return <TableData key={`${i}-${v}`}>{v}</TableData>;
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          );
        });
      }
      default: {
        throw new Error(problem satisfies never);
      }
    }
  }, [problem]);

  return (
    <Tabs.Panel render={PanelBody} value={tab}>
      <div className="flex flex-col gap-6">{resultContent}</div>
    </Tabs.Panel>
  );
}
