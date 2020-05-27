import * as T from "@matechs/core/Effect";
import { pipe } from "@matechs/core/Pipe";
import { liveConsole } from "./1-environment";
import { liveCalculator, program } from "./2-multienv";

pipe(program, liveCalculator, liveConsole, T.runSync);
