import * as T from "@matechs/core/Effect";
import * as E from "@matechs/core/Either";
import * as M from "@matechs/core/Monoid";
import { pipe } from "@matechs/core/Pipe";
import * as https from "https";

//
// Error Definition
//

export class HttpError {
  readonly _tag = "HttpError";
  readonly message: string;

  constructor(inner: Error) {
    this.message = inner.message;
  }
}

export class JsonError {
  readonly _tag = "JsonError";
  readonly message: string;

  constructor(readonly inner: unknown) {
    this.message = "json decoding failed";
  }
}

//
// Http Client Definition
//

export const HttpClientURI = "@sic-conf/HttpClientURI";

export interface HttpClient {
  [HttpClientURI]: {
    get: (url: string) => T.AsyncE<HttpError, string>;
  };
}

//
// Http Client API
//

export const get = (url: string) =>
  T.accessM(({ [HttpClientURI]: { get } }: HttpClient) => get(url));

export const getJson = (url: string) =>
  pipe(
    get(url),
    T.chain((body) =>
      T.trySyncMap((u) => new JsonError(u))(() => JSON.parse(body) as unknown)
    )
  );

//
// Http Client Implementation
//

const get_ = (url: string) =>
  T.async<HttpError, string>((resolve) => {
    const req = https.get(url, (res) => {
      res.setEncoding("utf8");

      const body: string[] = [];

      res.on("data", (data) => {
        body.push(data);
      });

      res.on("end", () => {
        resolve(E.right(M.fold(M.monoidString)(body)));
      });

      res.on("error", (err) => {
        resolve(E.left(new HttpError(err)));
      });
    });

    req.on("error", (err) => {
      resolve(E.left(new HttpError(err)));
    });

    return (cb) => {
      req.destroy();
      cb();
    };
  });

export const liveHttpClient = T.provide<HttpClient>({
  [HttpClientURI]: {
    get: get_
  }
});
