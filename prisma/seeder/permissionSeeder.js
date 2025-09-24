import { createConnections, prisma } from "../utils/db.js";

export async function main() {
    const { externalDb, localDb } = await createConnections();

    const [permissionTypes] = await externalDb.execute("SELECT * FROM permission_types");

    // for (const permission_type of permissionTypes) {
    //     await prisma.permission_types.create({
    //         data: {
    //             id: permission_type.id,
    //             name: permission_type.name,
    //             parent_id: permission_type.parent_id || null,
    //             output_name: permission_type.output_name,
    //             opt_add: Boolean(permission_type.opt_add),
    //             opt_edit: Boolean(permission_type.opt_edit),
    //             opt_view: Boolean(permission_type.opt_view),
    //             opt_remove: Boolean(permission_type.opt_remove),
    //             created_at: new Date(),
    //             updated_at: new Date(),
    //             deleted_at: null
    //         },
    //     });
    // }

    // console.log("Permission Type seed complete");

    // const [permissionProfiles] = await externalDb.execute("SELECT * FROM permission_profile");
    // for (const permission_profile of permissionProfiles) {
    //     await prisma.permission_profiles.create({
    //         data: {
    //             id: permission_profile.id,
    //             owner_id: permission_profile.owner_id,
    //             profile_name: permission_profile.profile_name,
    //             created_by: permission_profile.created_by,
    //             created_at: permission_profile.created_at || new Date(),
    //             updated_at: permission_profile.updated_at || new Date(),
    //             deleted_at: permission_profile.deleted_at || null,
    //         },
    //     });
    // }

    // console.log("Permission Profile seed complete");

    // const [profilePermissions] = await externalDb.execute("SELECT * FROM profile_permission");
    // for (const pp of profilePermissions) {
    //     const exists = await prisma.permission_types.findUnique({
    //         where: { id: pp.premission_id },
    //     });

    //     if (!exists) {
    //         console.warn(`Skipping profile_permission ${pp.id}, missing permission_type ${pp.premission_id}`);
    //         continue;
    //     }

    //     await prisma.profile_permissions.create({
    //         data: {
    //             id: pp.id,
    //             profile_id: pp.profile_id,
    //             permission_type_id: pp.premission_id,
    //             is_add: Boolean(pp.is_add),
    //             is_edit: Boolean(pp.is_edit),
    //             is_view: Boolean(pp.is_view),
    //             is_remove: Boolean(pp.is_remove),
    //             created_at: pp.created_at || new Date(),
    //             updated_at: pp.updated_at || new Date(),
    //             deleted_at: pp.deleted_at || null,
    //         },
    //     });
    // }

    // console.log("Profile Permission seed complete");

    const [userPermissions] = await externalDb.execute("SELECT * FROM user_permission");

    // Filter out rows missing permission_type_id
    const validPermissions = userPermissions.filter(
        up => up.permission_type_id || up.premission_id
    );

    await prisma.user_permissions.createMany({
        data: validPermissions.map(up => ({
            id: up.id,
            user_id: up.user_id,
            owner_id: up.owner_id === 0 ? null : up.owner_id,
            permission_type_id: up.permission_type_id || up.premission_id,
            is_add: up.is_add === 1,
            is_edit: up.is_edit === 1,
            is_view: up.is_view === 1,
            is_remove: up.is_remove === 1,
        })),
        skipDuplicates: true,
    });

    await externalDb.end();
    await localDb.end();
}
