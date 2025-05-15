import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { type RefObject, useEffect, useRef, useState } from "react";
import type { Problem } from "~/models/problem";

export type SqlEditorCommand = {
	id: string;
	/**
	 * @example KeyMod.CtrlCmd | KeyCode.Enter
	 */
	keybinding: number;
	handler: () => void;
};

type Props = {
	problem: Problem;
	ref: RefObject<editor.IStandaloneCodeEditor | null>;
	commands?: SqlEditorCommand[];
};

export function SqlEditor({ problem, ref, commands = [] }: Props) {
	const monacoRef = useRef<Monaco | undefined>(undefined);

	const [isMounted, setIsMounted] = useState(false);

	function handleBeforeMount(monaco: Monaco) {
		monacoRef.current = monaco;

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

		setIsMounted(true);
	}

	function handleMount(editor: editor.IStandaloneCodeEditor) {
		ref.current = editor;
	}

	// commandsが変更されたときに更新するためにuseEffectを使用する。
	// handleBeforeMountで実行すると、マウント時に一度しかcommandが登録されない。
	// 例えばcommandsはhandler関数を持っているが、ここにReact stateが含まれている場合、
	// stateが変わって関数が変わってもmonacoのcommandは変わらないので意図しない結果になってしまう可能性がある
	useEffect(() => {
		const monaco = monacoRef.current;
		// 初回レンダリングでmonacoがマウントされているとは限らないのでEffectに含めて、isMountedが変化した際にもう一度動くようにする
		if (!monaco || !isMounted) {
			return;
		}

		for (const command of commands) {
			monaco.editor.addKeybindingRule({
				command: command.id,
				keybinding: command.keybinding,
			});
			monaco.editor.addCommand({ id: command.id, run: command.handler });
		}

		return () => {
			for (const command of commands) {
				monaco.editor.addKeybindingRule({
					keybinding: command.keybinding,
					command: null,
				});
				monaco.editor.addCommand({ id: command.id, run: () => {} });
			}
		};
	}, [isMounted, commands]);

	return (
		<Editor
			path={`file://${problem.id}.sql`}
			className="mt-1"
			theme="skf-dark"
			defaultLanguage="sql"
			loading={<span className="i-tabler-loader size-8 animate-spin" />}
			beforeMount={handleBeforeMount}
			onMount={handleMount}
			wrapperProps={{
				style: {
					// monaco-editorの内側でz-index付きのスタッキングコンテキストが作成されてtooltipなどが貫通してしまうので、
					// ここでz-indexなしのスタッキングコンテキストを作成して、htmlの下側にあるスタッキングコンテキストが優先されるようにする
					isolation: "isolate",
					display: "flex",
					position: "relative",
					textAlign: "initial",
					width: "100%",
					height: "100%",
				},
			}}
		/>
	);
}
