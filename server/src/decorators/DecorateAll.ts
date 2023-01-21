function DecorateAll<T extends Function>(decorator: GMethodDecorator<T>) {
  return function (target: Function) {
    const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    for (const [propertyKey, descriptor] of Object.entries(descriptors)) {
      const isMethod =
        typeof descriptor.value === "function" && propertyKey !== "constructor";
      if (!isMethod) continue;
      decorator(target, propertyKey, descriptor);
      Object.defineProperty(target.prototype, propertyKey, descriptor);
    }
  };
}

export default DecorateAll;
