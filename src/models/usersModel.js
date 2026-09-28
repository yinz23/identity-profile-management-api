const db = require('../config/db');

//create new user
const createUser = async (username, email, passwordHash, roleId) => {
    const [result] = await db.query(
        `INSERT INTO users 
        (username, email, password_hash, role_id)
        VALUES (?, ?, ?, ?)`,
        [username, email, passwordHash, roleId]
    );

    return result.insertId;
};

//find user by username
const userByUsername = async (username) => {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );

    return rows[0];
};

//find user by id
const userById = async (userId) => {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE user_id = ?',
        [userId]
    );

    return rows[0];
};

//get all users
const allUsers = async () => {
    const [rows] = await db.query(
        'SELECT * FROM users'
    );

    return rows;
};

module.exports = {
    createUser,
    userByUsername,
    userById,
    allUsers
};