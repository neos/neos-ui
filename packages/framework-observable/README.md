# @neos-project/framework-observable

> Observable pattern implementation for the Neos UI

> [!NOTE]
> This package implements a pattern for which there is a WICG proposal:
> https://github.com/WICG/observable
>
> It is therefore likely that future versions of this package will use the web-native `Observable` primitive under the hood.

## API

### Observables

An `Observable` represents a sequence of values that can be *observed* from the outside. This is a powerful abstraction that allows to encapsule all kinds of value streams like:

- (DOM) Events
- Timeouts & Intervals
- Async operations & Promises
- Websockets
- etc.

An `Observable` can be created using the `createObservable` function like this:

```typescript
const numbers$ = createObservable((next) => {
    next(1);
    next(2);
    next(3);
});
```

> [!NOTE]
> Suffixing variable names with `$` is a common naming convention to signify that a variable represents an observable.

Here, the `numbers$` observable represents the sequence of the numbers 1, 2 and 3. This observable can be subscribed to thusly:

```typescript
numbers$.subscribe((value) => {
  console.log(value);
});
```

Because the `numbers$` observable emits its values immediately, the above subscription will immediately log:
```
1
2
3
```

An additional subscription would also immediately receive all 3 values. By default, oberservables are *lazy* and *single-cast*. This means, values are generated exclusively for each subscription, and the generation starts exactly when a subscriber is registered.

The usefulness of observables becomes more apparent when we introduce some asynchrony:
```typescript
const timedNumbers$ = createObservable((next) => {
  let i = 1;
  const interval = setInterval(() => {
    next(i++);
  }, 2000);

  return () => clearInterval(interval);
});
```

This `timedNumbers$` observable will emit a new value every two seconds. This time, the callback used to facilitate the observable returns a function:
```typescript
// ..
return () => clearInterval(interval);
// ..
```

This function will be called when a subscription is cancelled. This is a way for observables to clean up after themselves.

If we now subscribe to `timedNumbers$` like this:
```typescript
const subscription = timedNumbers$.subscribe((value) => {
  console.log(value);
});
```

The following values will be logged to the console:
```
1 (After 2 seconds)
2 (After 4 seconds)
3 (After 6 seconds)
4 (After 8 seconds)
...
```

This will go on forever, unless we call the `unsubscribe` on our `subscription` which has been the return value we've saved from `timedNumber$.subscribe(...)`. When we call `unsubscribe`, the cleanup function of the `timedNumbers$` observable will be called and so the interval will be cleared:
```typescript
subscription.unsubscribe();
```

That's all there is to it. With this small set of tools, `Observable`s can be used to encapsule all kinds of synchronous or asynchronous value streams.

They can be created from a Promise:
```typescript
async function someLongRunningOperation() {
  // ...
}

const fromPromise$ = createObservable((next) => {
  someLongRunningOperation().then(next);
});
```

Or DOM events:
```typescript
const clicks$ = createObservable((next) => {
  const button = document.querySelector('button');
  button.addEventListener('click', next);
  return () => button.removeEventListener('click', next);
});
```

And there are many, many more possibilities.

### State

A `State` is a special `Observable` that can track a value over time. `State`s can be created using the `createState` function like this:

```typescript
const count$ = createState(0);
```

The `count$` state is now set to `0`. Unlike regular observables, a `State` instance can be queried for its current value:
```typescript
console.log(count$.current); // output: 0
```

Each `State` instance has an `update` method that can be used to push new values to the state observable. It takes a callback that receives the current value as its first paramater and returns the new value:

```typescript
count$.update((value) => value + 1);

console.log(count$.current); // output: 1
```

When a new subscriber is registered to a `State` instance, that subscriber immediately receives the current value:
```typescript
const count$ = createState(0);
count$.update((value) => value + 1); // nothing is logged, nobody has subscribed yet
count$.update((value) => value + 1); // nothing is logged, nobody has subscribed yet
count$.update((value) => value + 1); // nothing is logged, nobody has subscribed yet

count$.subscribe((value) => console.log(value)); // immediately logs: 3

count$.update((value) => value + 1); // logs: 4
```

Unlike regular `Observable`s, `State`s are multi-cast. This means that all subscribers receive updates at the same time, and every subscriber only receives updates that are published after the subscription has been registered.
