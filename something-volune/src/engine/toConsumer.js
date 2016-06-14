export default function toConsumer() {
  return (message, consumeOptions) => {
    this.forEach(consumerDeclaration => {
      const [expectedMessage, consume, declarationOptions] = consumerDeclaration;
      if (expectedMessage === message) {
        consume(message, consumeOptions);
        return Boolean(declarationOptions.preventDefault);
      }
      return false;
    });
  };
}
