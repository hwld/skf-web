import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import progress from "cli-progress";
import { allTables } from "~/data/all-tables";

/**
 * 問題に必要なテーブルのcsvファイルをCOPYコマンドで高速にINSERTできるようにバイナリファイルに変換する。
 * /data/{tableName}.csvにすべてのテーブルのデータが存在していることが前提。
 */
async function csvToBinary() {
	for (const table of allTables) {
		// 一つのdbを使用するとメモリが足りずにエラーになってしまうのでテーブルごとに作成する
		const db = await PGlite.create();
		await db.exec(table.def);

		const rows = (
			await readFile(
				path.join(import.meta.dirname, `../data/${table.name}.csv`),
				"utf-8",
			)
		)
			.trim()
			.split("\n")
			.slice(1)
			.map((row) => row.split(","));

		const bar = new progress.SingleBar(
			{ format: "{bar} {percentage}% | ETA: {eta}s | {value}/{total}" },
			progress.Presets.shades_classic,
		);
		console.log(table.name);
		bar.start(rows.length + 2, 0);

		await Promise.all(
			rows.map(async (r, i) => {
				await db.query(
					`INSERT INTO ${table.name} VALUES (${[...new Array(r.length)].map((_, i) => `$${i + 1}`)});`,
					r.map((r) => (r === "" ? undefined : r)),
				);
				bar.update(i + 1);
			}),
		);

		const { blob } = await db.query(
			`COPY ${table.name} TO '/dev/blob' WITH (FORMAT binary);`,
		);
		if (!blob) {
			return;
		}
		bar.update(rows.length + 1);

		const buffer = Buffer.from(await blob.arrayBuffer());
		await writeFile(
			path.join(import.meta.dirname, `../public/data/${table.name}.bin`),
			buffer,
		);

		bar.update(rows.length + 2);
		bar.stop();
		console.log();

		db.close();
	}
}

csvToBinary().catch((e) => console.error(e));
