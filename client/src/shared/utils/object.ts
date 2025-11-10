export const removeFalsyValues = <T extends object>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) =>
        (typeof value === 'number' && !Number.isNaN(value)) || Boolean(value)
    )
  );
