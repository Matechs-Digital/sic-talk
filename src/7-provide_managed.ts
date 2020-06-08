import * as T from "@matechs/core/Effect";
import * as M from "@matechs/core/Managed";
import * as O from "@matechs/core/Option";
import * as L from "@matechs/core/Layer";
import { pipe } from "@matechs/core/Function";
import { liveConsole, log } from "./1-environment";

//
// Definitions
//

// simulate db connection
export interface Connection {
  kv: Map<string, string>;
}

export const DbURI = Symbol();

export interface Db {
  [DbURI]: {
    get: (k: string) => T.AsyncE<Error, string>;
    set: (k: string, value: string) => T.AsyncE<Error, void>;
  };
}

//
// API
//

export const get = (k: string) => T.accessM(({ [DbURI]: { get } }: Db) => get(k));

export const set = (k: string, v: string) =>
  T.accessM(({ [DbURI]: { set } }: Db) => set(k, v));

//
// Implementation
//

// M.Managed<never, unknown, never, Connection>
export const managedConnection = M.bracket(
  T.sync((): Connection => ({ kv: new Map() })), // open
  (conn) => T.sync(() => conn.kv.clear()) // close
);

// use Connection to construct db

// M.Managed<never, unknown, never, Db>
export const managedDb = pipe(
  managedConnection,
  M.map(
    (connection): Db => ({
      [DbURI]: {
        get: (key) =>
          T.encaseOption(
            O.fromNullable(connection.kv.get(key)),
            () => new Error("not found")
          ),
        set: (key, value) => T.asUnit(T.sync(() => connection.kv.set(key, value)))
      }
    })
  )
);

// use managedDb to provide environment

// T.Provider<unknown, Db, never, never>
export const liveDb = L.fromManaged(managedDb);

//
// Use in a program
//

export const program = pipe(
  set("foo", "bar"),
  T.chain((_) => get("foo")),
  T.chain((v) => log(`got: ${v}`))
);

export const liveProgram = pipe(program, liveDb.with(liveConsole).use);
