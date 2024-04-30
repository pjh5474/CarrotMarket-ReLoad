export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 10;
export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_MAX_LENGTH = 20;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);
export const VALIDATION_TOKEN_MIN_LENGTH = 100000;
export const VALIDATION_TOKEN_MAX_LENGTH = 999999;
