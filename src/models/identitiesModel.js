const db = require('../config/db');

//create new identity
const createIdentity = async (userId, identityType, identityName) => {
    const [result] = await db.query(
        `INSERT INTO identities
        (user_id, identity_type, identity_name)
        VALUES (?, ?, ?)`,
        [userId, identityType, identityName]
    );

    return result.insertId;
};

//update identity
const updateIdentity = async (identityId, identityType, identityName) => {
    const [result] = await db.query(
        `UPDATE identities
         SET identity_type = ?, identity_name = ?
         WHERE identity_id = ?`,
        [identityType, identityName, identityId]
    );

    return result.affectedRows;
};

//delete identity
const deleteIdentity = async (identityId) => {
    const [result] = await db.query(
        'DELETE FROM identities WHERE identity_id = ?',
        [identityId]
    );

    return result.affectedRows;
};

//get all identities of user
const getUserId = async (userId) => {
    const [rows] = await db.query(
        'SELECT * FROM identities WHERE user_id = ?',
        [userId]
    );

    return rows;
};

//get a specific identity
const specificId = async (identityId) => {
    const [rows] = await db.query(
        'SELECT * FROM identities WHERE identity_id = ?',
        [identityId]
    );

    return rows[0];
};

//get specific type of identity for user
const userAndType = async (userId, identityType) => {
    const [rows] = await db.query(
        `SELECT *
         FROM identities
         WHERE user_id = ?
         AND identity_type = ?`,
        [userId, identityType]
    );

    return rows[0];
};

module.exports = {
    createIdentity,
    updateIdentity,
    deleteIdentity,
    getUserId,
    specificId,
    userAndType
};