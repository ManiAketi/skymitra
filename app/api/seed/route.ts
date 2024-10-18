import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Create users
    for (let i = 1; i <= 10; i++) {
      await prisma.user.create({
        data: {
          name: `User ${i}`,
          email: `user${i}@example.com`,
          phoneNumber: `123-456-${7890 + i}`,
          password: await hash('password123', 10),
          role: 'USER',
        },
      })
    }

    // Create service providers
    const services = [
      'Agriculture & Forestry',
      'Construction & Infrastructure',
      'Inspections',
      'Security & Surveillance',
      'Entertainment & Media',
    ]

    for (let i = 1; i <= 5; i++) {
      const serviceProvider = await prisma.serviceProvider.create({
        data: {
          name: `Service Provider ${i}`,
          email: `provider${i}@example.com`,
          phoneNumber: `987-654-${3210 + i}`,
          password: await hash('password123', 10),
          state: i % 2 === 0 ? 'California' : 'New York',
          district: i % 2 === 0 ? 'Los Angeles' : 'Manhattan',
        },
      })

      // Add services for each provider
      for (const service of services) {
        await prisma.service.create({
          data: {
            name: service,
            serviceProviderId: serviceProvider.id,
          },
        })
      }
    }

    // Create admins
    for (let i = 1; i <= 2; i++) {
      await prisma.user.create({
        data: {
          name: `Admin ${i}`,
          email: `admin${i}@example.com`,
          phoneNumber: `555-555-${5550 + i}`,
          password: await hash('adminpass123', 10),
          role: 'ADMIN',
        },
      })
    }

    return new Response('Test data inserted successfully', { status: 200 })
  } catch (error) {
    console.error('Error inserting test data:', error)
    return new Response('Error inserting test data', { status: 500 })
  }
}