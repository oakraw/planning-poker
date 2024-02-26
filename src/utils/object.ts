export const removeUndefined = (obj: any): any =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );