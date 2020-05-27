import * as T from "@matechs/core/Effect";
import * as A from "@matechs/core/Array";
import { liveHttpClient, getJson, HttpError, JsonError } from "./3-async";
import { log, liveConsole } from "./1-environment";
import { pipe } from "@matechs/core/Pipe";
import { Show, showString } from "@matechs/core/Show";

export interface Todo {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const isTodo = (u: any): u is Todo =>
  typeof u !== "undefined" &&
  typeof u === "object" &&
  u !== null &&
  "userId" in u &&
  "id" in u &&
  "title" in u &&
  "body" in u &&
  typeof u["userId"] === "number" &&
  typeof u["id"] === "number" &&
  typeof u["title"] === "string" &&
  typeof u["body"] === "string";

export class TodoDeserializationError extends Error {
  _tag = "TodoDeserializationError" as const;
  constructor(readonly body: unknown) {
    super("Body doesn't deserialize to todo");
  }
}

export const getTodo = (id: number) =>
  pipe(
    getJson(`https://jsonplaceholder.typicode.com/posts/${id}`),
    T.chain((body) =>
      isTodo(body) ? T.pure(body) : T.raiseError(new TodoDeserializationError(body))
    )
  );

export const showTodo: Show<Todo> = {
  show: ({ body, id, title, userId }) =>
    `id = ${id}, userId = ${userId}, title = ${title}, body = ${A.getShow(
      showString
    ).show(body.split("\n"))}`
};
