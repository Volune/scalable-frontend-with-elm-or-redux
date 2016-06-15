export const ANY = {};
export const FOUND = {};
export const NOT_FOUND = {};

export default function toTransformer() {
  const declarations = this;

  return function *tranform(event, transformOptions) {
    const createEmittedMessage = (message, emittedType, declarationOptions) => {
      if (declarationOptions.create) {
        return {
          ...declarationOptions.create(message, transformOptions),
          type: emittedType,
        };
      }
      return {
        type: emittedType,
      };
    };

    function *tranformMessage(message) {
      const { type } = message;
      let defaultPrevented = false;
      let found = false;

      for (const tranformerDeclaration of declarations) {
        const [expectedType, emittedType, declarationOptions = {}] = tranformerDeclaration;
        if (expectedType === type
          || expectedType === ANY
          || (expectedType === FOUND && found)
          || (expectedType === NOT_FOUND && !found)
        ) {
          found = true;
          if (declarationOptions.filter && !declarationOptions.filter(message, transformOptions)) {
            continue;
          }
          defaultPrevented = defaultPrevented || Boolean(declarationOptions.preventDefault);
          const emittedMessage = createEmittedMessage(message, emittedType, declarationOptions);
          if (declarationOptions.transformEmittedMessage) {
            yield* tranformMessage(emittedMessage);
          } else {
            yield emittedMessage;
          }
          if (declarationOptions.stopPropagation) {
            break;
          }
        }
      }

      if (!defaultPrevented) {
        yield message;
      }
    }

    yield* tranformMessage(event);
  };
}
