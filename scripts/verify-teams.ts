import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyTeams() {
  try {
    // Get all users with their team information
    const users = await prisma.user.findMany({
      include: {
        team: {
          include: {
            usage: true,
            brandKit: true,
            permissions: true,
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                plan: true
              }
            }
          }
        }
      }
    });

    console.log(`\n=== TEAM VERIFICATION REPORT ===`);
    console.log(`Total users: ${users.length}`);
    
    const usersWithTeams = users.filter(user => user.teamId);
    const usersWithoutTeams = users.filter(user => !user.teamId);
    
    console.log(`Users with teams: ${usersWithTeams.length}`);
    console.log(`Users without teams: ${usersWithoutTeams.length}`);
    
    if (usersWithoutTeams.length > 0) {
      console.log(`\n⚠️  USERS WITHOUT TEAMS:`);
      usersWithoutTeams.forEach(user => {
        console.log(`  - ${user.email} (${user.name}) - Plan: ${user.plan}`);
      });
    }
    
    if (usersWithTeams.length > 0) {
      console.log(`\n✅ USERS WITH TEAMS:`);
      usersWithTeams.forEach(user => {
        console.log(`  - ${user.email} (${user.name})`);
        console.log(`    Plan: ${user.plan}, Role: ${user.role}`);
        console.log(`    Team: ${user.team?.name} (${user.team?.code})`);
        console.log(`    Team Members: ${user.team?.members.length}`);
        console.log(`    Team Quota: ${user.team?.usage?.quota || 'N/A'}`);
        console.log(``);
      });
    }
    
    // Check for any orphaned teams (teams without members)
    const teams = await prisma.team.findMany({
      include: {
        members: true
      }
    });
    
    const orphanedTeams = teams.filter(team => team.members.length === 0);
    if (orphanedTeams.length > 0) {
      console.log(`\n⚠️  ORPHANED TEAMS (no members):`);
      orphanedTeams.forEach(team => {
        console.log(`  - ${team.name} (${team.code})`);
      });
    }
    
    console.log(`\n=== END REPORT ===`);
    
  } catch (error) {
    console.error('Error verifying teams:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTeams(); 