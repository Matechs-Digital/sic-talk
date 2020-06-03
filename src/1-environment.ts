import * as A from "@matechs/core/Array";
import * as T from "@matechs/core/Effect";
import * as L from "@matechs/core/Layer";
import * as R from "@matechs/core/Ref";

//
// Service Definition
//

export const ConsoleURI = "@sic-conf/ConsoleURI";

export interface Console {
  [ConsoleURI]: {
    log: (message: string, ...rest: any[]) => T.Sync<void>;
    error: (message: string, ...rest: any[]) => T.Sync<void>;
  };
}

//
// Service API
//

export const log = (message: string, ...rest: any[]) =>
  T.accessM(({ [ConsoleURI]: { log } }: Console) => log(message, ...rest));

export const error = (message: string, ...rest: any[]) =>
  T.accessM(({ [ConsoleURI]: { error } }: Console) => error(message, ...rest));

//
// Service Live Implementation
//

export const liveConsole = L.fromValue<Console>({
  [ConsoleURI]: {
    log: (message, ...rest) => T.sync(() => console.log(message, ...rest)),
    error: (message, ...rest) => T.sync(() => console.error(message, ...rest))
  }
});

//
// Service Test Implementation
//

export interface TestMessage {
  level: "error" | "log";
  message: string;
  rest: Array<any>;
}

export const testMessage = (_: TestMessage) => _;

export const testConsole = (refMessages: R.Ref<A.Array<TestMessage>>) =>
  L.fromValue<Console>({
    [ConsoleURI]: {
      log: (message, ...rest) =>
        refMessages.update(A.snoc(testMessage({ message, rest, level: "log" }))),
      error: (message, ...rest) =>
        refMessages.update(A.snoc(testMessage({ message, rest, level: "error" })))
    }
  });

//
// Program
//
export const program = T.sequenceT(
  log("hello"),
  error("world"),
  log("with rest", { foo: "bar" }),
  error("error with rest", { rest: "ok" })
);
