import * as T from "@matechs/core/Effect";
import * as Ex from "@matechs/core/Exit";
import { constVoid } from "@matechs/core/Function";
import { pipe } from "@matechs/core/Pipe";
import { liveConsole, log } from "./1-environment";
import { HttpError, JsonError, liveHttpClient } from "./3-async";
import { getTodo, TodoDeserializationError } from "./4-run";

const main = pipe(
  T.parSequenceT(getTodo(1), getTodo(2), getTodo(3)),
  T.chain((todos) => log(JSON.stringify(todos, null, 2)))
);

const liveMain: T.AsyncE<HttpError | JsonError | TodoDeserializationError, void> = pipe(
  main,
  liveConsole,
  liveHttpClient
);

T.run(liveMain, Ex.foldExit(console.error, constVoid));
