import * as T from "@matechs/core/Effect";
import * as Ex from "@matechs/core/Exit";
import { constVoid, pipe } from "@matechs/core/Function";
import { log } from "./1-environment";
import { HttpError, JsonError } from "./3-async";
import { appLayer, getTodo, showTodo, TodoDeserializationError } from "./4-http";

const main = pipe(
  getTodo(1),
  T.chain((todo) => log(showTodo.show(todo)))
);

const liveMain: T.AsyncE<HttpError | JsonError | TodoDeserializationError, void> = pipe(
  main,
  appLayer.use
);

const cancel = T.run(liveMain, Ex.foldExit(console.error, constVoid));

// interrupt the running http request

cancel();
