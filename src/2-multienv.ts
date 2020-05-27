import * as T from "@matechs/core/Effect";
import * as C from "./1-environment";
import { pipe } from "@matechs/core/Pipe";

//
// Service Definition
//

export const CalculatorURI = "@sic-conf/CalculatorURI";

export interface Calculator {
  [CalculatorURI]: {
    add: (y: number) => (x: number) => T.Sync<number>;
  };
}

//
// Service API
//

export const add = (y: number) => (x: number) =>
  T.accessM(({ [CalculatorURI]: { add } }: Calculator) => add(y)(x));

//
// Live Provider
//

export const liveCalculator = T.provide<Calculator>({
  [CalculatorURI]: {
    add: (y) => (x) => T.sync(() => x + y)
  }
});

//
// Program
//

export const program = pipe(
  add(10)(5),
  T.chainTap((n) => C.log(`result: ${n}`))
);
