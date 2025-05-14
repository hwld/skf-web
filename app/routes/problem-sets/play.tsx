import { Separator, Tabs } from "@base-ui-components/react";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { useSearchParams } from "react-router";
import { Button } from "~/components/button";
import { IconButton } from "~/components/icon-button";
import { ProblemStatusBadge } from "~/components/problem-status-badge";
import { Tooltip, TooltipProvider } from "~/components/tooltip";
import { usePlayableProblemSet } from "~/components/use-playable-problem-set";
import { Progress } from "@base-ui-components/react";

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
		<div className="grid grid-cols-[1fr_auto] gap-4">
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
			<div className="grid grid-rows-[auto_270px_1fr] gap-4 w-[600px]">
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
					<PanelBody>問題文</PanelBody>
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
					<PanelBody>
						<Tabs.Panel value={expectedTitle}>期待する実行結果</Tabs.Panel>
						<Tabs.Panel value={sqlSolutionTitle}>回答例</Tabs.Panel>
					</PanelBody>
				</Tabs.Root>
			</div>
		</div>
	);
}

type ProgressBarProps = { value: number };
function ProgressBar({ value }: ProgressBarProps) {
	return (
		<Progress.Root value={value}>
			<Progress.Track className="h-1 bg-base-600 rounded-xl overflow-hidden">
				<Progress.Indicator className="block bg-primary-400" />
			</Progress.Track>
		</Progress.Root>
	);
}

function Panel({ children, ...others }: PropsWithChildren) {
	return (
		<div
			className="w-full h-full flex flex-col border border-base-700 rounded-lg overflow-hidden"
			{...others}
		>
			{children}
		</div>
	);
}

function PanelHeader({ children, ...others }: PropsWithChildren) {
	return (
		<div
			className="h-9 bg-base-700 w-full flex items-center px-2 gap-2"
			{...others}
		>
			{children}
		</div>
	);
}

function PanelBody({ children }: PropsWithChildren) {
	return <div className="bg-base-800 p-4 grow">{children}</div>;
}

function PanelFooter({ children }: PropsWithChildren) {
	return (
		<div className="bg-base-700 p-2 flex items-center justify-end">
			{children}
		</div>
	);
}

type PanelTitleProps = { iconClass: string; title: string };

function PanelTitle({ iconClass, title }: PanelTitleProps) {
	return (
		<div className="grid grid-cols-[auto_1fr] gap-1 items-center text-base-100">
			<span className={clsx(iconClass, "size-5")} />
			<p>{title}</p>
		</div>
	);
}

type TabPanelTitleProps = { iconClass: string; title: string };

function TabPanelTitle({ iconClass, title }: TabPanelTitleProps) {
	return (
		<Tabs.Tab
			className="grid grid-cols-[auto_1fr] gap-1 items-center h-7 px-2 rounded-sm transition duration-100 data-[selected]:text-base-100 text-base-400 hover:text-base-100 hover:bg-white/15"
			value={title}
		>
			<span className={clsx(iconClass, "size-5")} />
			<p>{title}</p>
		</Tabs.Tab>
	);
}

function TabPanelIndicator() {
	return (
		<Tabs.Indicator className="absolute h-px bottom-[calc(var(--active-tab-bottom)-1px)] rounded-sm w-(--active-tab-width) translate-x-(--active-tab-left) bg-base-100 transition duration-200 ease-in-out" />
	);
}
