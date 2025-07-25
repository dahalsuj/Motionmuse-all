import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a team
  const team = await prisma.team.create({
    data: {
      name: 'Acme Team',
      brandKit: {
        create: {
          logo: '/images/motionmuse-logo.png',
          fonts: ['Inter', 'Roboto'],
          colors: ['#FF5733', '#33C1FF'],
        },
      },
      usage: {
        create: {
          videosThisMonth: 5,
          quota: 100,
          activeUsers: 3,
        },
      },
      members: {
        create: [
          {
            email: 'john@example.com',
            name: 'John Doe',
            password: 'password',
            role: 'Admin',
            plan: 'enterprise',
          },
          {
            email: 'jane@example.com',
            name: 'Jane Smith',
            password: 'password',
            role: 'Editor',
            plan: 'enterprise',
          },
        ],
      },
      projects: {
        create: [
          { name: 'Project Alpha', user: 'John Doe', date: new Date('2024-06-01') },
          { name: 'Project Beta', user: 'Jane Smith', date: new Date('2024-06-02') },
        ],
      },
      videos: {
        create: [
          { title: 'Launch Video', creator: 'John Doe', date: new Date('2024-06-01'), status: 'Published' },
          { title: 'Ad Campaign', creator: 'Jane Smith', date: new Date('2024-05-28'), status: 'Draft' },
        ],
      },
      templates: {
        create: [
          { name: 'Promo Template' },
          { name: 'Demo Template' },
        ],
      },
      invoices: {
        create: [
          { date: new Date('2024-05-01'), amount: 99, status: 'Paid' },
          { date: new Date('2024-04-01'), amount: 99, status: 'Paid' },
        ],
      },
      permissions: {
        create: [
          { role: 'Admin', view: true, edit: true, delete: true, billing: true },
          { role: 'Editor', view: true, edit: true, delete: false, billing: false },
          { role: 'Viewer', view: true, edit: false, delete: false, billing: false },
        ],
      },
    },
    include: {
      members: true,
      brandKit: true,
      usage: true,
      projects: true,
      videos: true,
      templates: true,
      invoices: true,
      permissions: true,
    },
  });

  console.log('Seeded team:', team);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 