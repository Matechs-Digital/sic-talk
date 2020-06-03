import * as T from "@matechs/core/Effect";
import { liveConsole } from "./1-environment";
import { liveCalculator, program } from "./2-multienv";

T.runSync(liveCalculator.with(liveConsole).use(program));
