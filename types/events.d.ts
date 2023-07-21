type Handler<T> = (e: T) => void;
export declare class Events<N extends string, E> {
    private readonly e;
    private readonly registeredHandlersByEvent;
    constructor(e: E);
    on(event: N, handler: Handler<E>): void;
    emit(event: N): void;
    purge(event?: N): void;
}
export {};
