const TryCatchMiddleware: GMethodDecorator<Middleware> = function (
  target,
  propertyKey,
  descriptor
) {
  const original = descriptor.value;
  descriptor.value = async function (req, res, next) {
    try {
      await original?.call(this, req, res, next);
    } catch (e) {
      next(e);
    }
  };
};

export default TryCatchMiddleware;
