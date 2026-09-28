//restrict access based on role id
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: 'Not authenticated'
            });
        }

        //check if user role allowed
        if (!allowedRoles.includes(req.user.roleId)) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        next();
    };
};

module.exports = {
    authorizeRoles
};