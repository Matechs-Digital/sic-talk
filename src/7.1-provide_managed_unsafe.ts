import * as T from "@matechs/core/Effect";
import * as Ex from "@matechs/core/Exit";
import { liveProgram } from "./7-provide_managed";
import { constVoid } from "@matechs/core/Function";

T.run(liveProgram, Ex.foldExit(console.error, constVoid));
