import * as A from "@matechs/core/Array";
import * as T from "@matechs/core/Effect";
import * as M from "@matechs/core/Model";
import { pipe } from "@matechs/core/Pipe";
import { Show, showString } from "@matechs/core/Show";
import { getJson } from "./3-async";

const Todo_ = M.type({
  userId: M.number,
  id: M.number,
  title: M.string,
  body: M.string
});

export interface Todo extends M.TypeOf<typeof Todo_> {}

export const Todo = M.opaque<Todo>()(Todo_);

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
      T.chainError_(T.encaseEither(Todo.decode(body)), () =>
        T.raiseError(new TodoDeserializationError(body))
      )
    )
  );

export const showTodo: Show<Todo> = {
  show: ({ body, id, title, userId }) =>
    `id = ${id}, userId = ${userId}, title = ${title}, body = ${A.getShow(
      showString
    ).show(body.split("\n"))}`
};
