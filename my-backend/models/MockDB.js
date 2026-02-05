// Mock database for testing without MongoDB
const users = {};

class MockUser {
  constructor(data) {
    this._id = Math.random().toString(36).substr(2, 9);
    Object.assign(this, data);
  }
  
  async save() {
    users[this._id] = this;
    return this;
  }
  
  static async create(data) {
    const user = new MockUser(data);
    users[user._id] = user;
    return user;
  }
  
  static async findOne(query) {
    return Object.values(users).find(u => {
      if (query.email) return u.email === query.email;
      if (query.phone) return u.phone === query.phone;
      return false;
    });
  }
}

module.exports = { users, MockUser };
