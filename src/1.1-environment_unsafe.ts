import * as T from "@matechs/core/Effect";
import { program, liveConsole } from "./1-environment";
import { pipe } from "@matechs/core/Pipe";

pipe(program, liveConsole, T.runSync);
