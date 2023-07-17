export class validateUserInfo {
  static checkAccount(email: string, password: string): boolean {
    return this.checkEmail(email) && this.checkPassword(password);
  }

  static checkEmail(email: string): boolean {
    const regemail = /^([0-9a-zA-Z_\.-]+)@([0-9a-z]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    return regemail.test(email);
  }

  static checkPassword(password: string): boolean {
    const regpassword = /^([0-9a-zA-Z_\.-]+){8}$/;
    return regpassword.test(password);
  }

  static checkPasswordDiff(password: string, checkpassword: string) {
    return password === checkpassword;
  }
}
