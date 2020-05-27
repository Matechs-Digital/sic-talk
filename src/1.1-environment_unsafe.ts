import * as T from "@matechs/core/Effect";
import { pipe } from "@matechs/core/Pipe";
import { liveConsole, program } from "./1-environment";

pipe(program, liveConsole, T.runSync);
