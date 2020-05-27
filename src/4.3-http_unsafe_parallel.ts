import * as T from "@matechs/core/Effect";
import * as Ex from "@matechs/core/Exit";
import { constVoid } from "@matechs/core/Function";
import { pipe } from "@matechs/core/Pipe";
import { liveConsole, log } from "./1-environment";
import { HttpError, JsonError, liveHttpClient } from "./3-async";
import { getTodo, showTodos, TodoDeserializationError } from "./4-http";

// sequence a tuple of computations in parallel

const main = pipe(
  T.parSequenceT(getTodo(1), getTodo(2), getTodo(3)),
  T.chain((todos) => log(showTodos.show(todos)))
);

const liveMain: T.AsyncE<HttpError | JsonError | TodoDeserializationError, void> = pipe(
  main,
  liveConsole,
  liveHttpClient
);

T.run(liveMain, Ex.foldExit(console.error, constVoid));