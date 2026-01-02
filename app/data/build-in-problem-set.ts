import type { BuildInProblemSet } from "~/models/problem";
import { allProblems } from "./all-problems";

const buildIdRange = (start: number, end: number) =>
  [...new Array(end - start + 1)].map((_, i) => String(start + i));

export const buildInProblemSet: BuildInProblemSet[] = [
  {
    id: "1",
    title: "すべての問題セット",
    isBuildIn: true,
    problemIds: allProblems.map((p) => p.id),
  },
  {
    id: "2",
    title: "基礎: SELECT/WHERE",
    isBuildIn: true,
    problemIds: buildIdRange(1, 9),
  },
  {
    id: "3",
    title: "基礎: LIKE/正規表現/ソート",
    isBuildIn: true,
    problemIds: buildIdRange(10, 20),
  },
  {
    id: "4",
    title: "集計: 基本集計",
    isBuildIn: true,
    problemIds: [...buildIdRange(21, 27), "33"],
  },
  {
    id: "5",
    title: "集計: 統計/サブクエリ",
    isBuildIn: true,
    problemIds: [...buildIdRange(28, 32), "34", "35"],
  },
  {
    id: "6",
    title: "結合: JOIN/自己結合",
    isBuildIn: true,
    problemIds: buildIdRange(36, 42),
  },
  {
    id: "7",
    title: "変換: ピボット/型/日付/カテゴリ",
    isBuildIn: true,
    problemIds: buildIdRange(43, 58),
  },
  {
    id: "8",
    title: "数値化: 数値化/四則演算",
    isBuildIn: true,
    problemIds: buildIdRange(59, 74),
  },
];
