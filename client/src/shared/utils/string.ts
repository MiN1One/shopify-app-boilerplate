export const strToBase64 = (str: string) => {
  const bytes = new TextEncoder().encode(str);
  return btoa(String.fromCharCode(...bytes));
};
