export class validateUserInfo {
  static checkAccount(email: string, password: string): boolean {
    return this.#checkEmail(email) && this.#checkPassword(password);
  }

  static #checkEmail(email: string): boolean {
    return this.#hasAtSign(email);
  }

  static #checkPassword(password: string): boolean {
    return this.#isMinimumLength(password);
  }

  // static #isExistString(string: string): boolean {
  //   return string.trim().length > 0;
  // }

  static #hasAtSign(value: string): boolean {
    return value.includes('@');
  }

  static #isMinimumLength(value: string): boolean {
    return value.length >= 8;
  }
}
