-- Create teams for users without teams
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT id, name, email 
        FROM users 
        WHERE "teamId" IS NULL
    LOOP
        -- Create team
        WITH new_team AS (
            INSERT INTO "Team" (id, name)
            VALUES (gen_random_uuid(), user_record.name || '''s Team')
            RETURNING id
        ),
        -- Create team usage
        new_usage AS (
            INSERT INTO "TeamUsage" (id, "teamId", "videosThisMonth", quota, "activeUsers")
            SELECT gen_random_uuid(), id, 0, 10, 1
            FROM new_team
            RETURNING "teamId"
        ),
        -- Create brand kit
        new_brand_kit AS (
            INSERT INTO "BrandKit" (id, "teamId", fonts, colors)
            SELECT gen_random_uuid(), id, '{}', '{}'
            FROM new_team
            RETURNING "teamId"
        ),
        -- Create permissions
        new_permissions AS (
            INSERT INTO "Permission" (id, "teamId", role, view, edit, "delete", billing)
            SELECT gen_random_uuid(), id, 'admin', true, true, true, true
            FROM new_team
            RETURNING "teamId"
        )
        -- Update user with team ID
        UPDATE users
        SET "teamId" = (SELECT id FROM new_team)
        WHERE id = user_record.id;
    END LOOP;
END $$; 