import { PrismaClient } from '@prisma/client';

async function testDatabaseConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Database query successful. User count: ${userCount}`);
    
    // Test connection pool
    console.log('🔍 Testing connection pool...');
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(prisma.user.count());
    }
    await Promise.all(promises);
    console.log('✅ Connection pool test successful');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Error details:', {
      code: error.code,
      meta: error.meta,
      message: error.message
    });
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

testDatabaseConnection(); 