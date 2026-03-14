const RolePermissions = {
    Admin: [
        'users:read', 'users:write', 'users:delete',
        'content:read', 'content:write', 'content:delete',
        'reports:read', 'reports:export',
        'settings:read', 'settings:write'
    ],
    Editor: [
        'content:read', 'content:write', 'content:delete',
        'reports:read'
    ],
    Viewer: [
        'content:read'
    ]
};

function hasPermission(role, permission) {
    return RolePermissions[role]?.includes(permission) || false;
}

module.exports = { RolePermissions, hasPermission };
