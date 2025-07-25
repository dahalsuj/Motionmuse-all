import { PrismaClient } from '@prisma/client';

async function testAdminRoleAssignment() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Testing admin role assignment...');
    
    // Get all users with teams
    const usersWithTeams = await prisma.user.findMany({
      where: {
        teamId: { not: null }
      },
      include: {
        team: {
          include: {
            members: true,
            permissions: true
          }
        }
      }
    });
    
    console.log(`Found ${usersWithTeams.length} users with teams`);
    
    for (const user of usersWithTeams) {
      console.log(`\n👤 User: ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role || 'Not set'}`);
      console.log(`   Team: ${user.team?.name}`);
      console.log(`   Team Members: ${user.team?.members.length}`);
      console.log(`   Team Permissions: ${user.team?.permissions.length}`);
      
      // Check if user is admin
      const isAdmin = user.role === 'Admin';
      console.log(`   Is Admin: ${isAdmin ? '✅ YES' : '❌ NO'}`);
      
      if (!isAdmin) {
        console.log('   ⚠️  WARNING: Team creator should be Admin!');
      }
    }
    
    console.log('\n✅ Admin role test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminRoleAssignment(); 