import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { RefObject } from "react";
import type { Problem } from "~/models/problem";

type Props = {
	problem: Problem;
	ref: RefObject<editor.IStandaloneCodeEditor | null>;
};

export function SqlEditor({ problem, ref }: Props) {
	function handleBeforeMount(monaco: Monaco) {
		monaco.editor.defineTheme("skf-dark", {
			base: "vs-dark",
			inherit: true,
			colors: {
				// CSS変数が使えないのでtailwindのneutral-800を直接指定する
				"editor.background": "#262626",
			},
			rules: [],
		});
		monaco.editor.setTheme("skf-dark");

		// SqlEditorは問題セットのすべての問題を一度の挑戦で扱う。
		// handleBeforeMountは問題セット開始時に一度だけ呼ばれることを想定しており、その時点で前回の挑戦の入力をすべてリセットする。
		// 挑戦ごとに一意なkeyを用意してEditorをアンマウントさせることでリセットできないかを試したがだめだったのでこうする。
		for (const model of monaco.editor.getModels()) {
			model.dispose();
		}
	}

	function handleMount(editor: editor.IStandaloneCodeEditor) {
		ref.current = editor;
	}

	return (
		<Editor
			path={`file://${problem.id}.sql`}
			className="mt-1"
			theme="skf-dark"
			defaultLanguage="sql"
			loading={<span className="i-tabler-loader size-8 animate-spin" />}
			beforeMount={handleBeforeMount}
			onMount={handleMount}
		/>
	);
}
