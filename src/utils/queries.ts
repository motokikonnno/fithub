export const generateQueryString = (queries?: Object) => {
  if (!queries) return "";

  const params = new URLSearchParams();
  Object.entries(queries).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  return "?" + params.toString();
};
