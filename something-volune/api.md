# Events and Messages

Events and Messages are objects with a `type` member.
Here Event is just a name for messages that come from outside of the component.

```
{
  type,
  ...optionalArguments,
}
```

# Transformer

A transformer is a function that takes an event and some options, and return an iterable over messages.

Options:
- `getState` A function that takes no arguments and returns the current state
- `getProps` A function that takes no arguments and returns the current component props

```
function transform(
  message,
  {
    getState,
    getProps,
  }
) {
  return messages;
}
```

```
function *transform(
  message,
  {
    getState,
    getProps,
  }
) {
  yield* messages;
}
```


