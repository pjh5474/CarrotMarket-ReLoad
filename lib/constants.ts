export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 10;
export const USERNAME_LENGTH_ERROR_MESSAGE =
  "Username 은 3 글자 이상, 10 글자 이하여야 합니다.";
export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_MAX_LENGTH = 20;
export const PASSWORD_LENGTH_ERROR_MESSAGE =
  "비밀번호는 8 글자 이상, 20 글자 이하여야 합니다.";
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR_MESSAGE =
  "비밀번호는 1개 이상의 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";

export const PASSWORD_CHECK_ERROR_MESSAGE =
  "Password와 confromPassword가 일치하지 않습니다.";

export const REQUIRED_ERROR_MESSAGE = (target: string) =>
  `${target}을(를) 입력하세요.`;
