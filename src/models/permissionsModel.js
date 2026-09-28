const db = require('../config/db');

//get permission by role id
const rolePermsId = async (roleId) => {
    const [rows] = await db.query(
        'SELECT * FROM permissions WHERE role_id = ?',
        [roleId]
    );

    return rows;
};

module.exports = {
    rolePermsId
};