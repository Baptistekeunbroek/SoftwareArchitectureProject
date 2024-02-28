class User {
  constructor(id, username, email, password, role) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static findByEmail(email) {
    return global.users.find((user) => user.email === email);
  }

  static findById(id) {
    return global.users.find((user) => user.id === id);
  }
}

module.exports = User;
