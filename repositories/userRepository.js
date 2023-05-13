import pool from "../db/pool.js";

export default class UserRepository {
  static async getAll() {
    return (await pool.query("SELECT id, username, email FROM users ORDER BY id ASC"))
      .rows;
  }

  static async regUser({ username, email, password, role }) {
    const user = (await pool.query("INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *;", [username, email, password, role]))
      .rows[0];
    user.password = undefined;
    return user;
  }

  static async getUserByEmail(email) {
    const user = (await pool.query("SELECT * FROM users WHERE email = $1", [email])).rows[0];
    // user.password = undefined;
    return user;
  }

  static async getUserById(id) {
    const user =  (await pool.query("SELECT * FROM users WHERE id = $1", [id])).rows[0];
    user.password = undefined;
    return user;
  }

  static async deleteUserById(id) {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  }
}