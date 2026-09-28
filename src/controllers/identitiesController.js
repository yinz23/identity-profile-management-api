const identitiesModel = require('../models/identitiesModel');
const permissionsModel = require('../models/permissionsModel');

const contextIdentity = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const requesterRoleId = req.user.roleId;

        //all permissions for requester role
        const perms = await permissionsModel.rolePermsId(requesterRoleId);

        if (perms.length === 0) {
            return res.status(403).json({
                message: 'No permissions for this role'
            });
        }

        //identity types this role can access
        const identityTypes = perms.map(
            permission => permission.identity_type
        );

        //identities of target user
        const identities =
            await identitiesModel.getUserId(targetUserId);

        //identities visible to requester 
        const visibleIdentities = identities.filter(
            identity =>
                identityTypes.includes(identity.identity_type)
        );

        if (visibleIdentities.length === 0) {
            return res.status(404).json({
                message: 'No identities found'
            });
        }

        res.json({
            userId: targetUserId,
            requestedBy: req.user.userId,
            identities: visibleIdentities
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to retrieve identity'
        });
    }
};

//create new identity
const createIdentity = async (req, res) => {
    try {
        const { identityType, identityName } = req.body;
        const userId = req.user.userId;

        if (!identityType || !identityName) {
            return res.status(400).json({
                message: 'Identity type and name are required'
            });
        }

        //check if identity type alr exists
        const existingIdentity =
            await identitiesModel.userAndType(
                userId,
                identityType
            );

        if (existingIdentity) {
            return res.status(409).json({
                message: 'This identity type already exists'
            });
        }

        const identityId =
            await identitiesModel.createIdentity(
                userId,
                identityType,
                identityName
            );

        res.status(201).json({
            message: 'Identity created successfully',
            identityId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to create identity'
        });
    }
};

//update identity
const updateIdentity = async (req, res) => {
    try {
        const identityId = req.params.id;
        const { identityType, identityName } = req.body;
        const userId = req.user.userId;

        if (!identityType || !identityName) {
            return res.status(400).json({
                message: 'Identity type and name are required'
            });
        }

        //find updated identity
        const identity = await identitiesModel.specificId(identityId);

        if (!identity) {
            return res.status(404).json({
                message: 'Identity not found'
            });
        }

        if (identity.user_id !== userId) {
            return res.status(403).json({
                message: 'You can only update your own identity'
            });
        }

        const existingIdentity =
            await identitiesModel.userAndType(
                userId,
                identityType
            );

        if (
            existingIdentity && existingIdentity.identity_id !== Number(identityId)
        ) {
            return res.status(409).json({
                message: 'This identity type already exists'
            });
        }

        //update identity
        await identitiesModel.updateIdentity(
            identityId,
            identityType,
            identityName
        );

        res.json({
            message: 'Identity updated successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to update identity'
        });
    }
};


//delete identity
const deleteIdentity = async (req, res) => {
    try {
        const identityId = req.params.id;
        const userId = req.user.userId;

        const identity =
            await identitiesModel.specificId(identityId);

        if (!identity) {
            return res.status(404).json({
                message: 'Identity not found'
            });
        }

        if (identity.user_id !== userId) {
            return res.status(403).json({
                message: 'You can only delete your own identity'
            });
        }

        await identitiesModel.deleteIdentity(identityId);

        res.json({
            message: 'Identity deleted successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to delete identity'
        });
    }
};

//all identities of logged in user
const userIdentities = async (req, res) => {
    try {
        const userId = req.user.userId;
        const identities = await identitiesModel.getUserId(userId);

        res.json({
            userId,
            identities
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to retrieve identities'
        });
    }
};

module.exports = {
    contextIdentity,
    createIdentity,
    updateIdentity,
    deleteIdentity,
    userIdentities
};