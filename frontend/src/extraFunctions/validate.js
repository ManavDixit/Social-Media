const regEx = {
  name: /^[\w\s]{3,12}$/,
  email: /^[\w\d]*\.?[\d\w]*@\w*\.\w*/,
  password: /^.{8,12}$/,
};
export const validateName = (name) => {
  return regEx.name.test(name.trim());
};
export const validateEmail = (email) => {
  return regEx.email.test(email.trim());
};
export const validatePassword = (password) => {
  return regEx.password.test(password.trim());
};
