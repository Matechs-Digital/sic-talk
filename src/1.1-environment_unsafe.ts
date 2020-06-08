import * as T from "@matechs/core/Effect";
import { pipe } from "@matechs/core/Function";
import { liveConsole, program } from "./1-environment";

pipe(program, liveConsole.use, T.runSync);
