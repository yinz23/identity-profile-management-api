const db = require('../config/db');

//get all roles
const allRoles = async () => {
    const [rows] = await db.query(
        'SELECT * FROM roles'
    );

    return rows;
};

//get role by its id
const roleId = async (roleId) => {
    const [rows] = await db.query(
        'SELECT * FROM roles WHERE role_id = ?',
        [roleId]
    );

    return rows[0];
};

module.exports = {
    allRoles,
    roleId
};