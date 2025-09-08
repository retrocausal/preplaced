import type { HTMLFormMethod } from "react-router-dom";
import type { JsonObject, FetchResponse } from "@/Types";

interface Fetch {
  method: HTMLFormMethod;
  host: string;
  credentials: RequestCredentials;
  headers: Headers;
  integrity: string;
  keepalive: boolean;
  mode: RequestMode;
  redirect: RequestRedirect;
  signal: AbortSignal | null;
  prefix: string;
  execute(path: string): Promise<FetchResponse>;
}

class NetOps implements Fetch {
  host: string = import.meta.env.VITE_API_HOST;
  appBase: string = import.meta.env.VITE_APP_BASE;
  keepalive: boolean = true;
  headers: Headers = new Headers();
  prefix: string = "/api";
  integrity: string = "";
  _credentials: RequestCredentials = "same-origin";
  _mode: RequestMode = "same-origin";
  _redirect: RequestRedirect = "follow";
  _signal: AbortSignal | null = null;
  _payload: JsonObject | FormData | null = null;
  _verb: HTMLFormMethod = "GET";

  private readonly pathPrefix = `https://${this.host}${this.prefix}`;

  public get method(): HTMLFormMethod {
    return this._verb;
  }
  protected set method(v: HTMLFormMethod) {
    this._verb = v;
  }
  protected set body(v: JsonObject | FormData | null) {
    this._payload = v;
  }
  public get body(): JsonObject | FormData | null {
    return this._payload;
  }
  protected set signal(v: AbortSignal | null) {
    this._signal = v;
  }
  public get signal(): AbortSignal | null {
    return this._signal;
  }
  public set redirect(v: RequestRedirect) {
    throw new Error("Disallowed configuration : redirect");
  }
  public get redirect(): RequestRedirect {
    return this._redirect;
  }
  public set mode(v: RequestMode) {
    throw new Error("Disallowed configuration : mode");
  }
  public get mode(): RequestMode {
    return this._mode;
  }
  public set credentials(v: RequestCredentials) {
    throw new Error("Disallowed configuration : credentials");
  }
  public get credentials(): RequestCredentials {
    return this._credentials;
  }

  async execute(path: string): Promise<FetchResponse> {
    const src = `${this.pathPrefix}${path}`;
    const response: FetchResponse = {
      data: null,
      error: null,
      metadata: {
        url: src,
        method: this.method,
      },
    };

    try {
      switch (this.method) {
        case "POST":
        case "DELETE":
        case "PUT":
          if (this.body && this.body instanceof FormData) {
            this.headers.delete("content-type");
          } else if (this.body) {
            this.headers.set("content-type", "application/json");
          }
          break;
        case "GET":
        default:
          if (this.body) this.body = null;
      }
      const requestInit: RequestInit = {
        method: this.method,
        headers: this.headers,
        credentials: this.credentials,
        integrity: this.integrity,
        keepalive: this.keepalive,
        mode: this.mode,
        redirect: this.redirect,
        signal: this.signal || new AbortController().signal,
      };
      if (this.body) {
        requestInit.body =
          this.body instanceof FormData ? this.body : JSON.stringify(this.body);
      }
      const request = new Request(src, requestInit);
      const fetchResponse = await fetch(request);
      const status = fetchResponse.status;
      response.metadata = { ...response.metadata, status };
      if (!fetchResponse.ok) {
        if (status && status > 400 && status < 500) {
          if (status !== 429)
            response.metadata.location = import.meta.env.VITE_AUTH_BASE;
          else {
          }
        }
        response.error = {
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          ...((await fetchResponse.json()) as JsonObject),
        };
      } else {
        response.data = (await fetchResponse.json()) as JsonObject;
      }
      return response;
    } catch (error) {
      response.error = {
        message:
          error instanceof Error ? error.message : "Something went wrong!",
      };
      return response;
    }
  }
}

export class ApiClient extends NetOps {
  constructor(method: string, body: JsonObject | FormData | null = null) {
    super();
    this.method = method as HTMLFormMethod;
    this.signal = new AbortController().signal;
    if (body) this.body = body;
  }

  execute(path: string): Promise<FetchResponse> {
    let src = path;
    if (!path.startsWith("/")) src = `/${path}`;
    return super.execute(src);
  }
}
