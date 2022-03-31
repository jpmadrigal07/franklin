const validateEmail = (email: string) => {
  let validated = false;
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return validated;
};

export default validateEmail;
