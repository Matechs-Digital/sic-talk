import * as T from "@matechs/core/Effect";
import { foldExit } from "@matechs/core/Exit";
import { constVoid, pipe } from "@matechs/core/Function";
import * as M from "@matechs/core/Managed";
import * as fs from "fs";
import * as path from "path";

const file = (path: fs.PathLike, flags: fs.OpenMode) =>
  M.bracket(T.effectify(fs.open)(path, flags), T.effectify(fs.close));

const program = pipe(
  M.sequenceT(
    file(path.join(__dirname, "..", "demo-a.txt"), "w+"),
    file(path.join(__dirname, "..", "demo-b.txt"), "w+")
  ),
  M.consume(([a, b]) =>
    T.sequenceT(
      T.effectify(fs.write)(a, "hello world to A"),
      T.effectify(fs.write)(b, "hello world to B")
    )
  )
);

T.run(program, foldExit(console.error, constVoid));
