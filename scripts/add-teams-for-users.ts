import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateTeamCode(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

async function addTeamsForUsers() {
  try {
    // Get all users without teams
    const usersWithoutTeams = await prisma.user.findMany({
      where: {
        teamId: null
      }
    });

    console.log(`Found ${usersWithoutTeams.length} users without teams`);

    // Create teams for each user without a team
    for (const user of usersWithoutTeams) {
      // Generate a unique team code
      let code;
      let exists = true;
      while (exists) {
        code = generateTeamCode();
        exists = await prisma.team.findUnique({ where: { code } });
      }

      const team = await prisma.team.create({
        data: {
          name: `${user.name}'s Team`,
          code: code,
          usage: {
            create: {
              videosThisMonth: 0,
              quota: user.plan === "enterprise" ? 300 : 10, // Different quota based on plan
              activeUsers: 1,
            }
          },
          brandKit: {
            create: {
              fonts: [],
              colors: [],
            }
          },
          permissions: {
            create: {
              role: "Admin",
              view: true,
              edit: true,
              delete: true,
              billing: true,
            }
          }
        }
      });

      // Update user with team ID and set role to Admin
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          teamId: team.id,
          role: "Admin" // All users get Admin role for their own team
        }
      });

      console.log(`Created team for user ${user.email} (${user.plan} plan)`);
    }

    console.log('Team creation completed successfully!');
  } catch (error) {
    console.error('Error creating teams:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTeamsForUsers(); 