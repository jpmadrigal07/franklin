const findInputError = (errors: any, input: string) => {
  const filtered = errors && errors.filter((res: any) => res.input === input);
  return filtered.length > 0 ? filtered[0].errorMessage : null;
};

export default findInputError;
