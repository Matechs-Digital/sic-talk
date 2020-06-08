import * as A from "@matechs/core/Array";
import * as T from "@matechs/core/Effect";
import * as Ex from "@matechs/core/Exit";
import { constVoid, pipe } from "@matechs/core/Function";
import { log } from "./1-environment";
import { HttpError, JsonError } from "./3-async";
import { appLayer, getTodo, showTodos, TodoDeserializationError } from "./4-http";

// traverse an array of ids, in parallel, interrupting all at first error

const main = pipe(
  A.range(1, 4),
  T.parFastTraverseArray(getTodo),
  T.chain((todos) => log(showTodos.show(todos)))
);

const liveMain: T.AsyncE<
  HttpError | JsonError | TodoDeserializationError | string,
  void
> = pipe(main, appLayer.use);

T.run(liveMain, Ex.foldExit(console.error, constVoid));
