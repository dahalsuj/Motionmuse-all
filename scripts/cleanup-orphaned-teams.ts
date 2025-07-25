import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupOrphanedTeams() {
  try {
    // Find teams with no members
    const orphanedTeams = await prisma.team.findMany({
      include: {
        members: true
      }
    });

    const teamsToDelete = orphanedTeams.filter(team => team.members.length === 0);
    
    console.log(`Found ${teamsToDelete.length} orphaned teams to delete`);
    
    for (const team of teamsToDelete) {
      console.log(`Deleting orphaned team: ${team.name} (${team.code})`);
      
      // Delete related records first
      await prisma.$transaction([
        // Delete team usage
        prisma.teamUsage.deleteMany({
          where: { teamId: team.id }
        }),
        // Delete brand kit
        prisma.brandKit.deleteMany({
          where: { teamId: team.id }
        }),
        // Delete permissions
        prisma.permission.deleteMany({
          where: { teamId: team.id }
        }),
        // Delete projects
        prisma.project.deleteMany({
          where: { teamId: team.id }
        }),
        // Delete videos
        prisma.video.deleteMany({
          where: { teamId: team.id }
        }),
        // Delete templates
        prisma.template.deleteMany({
          where: { teamId: team.id }
        }),
        // Delete invoices
        prisma.invoice.deleteMany({
          where: { teamId: team.id }
        }),
        // Delete invitations
        prisma.invitation.deleteMany({
          where: { teamId: team.id }
        }),
        // Delete the team
        prisma.team.delete({
          where: { id: team.id }
        })
      ]);
      
      console.log(`Successfully deleted team: ${team.name}`);
    }
    
    console.log('Cleanup completed successfully!');
    
  } catch (error) {
    console.error('Error cleaning up orphaned teams:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOrphanedTeams(); 