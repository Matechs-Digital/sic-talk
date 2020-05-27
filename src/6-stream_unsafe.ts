import * as A from "@matechs/core/Array";
import * as T from "@matechs/core/Effect";
import { foldExit } from "@matechs/core/Exit";
import { pipe } from "@matechs/core/Pipe";
import * as S from "@matechs/core/Stream";
import { add, liveCalculator } from "./2-multienv";

const program = pipe(
  S.fromArray(A.range(0, 100)),
  S.chain((n) => S.encaseEffect(add(5)(n))),
  S.collectArray
);

const main = pipe(program, liveCalculator);

T.run(main, foldExit(console.error, console.log));
