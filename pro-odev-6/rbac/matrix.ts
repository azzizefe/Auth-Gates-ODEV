export const RolePermissions: Record<string, string[]> = {
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

export function hasPermission(role: string, permission: string): boolean {
    return (RolePermissions as any)[role]?.includes(permission) || false;
}
