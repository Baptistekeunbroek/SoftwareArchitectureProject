class User {
    constructor(id, username, email, password, role) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.password = password;
      this.role = role;
    }
  
    static findByEmail(email) {
      return users.find((user) => user.email === email);
    }
  
    static findById(id) {
      return global.users.find((user) => user.id === id);
    }
  
    static findByRole(role) {
      return global.users.filter((user) => user.role === role);
    }
  }

const users = [
  new User(1, "agent", "agent.agent@efrei", "test1234", "agent"),
  new User(2, "customer", "customer.customer@efrei", "test1234", "customer"),
];

module.exports = { users, User };
