import * as RT from "@matechs/core/Retry";
import * as RN from "@matechs/core/Random";
import * as Ex from "@matechs/core/Exit";
import * as T from "@matechs/core/Effect";
import * as M from "@matechs/core/Monoid";
import { pipe } from "@matechs/core/Pipe";

const randomFailing = pipe(
  RN.randomRange(0, 10),
  T.chain((n) => (n > 5 ? T.raiseError("error") : T.pure(n)))
);

const program = pipe(
  randomFailing,
  RT.with(
    T.pure(RT.monoidRetryPolicy.concat(RT.limitRetries(10), RT.exponentialBackoff(100)))
  )
);

T.run(program, Ex.foldExit(console.error, console.log));
