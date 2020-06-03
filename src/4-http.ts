import * as T from "@matechs/core/Effect";
import * as A from "@matechs/core/Array";
import * as M from "@matechs/core/Model";
import { pipe } from "@matechs/core/Pipe";
import { Show } from "@matechs/core/Show";
import { liveConsole } from "./1-environment";
import { getJson, liveHttpClient } from "./3-async";

const Todo_ = M.type({
  userId: M.number,
  id: M.number,
  title: M.string,
  body: M.string
});

export interface Todo extends M.TypeOf<typeof Todo_> {}

export const Todo = M.opaque<Todo>()(Todo_);

export class TodoDeserializationError {
  readonly _tag = "TodoDeserializationError";
  readonly message: string;

  constructor(readonly body: unknown, readonly errors: M.Errors) {
    this.message = "Body doesn't deserialize to todo";
  }
}

export const getTodo = (id: number) =>
  pipe(
    getJson(`https://jsonplaceholder.typicode.com/posts/${id}`),
    T.chain((body) =>
      T.chainError_(T.encaseEither(Todo.decode(body)), (errors) =>
        T.raiseError(new TodoDeserializationError(body, errors))
      )
    )
  );

export const showTodo: Show<Todo> = {
  show: (todo) => JSON.stringify(todo, null, 2)
};

export const showTodos: Show<A.Array<Todo>> = {
  show: (todos) => JSON.stringify(todos, null, 2)
};

export const appLayer = liveHttpClient.with(liveConsole);
