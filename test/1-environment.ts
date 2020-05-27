import { suite, testM, expect, run, mockedTestM, spyOn } from "@matechs/test-jest";
import {
  program,
  TestMessage,
  testConsole,
  testMessage,
  liveConsole
} from "../src/1-environment";
import * as T from "@matechs/core/Effect";
import * as R from "@matechs/core/Ref";
import { pipe } from "@matechs/core/Pipe";

const useConsole = testM(
  "Should log messages",
  T.Do()
    .bind("ref", R.makeRef<Array<TestMessage>>([]))
    .doL(({ ref }) => pipe(program, testConsole(ref)))
    .bindL("messages", ({ ref }) => ref.get)
    .doL(({ messages }) =>
      T.sync(() => {
        expect(messages).toHaveLength(4);
        expect(messages).toStrictEqual([
          testMessage({
            level: "log",
            message: "hello",
            rest: []
          }),
          testMessage({
            level: "error",
            message: "world",
            rest: []
          }),
          testMessage({
            level: "log",
            message: "with rest",
            rest: [{ foo: "bar" }]
          }),
          testMessage({
            level: "error",
            message: "error with rest",
            rest: [{ rest: "ok" }]
          })
        ]);
      })
    )
    .unit()
);

const callSystemConsole = mockedTestM("Call System Console")(() => ({
  log: spyOn(console, "log").mockImplementation(() => {}),
  error: spyOn(console, "error").mockImplementation(() => {})
}))(({ useMockM }) =>
  T.Do()
    .do(program)
    .do(
      useMockM(({ error, log }) =>
        T.sync(() => {
          expect(log.mock.calls.length).toBe(2);
          expect(error.mock.calls.length).toBe(2);
        })
      )
    )
    .unit()
);

const consoleProgramSuite = suite("Console Suite")(useConsole, callSystemConsole);

run(consoleProgramSuite)(liveConsole);
