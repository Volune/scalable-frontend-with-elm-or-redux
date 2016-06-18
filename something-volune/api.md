# Engine

## Events and Messages

Events and Messages are objects with a `type` member.
Here Event is just a name for messages that come from outside of the component.

```
{
  type,
  ...optionalArguments,
}
```


## Mapper

A mapper is a function taking an event and some options, 
and returning an event with the same type, but other fields may be different.

```
mappedEvent = mapper(event, { getState, getApiProps })
```

Options:
- `getState()` A function returning the current state
- `getApiProps()` A function returning the props of the assembled component


## Transformer

A transformer is a function taking an event and some options, 
and returning an iterable over messages.

```
messagesIterable = transformer(event, { getState, getApiProps })
```

Options:
- `getState()` A function returning the current state
- `getApiProps()` A function returning the props of the assembled component


## Consumer

A consumer is a function taking a message and some options, and producing side effects.

```
consumer(message, { getState, getApiProps, getDependencies, dispatch })
```

Options:
- `getState()` A function returning the current state
- `getApiProps()` A function returning the props of the assembled component
- `getDependencies()` A function returning the dependencies injected in the assembled component
- `dispatch(event)` A function to dispatch a new event in the assembled component's engine. Must not be called synchronously.


## Reducer

A reducer is a function taking a message, the current state and some options, 
and returning the updated state.

```
newState = reducer(message, state, { getApiProps })
```

Options:
- `getApiProps()` A function returning the props of the assembled component


