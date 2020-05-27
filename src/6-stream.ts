import * as S from "@matechs/core/Stream";
import * as T from "@matechs/core/Effect";
import * as A from "@matechs/core/Array";
import { pipe } from "@matechs/core/Pipe";
import { add, liveCalculator } from "./2-multienv";
import { foldExit } from "@matechs/core/Exit";

const program = pipe(
  S.fromArray(A.range(0, 100)),
  S.chain((n) => S.encaseEffect(add(5)(n))),
  S.collectArray
);

const main = pipe(program, liveCalculator);

T.run(main, foldExit(console.error, console.log));
