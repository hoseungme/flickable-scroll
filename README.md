# flickable-scroll

https://github.com/HoseungJang/flickable-scroll/assets/39669819/0ed83574-a6ac-4033-af39-e1c725fef7a5

---

- [Overview](#overview)
- [Examples](#examples)
- [API Reference](#api-reference)

---

# Overview

`flickable-scroll` is a flickable web scroller, which handles only scroll jobs. In other words, you can be free to write layout and style and then you just pass scroller options based on it. Let's see examples below.

# Examples

This is an example template. Note the changes of `options` and `style` in each example.

```tsx
const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  const current = ref.current;
  if (current == null) {
    return;
  }

  const options: ScrollerOptions = {
    /* ... */
  };

  const scroller = new FlickableScroller(current);
  return () => scroller.destroy();
}, []);

const style: CSSProperties = {
  /* ... */
};

return (
  <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <div
      ref={ref}
      style={{
        width: 800,
        height: 800,
        position: "fixed",
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ backgroundColor: "lavender", fontSize: 50 }}>Scroll Top</div>
      {Array.from({ length: 2 }).map((_, index) => (
        <Fragment key={index}>
          <div style={{ width: 800, height: 800, flexShrink: 0, backgroundColor: "pink" }} />
          <div style={{ width: 800, height: 800, flexShrink: 0, backgroundColor: "skyblue" }} />
          <div style={{ width: 800, height: 800, flexShrink: 0, backgroundColor: "lavender" }}></div>
        </Fragment>
      ))}
      <div style={{ backgroundColor: "pink", fontSize: 50 }}>Scroll Bottom</div>
    </div>
  </div>
);
```

## Vertical Scroll

```typescript
const options = {
  direction: "y",
};
```

```typescript
const style = {};
```

https://github.com/HoseungJang/flickable-scroll/assets/39669819/089e2de5-0818-4462-ab0b-122ea6fcbd6a

## Reversed Vertical Scroll

```typescript
const options = {
  direction: "y",
  reverse: true,
};
```

```typescript
const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
};
```

https://github.com/HoseungJang/flickable-scroll/assets/39669819/9eefe295-f8fe-49f7-9f92-c390dc70f43a

## Horizontal Scroll

```typescript
const options = {
  direction: "x",
};
```

```typescript
const style = {
  display: "flex",
};
```

https://github.com/HoseungJang/flickable-scroll/assets/39669819/a90eeff8-9e18-4d45-a229-66813ba89901

## Reversed Horizontal Scroll

```typescript
const options = {
  direction: "x",
  reverse: true,
};
```

```typescript
const style = {
  display: "flex",
  justifyContent: "flex-end",
};
```

https://github.com/HoseungJang/flickable-scroll/assets/39669819/02c80887-cc20-4098-aa27-5c8236df8870

# API Reference

```typescript
const options = {
  direction,
  reverse,
  onScrollStart,
  onScrollMove,
  onScrollEnd,
};

const scroller = new FlickableScroller(container, options);

scroller.lock();

scroller.unlock();

scroller.destory();
```

- Parameters of `FlickableScroller`:
  - `container`: `HTMLElement`
    - Required
    - A scroll container element.
  - options
    - Optional
    - properties
      - `direction`: `"x" | "y"`
        - Optional
        - Defaults to `"y"`
        - A scroll direction
      - `reverse`: `boolean`
        - Optional
        - Defaults to `false`
        - If set to true, scroll direction will be reversed.
      - `onScrollStart`: `(e: ScrollEvent) => void`
        - Optional
        - This function will fire when a user starts to scroll
      - `onScrollMove`: `(e: ScrollEvent) => void`
        - Optional
        - This function will fire when a user is scrolling
      - `onScrollEnd`: `(e: ScrollEvent) => void`
        - Optional
        - This function will fire when a user finishes to scroll
- Methods of `FlickableScroller`:
  - `lock()`: `() => void`
    - This method locks scroll of the scroller.
  - `unlock()`: `() => void`
    - This method unlocks scroll of the scroller.
  - `destroy()`: `() => void`
    - This method destory the scroller. All event handlers will be removed, and all animations will be stopped.
