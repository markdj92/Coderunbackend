export class validateUserInfo {
  static checkAccount(email: string, password: string): boolean {
    return this.checkEmail(email) && this.checkPassword(password);
  }

  static checkEmail(email: string): boolean {
    const regEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-z]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    return regEmail.test(email);
  }

  static checkPassword(password: string): boolean {
    const regPassword = /^[0-9a-zA-Z\\d`~!@#$%^&*()-_=+]{8,20}$/;
    return regPassword.test(password);
  }

  static checkPasswordDiff(password: string, checkPassword: string | undefined): boolean {
    return password === checkPassword;
  }
}
