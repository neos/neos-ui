# @neos-project/framework-observable-react

> React bindings for @neos-project/framework-observable

This package provides a set of React [hooks](https://react.dev/reference/react/hooks) to let components interact with `Observable`s.

## API

### `useLatestValueFrom`

```typescript
// Without default value:
function useLatestValueFrom<V>(observable$: Observable<V>): null | V;

// With default value:
function useLatestValueFrom<V, D>(
  observable$: Observable<V>,
  defaultValue: D
): D | V;
```

`useLatestValueFrom` is a way to bind a react component the latest value emitted from an `Observable`.

#### Parameters

| Name                      | Description                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `observable$`             | The `Observable` to subscribe to                                                               |
| `defaultValue` (optional) | The value to default for when `observable$` hasn't emitted any values yet (defaults to `null`) |

#### Return Value

This hook returns the latest value from the provided `observable$`. If no value has been emitted from the observable yet, it returns `defaultValue` which itself defaults to `null`.

#### Example

This component will display the amount of seconds that have passed since it was first mounted:

```typescript
const clock$ = createObservable((next) => {
  let i = 1;
  const interval = setInterval(() => {
    next(i++);
  }, 1000);

  return () => clearInterval(interval);
});

const MyComponent = () => {
  const seconds = useLatestValueFrom(clock$, 0);

  return <pre>{seconds} seconds passed</pre>;
};
```

You can combine this with `React.useMemo`, if you wish to create an ad-hoc observable:

```typescript
const MyComponent = (props) => {
  const beats = useLatestValueFrom(
    React.useMemo(
      () =>
        createObservable((next) => {
          let i = 1;
          const interval = setInterval(() => {
            next(i++);
          }, props.millisecondsPerBeat);

          return () => clearInterval(interval);
        }),
      [props.millisecondsPerBeat]
    ),
    0
  );

  return <pre>{beats} beats passed</pre>;
};
```

### `useLatestState`

```typescript
function useLatestState<V>(state$: State<V>): V;
```

`useLatestState` subscribes to a given state observable and keeps track of its latest value.

#### Parameters

| Name     | Description                             |
| -------- | --------------------------------------- |
| `state$` | The `State` observable to keep track of |

#### Return Value

This hook returns the latest value from the given `State` observable. Initially it contains the current value of the `State` at the moment the component was first mounted.

#### Example

```typescript
const count$ = createState(0);

const MyComponent = () => {
  const count = useLatestState(count$);
  const handleInc = React.useCallback(() => {
    count$.update((count) => count + 1);
  }, []);
  const handleDec = React.useCallback(() => {
    count$.update((count) => count - 1);
  }, []);

  return (
    <div>
      <pre>Count {count}</pre>
      <button onClick={handleInc}>+</button>
      <button onClick={handleDec}>-</button>
    </div>
  );
};
```
