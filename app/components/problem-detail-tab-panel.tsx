import { Separator, Tabs } from "@base-ui-components/react";
import { useState } from "react";
import { IconButton } from "./icon-button";
import {
  Panel,
  PanelBody,
  PanelHeader,
  TabPanelIndicator,
  TabPanelTitle,
} from "./panel";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Tooltip } from "./tooltip";
import type { PlayableProblem } from "./use-playable-problem-set";

const sampleTitle = "Sample";
const sqlSolutionTitle = "SQL Solution";

type Props = { problem: PlayableProblem };

export function ProblemDetailTabPanel({ problem }: Props) {
  return (
    <Tabs.Root render={Panel} defaultValue={sampleTitle}>
      <PanelHeader>
        <Tabs.List className="flex gap-2 h-full items-center relative">
          <TabPanelTitle iconClass="i-tabler-test-pipe" title={sampleTitle} />
          <Separator
            orientation="vertical"
            className="w-px bg-base-500 h-2/3"
          />
          <TabPanelTitle iconClass="i-tabler-code" title={sqlSolutionTitle} />
          <TabPanelIndicator />
        </Tabs.List>
      </PanelHeader>
      <SampleTabPanelBody problem={problem} />
      <SqlSolutionTabPanelBody problem={problem} />
    </Tabs.Root>
  );
}

function SampleTabPanelBody({ problem }: { problem: PlayableProblem }) {
  return (
    <Tabs.Panel render={PanelBody} value={sampleTitle}>
      <div className="flex flex-col gap-6">
        {problem.solutions.map((solution, index) => {
          const columnNames = solution.expectedResult.fields;
          const firstRows = solution.expectedResult.rows[0];
          const paris = columnNames.map((column, index) => ({
            column,
            value: firstRows[index],
          }));

          return (
            <div key={solution.sql} className="flex flex-col gap-2">
              <p className="text-base-300 text-xs">
                期待する列名と最初の行の値
                {problem.solutions.length > 1 ? ` ${index + 1}` : ""}
              </p>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>順序</TableHeader>
                    <TableHeader>列名</TableHeader>
                    <TableHeader>最初の行の値</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paris.map(({ column, value }, order) => {
                    return (
                      <TableRow key={`${column}-${value}`}>
                        <TableData>{order + 1}</TableData>
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
  );
}

function SqlSolutionTabPanelBody({ problem }: { problem: PlayableProblem }) {
  const [copied, setCopied] = useState(false);

  async function handleCopySql(sql: string) {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  }

  return (
    <Tabs.Panel render={PanelBody} value={sqlSolutionTitle}>
      <div className="flex flex-col gap-6">
        {problem.solutions.map((solution, index) => (
          <div key={solution.sql} className="flex flex-col gap-2">
            <p className="text-base-300 text-xs">
              回答例{problem.solutions.length > 1 ? index + 1 : ""}
            </p>
            <div className="relative min-h-11 border border-base-600 p-2 rounded-md [&_.shiki]:bg-transparent! [&_*]:text-xs! [&_code]:whitespace-pre-wrap group">
              <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition duration-100 focus-within:opacity-100">
                <Tooltip
                  trigger={
                    <IconButton
                      iconClass={
                        copied
                          ? "i-tabler-clipboard-check"
                          : "i-tabler-clipboard"
                      }
                      onClick={() => handleCopySql(solution.sql)}
                    />
                  }
                >
                  コードをコピー
                </Tooltip>
              </div>
              <div
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                dangerouslySetInnerHTML={{ __html: solution.sqlHtml }}
              />
            </div>
          </div>
        ))}
      </div>
    </Tabs.Panel>
  );
}
