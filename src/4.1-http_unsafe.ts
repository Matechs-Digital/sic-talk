import * as T from "@matechs/core/Effect";
import * as Ex from "@matechs/core/Exit";
import { getTodo, showTodo, TodoDeserializationError } from "./4-http";
import { constVoid } from "@matechs/core/Function";
import { pipe } from "@matechs/core/Pipe";
import { log, liveConsole } from "./1-environment";
import { HttpError, JsonError, liveHttpClient } from "./3-async";

// get a single todo

const main = pipe(
  getTodo(1),
  T.chain((todo) => log(showTodo.show(todo)))
);

const liveMain: T.AsyncE<HttpError | JsonError | TodoDeserializationError, void> = pipe(
  main,
  liveConsole,
  liveHttpClient
);

T.run(liveMain, Ex.foldExit(console.error, constVoid));
