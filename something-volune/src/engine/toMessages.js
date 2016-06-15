export default function toMessages() {
  return this.reduce(
    (object, key) =>
      Object.assign(object, {
        [key]: key,
      }),
    {}
  );
}
