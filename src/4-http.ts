import * as A from "@matechs/core/Array";
import * as T from "@matechs/core/Effect";
import { pipe } from "@matechs/core/Function";
import * as M from "@matechs/morphic";
import * as Show from "@matechs/morphic/show";
import { liveConsole } from "./1-environment";
import { getJson, liveHttpClient } from "./3-async";

const Todo_ = M.make((F) =>
  F.interface(
    {
      userId: F.number(),
      id: F.number(),
      title: F.string(),
      body: F.string()
    },
    "Todo",
    {
      [M.ShowURI]: ({}, {}, { show: { body, id, title, userId } }) => ({
        show: (todo) =>
          `id: ${id.show(todo.id)}\ntitle: ${title.show(
            todo.title
          )}\nuser: ${userId.show(todo.userId)}\nbody: ${body.show(todo.body)}`
      })
    }
  )
);

export interface Todo extends M.AType<typeof Todo_> {}

export const Todo = M.opaque_<Todo>()(Todo_);

export const TodoArray = M.make((F) =>
  F.array(Todo(F), {
    [M.ShowURI]: (_s, _e, { show: { show } }) => ({
      show: (todos) =>
        todos.length > 0
          ? `---------------\n${todos
              .map(show)
              .join(`\n---------------\n`)}\n---------------`
          : "No todos."
    })
  })
);

export class TodoDeserializationError {
  readonly _tag = "TodoDeserializationError";
  readonly message: string;

  constructor(readonly body: unknown, readonly errors: A.Array<string>) {
    this.message = "Body doesn't deserialize to todo";
  }
}

export const getTodo = (id: number) =>
  pipe(
    getJson(`https://jsonplaceholder.typicode.com/posts/${id}`),
    T.chain((body) =>
      T.chainError_(Todo.decodeT(body), ({ errors }) =>
        T.raiseError(new TodoDeserializationError(body, errors))
      )
    )
  );

export const showTodo = Show.derive(Todo);

export const showTodos = Show.derive(TodoArray);

export const appLayer = liveHttpClient.with(liveConsole);
