import * as T from "@matechs/core/Effect";
import * as Ex from "@matechs/core/Exit";
import * as O from "@matechs/core/Option";
import { pipe } from "@matechs/core/Pipe";
import { flow } from "@matechs/core/Function";

// Pre-Intro - Function composition using pipe & flow

export const add = (y: number) => (x: number): number => x + y;
export const mul = (y: number) => (x: number): number => x * y;

// inferred as (c: number) => number
export const add5andMul10 = flow(add(5), mul(10));

// inferred as (x: number) => number
export const add5andMul10withPipe = (x: number) => pipe(x, add(5), mul(10));

// flow = data-last function composition (argument goes at the end)
// pipe = data-first function composition (argument goes at the beginning)

// Why pipe? inference in typescript works left to right

// The Effect Type

// T.Effect<S, R, E, A>

// S : Async | Sync (encoded as unknown | never) (Covariant, S1 * S2 = S1 | S2)

// R : Environment (encoded as { [URI: string]: Env } ) (Contravariant, R1 * R2 = R1 & R2)

// E : Error (free encoding) (Covariant, E1 * E2 = E1 | E2)

// A : Output (free encoding) (Covariant, A1 * A2 = A1 | A2)

export const addM = (y: number) => (x: number) => T.sync(() => x + y);
export const mulM = (y: number) => (x: number) => T.sync(() => x * y);

// compose multiple effects in a chain A => B => C

// inferred as (x: number) => T.Effect<never, unknown, never, number>
export const add5andMul10M = flow(addM(5), T.chain(mulM(10)));

// equivalent, using type alias
export const add5andMul10M_ = (x: number): T.Sync<number> =>
  pipe(x, addM(5), T.chain(mulM(10)));

// division

export class DivByZero {
  readonly _tag = "DivByZero";
  readonly message: string;

  constructor() {
    this.message = "Division by Zero";
  }
}

// (y: number) => (x: number) => T.Effect<never, unknown, DivByZero, number>
export const div = (y: number) => (x: number) =>
  pipe(
    T.pure(y === 0),
    T.chain((isZero) => (isZero ? T.raiseError(new DivByZero()) : T.sync(() => x / y)))
  );

// add % between 0-100

export class OutOfBound {
  readonly _tag = "OutOfBound";
  readonly message: string;

  constructor(n: number) {
    this.message = `${n} has to be between 0 and 100`;
  }
}

export const percent = (y: number) => (x: number) =>
  pipe(
    T.pure(y < 0 || y > 100),
    T.chain((isOutOfBound) =>
      isOutOfBound ? T.raiseError(new OutOfBound(y)) : T.sync(() => (x * y) / 100)
    )
  );

// composition: take (x & y) => take z => divide z by x & calculate % y

// (x: number, y: number) => (z: number) => T.Effect<never, unknown, DivByZero | OutOfBound, number>
export const program = (x: number, y: number) => (z: number) =>
  pipe(z, div(x), T.chain(percent(y)));

// handling tagged errors

// (x: number, y: number) => (z: number) => T.Effect<never, unknown, OutOfBound, number>
export const handled = (x: number, y: number) => (z: number) =>
  pipe(
    program(x, y)(z),
    T.handle("_tag", "DivByZero", () => T.pure(0))
  );

// handling all errors

// (x: number, y: number) => (z: number) => T.Effect<never, unknown, never, number>
export const handledAll = (x: number, y: number) => (z: number) =>
  pipe(
    handled(x, y)(z),
    T.chainError(() => T.pure(0))
  );

// getting the full exit state & folding over Cause

export const foldExit = (x: number, y: number) =>
  flow(
    program(x, y),
    T.foldExit(
      Ex.foldCause(
        (raise, remaining) =>
          T.sync(() => {
            console.error("raised:", raise);

            if (O.isSome(remaining)) {
              console.error("other errors:", remaining.value);
            }
          }),
        (abort, remaining) =>
          T.sync(() => {
            console.error("abort:", abort);

            if (O.isSome(remaining)) {
              console.error("other errors:", remaining.value);
            }
          }),
        (errors, remaining) =>
          T.sync(() => {
            console.log("interrupted");

            if (O.isSome(errors)) {
              console.error("interruption errors:", errors.value);
            }
            if (O.isSome(remaining)) {
              console.error("other errors:", remaining.value);
            }
          })
      ),
      (n) =>
        T.sync(() => {
          console.log(n);
        })
    )
  );
