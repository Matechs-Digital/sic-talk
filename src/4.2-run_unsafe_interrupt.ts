import * as T from "@matechs/core/Effect";
import * as Ex from "@matechs/core/Exit";
import { constVoid } from "@matechs/core/Function";
import { pipe } from "@matechs/core/Pipe";
import { liveConsole, log } from "./1-environment";
import { HttpError, JsonError, liveHttpClient } from "./3-async";
import { getTodo, showTodo, TodoDeserializationError } from "./4-run";

const main = pipe(
  getTodo(1),
  T.chain((todo) => log(showTodo.show(todo)))
);

const liveMain: T.AsyncE<HttpError | JsonError | TodoDeserializationError, void> = pipe(
  main,
  liveConsole,
  liveHttpClient
);

const cancel = T.run(liveMain, Ex.foldExit(console.error, constVoid));

// interrupt the running http request

cancel();
