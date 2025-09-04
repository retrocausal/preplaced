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
  host: string = "preplaced.schrodingers.cat";
  credentials: RequestCredentials = "same-origin";
  keepalive: boolean = false;
  integrity: string = "";
  mode: RequestMode = "same-origin";
  redirect: RequestRedirect = "manual";
  _signal: AbortSignal | null = null;
  headers: Headers = new Headers();
  prefix: string = "/api";
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

  async execute(path: string): Promise<FetchResponse> {
    const response: FetchResponse = {
      data: null,
      error: null,
      metadata: {
        url: this.pathPrefix + path,
        method: this.method,
      },
    };

    try {
      if (!path) {
        response.error = { message: "Path is required" };
        response.metadata.url = "";
        return response;
      }

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
      this.headers.set("Accept-Encoding", "br;q=1.0, gzip;q=0.8");
      const src = this.pathPrefix + path;
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
      if (!fetchResponse.ok) {
        switch (true) {
          case fetchResponse.status >= 300 && fetchResponse.status < 400:
            response.metadata.redirect = true;
            response.metadata.location =
              fetchResponse.headers.get("Location") ?? null;
            return response;
          default:
            response.error = {
              status: fetchResponse.status,
              statusText: fetchResponse.statusText,
              body: (await fetchResponse.json()) as JsonObject,
            };
            return response;
        }
      }
      response.data = (await fetchResponse.json()) as JsonObject;
      return response;
    } catch (error) {
      response.error = {
        message: error instanceof Error ? error.message : "Failed to fetch",
      };
      return response;
    }
  }
}

export default NetOps;
