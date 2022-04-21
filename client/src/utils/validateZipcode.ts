const validateZipcode = (zipcode: string) => {
  let isVerified = false;
  if (zipcode.length === 4 && !isNaN(Number(zipcode))) {
    isVerified = true;
  }
  return isVerified;
};

export default validateZipcode;
