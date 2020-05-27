import * as T from "@matechs/core/Effect";
import { program, liveCalculator } from "./2-multienv";
import { pipe } from "@matechs/core/Pipe";
import { liveConsole } from "./1-environment";

pipe(program, liveCalculator, liveConsole, T.runSync);
