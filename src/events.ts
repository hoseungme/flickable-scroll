type Handler<T> = (e: T) => void;
type RegisteredHandlersByEvent<N extends string, E> = Map<N, Handler<E>[]>;

export class Events<N extends string, E> {
  private readonly e: E;
  private readonly registeredHandlersByEvent: RegisteredHandlersByEvent<N, E> = new Map();

  constructor(e: E) {
    this.e = e;
  }

  public on(event: N, handler: Handler<E>) {
    const handlers = this.registeredHandlersByEvent.get(event) ?? [];
    handlers.push(handler);
    this.registeredHandlersByEvent.set(event, handlers);
  }

  public emit(event: N) {
    const handlers = this.registeredHandlersByEvent.get(event) ?? [];
    handlers.forEach((handler) => handler(this.e));
  }

  public purge(event?: N) {
    if (event != null) {
      this.registeredHandlersByEvent.delete(event);
    } else {
      this.registeredHandlersByEvent.clear();
    }
  }
}
