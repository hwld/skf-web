import { Separator, Tabs } from "@base-ui-components/react";
import { useSearchParams } from "react-router";
import { Button } from "~/components/button";
import { IconButton } from "~/components/icon-button";
import { ProblemStatusBadge } from "~/components/problem-status-badge";
import { Tooltip, TooltipProvider } from "~/components/tooltip";
import { usePlayableProblemSet } from "~/components/use-playable-problem-set";
import {
	Panel,
	PanelBody,
	PanelFooter,
	PanelHeader,
	PanelTitle,
	TabPanelIndicator,
	TabPanelTitle,
} from "~/components/panel";
import { ProgressBar } from "~/components/progress-bar";
import {
	Table,
	TableBody,
	TableData,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/table";

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
	} = usePlayableProblemSet(params);

	return (
		<div className="grid grid-cols-[1fr_auto] gap-4 min-h-0">
			<div className="grid grid-rows-[1fr_320px] gap-4">
				<Panel>
					<PanelHeader>
						<PanelTitle iconClass="i-tabler-code" title="SQL editor" />
					</PanelHeader>
					<PanelBody>Code</PanelBody>
					<PanelFooter>
						<div className="flex items-center gap-2">
							<Button
								color="secondary"
								leftIconClass="i-tabler-chevron-left"
								disabled={isFirstProblem}
								onClick={prevProblem}
							>
								前の問題
							</Button>
							<Button
								color="secondary"
								rightIconClass="i-tabler-chevron-right"
								disabled={isLastProblem}
								onClick={nextProblem}
							>
								次の問題
							</Button>
							<Button leftIconClass="i-tabler-player-play-filled">実行</Button>
						</div>
					</PanelFooter>
				</Panel>

				<Panel>
					<PanelHeader>
						<PanelTitle iconClass="i-tabler-prompt" title="Result" />
					</PanelHeader>
					<PanelBody>実行結果</PanelBody>
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
							<Tooltip
								label="問題一覧を表示する"
								trigger={<IconButton iconClass="i-tabler-list" />}
							/>
							<Tooltip
								label="問題セットをインポートする"
								trigger={<IconButton iconClass="i-tabler-download" />}
							/>
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
