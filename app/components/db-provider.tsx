import { PGlite, types } from "@electric-sql/pglite";
import { type PGliteWithLive, live } from "@electric-sql/pglite/live";
import {
  type PropsWithChildren,
  createContext,
  use,
  useEffect,
  useState,
} from "react";
import { allTables } from "~/data/all-tables";

let dbGlobal: PGliteWithLive | undefined;

const DbContext = createContext<{ db: PGliteWithLive | undefined } | undefined>(
  undefined,
);

export function useDb() {
  const ctx = use(DbContext);
  if (!ctx) {
    throw new Error("PGliteContextが存在しません");
  }
  return ctx.db;
}

// dbがundefinedのときにも例外を出してほしくないため、PGliteProviderは使用せずに自作する
export function DbProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<PGliteWithLive | undefined>(undefined);

  useEffect(() => {
    async function setupDb() {
      dbGlobal ??= await PGlite.create({
        extensions: { live },

        parsers: {
          [types.INT2]: (value) => value.toString(),
          [types.INT4]: (value) => value.toString(),
          [types.NUMERIC]: (value) => value.toString(),
          [types.DATE]: (value) => new Date(value).toISOString().split("T")[0],
        },
      });

      await dbGlobal.exec(allTables.map((table) => table.def).join("\n"));

      await Promise.all(
        allTables.map(async (table) => {
          const blob = await (await fetch(`/data/${table.name}.bin`)).blob();
          await dbGlobal?.query(
            `COPY ${table.name} FROM '/dev/blob' WITH (FORMAT binary);`,
            [],
            { blob },
          );
        }),
      );

      setDb(dbGlobal);
    }
    setupDb();
  }, []);

  return <DbContext value={{ db }}>{children}</DbContext>;
}
