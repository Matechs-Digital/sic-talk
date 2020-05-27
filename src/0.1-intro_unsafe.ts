import * as T from "@matechs/core/Effect";
import { handled, handledAll, program } from "./0-intro";

const result1 = T.runSync(program(0, 1)(5));

console.log("result 1");
console.log(result1);
console.log("");

const result2 = T.runSync(handled(0, 1)(5));

console.log("result 2");
console.log(result2);
console.log("");

const result3 = T.runSync(handled(1, 150)(5));

console.log("result 3");
console.log(result3);
console.log("");

const result4 = T.runSync(handledAll(1, 150)(5));

console.log("result 4");
console.log(result4);
console.log("");

const result5 = T.runSync(handledAll(1, 20)(5));

console.log("result 5");
console.log(result5);
