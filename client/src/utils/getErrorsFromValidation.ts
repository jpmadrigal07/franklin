const getErrorsFromValidation = (data: any[]) => {
  const general = data.filter((res: any) => res.instancePath === "");
  const regular = data.filter((res: any) => res.instancePath !== "");
  const generalRemapped =
    general.length > 0
      ? general[0]?.params.errors.map((res: any) => {
          return {
            input: res.params.missingProperty,
            errorMessage: general[0].message,
          };
        })
      : [];
  const regularRemapped =
    regular.length > 0
      ? regular?.map((res: any) => {
          return {
            input: res.instancePath.substring(1),
            errorMessage: res.message,
          };
        })
      : [];
  return [...generalRemapped, ...regularRemapped];
};

export default getErrorsFromValidation;
