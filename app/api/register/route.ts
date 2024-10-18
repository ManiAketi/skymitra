import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, phoneNumber, role, state, district, services } = body

    // Check if user or service provider already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    const existingServiceProvider = await prisma.serviceProvider.findUnique({ where: { email } })

    if (existingUser || existingServiceProvider) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 10)

    // Create the user or service provider
    if (role === 'USER') {
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          role: 'USER',
        },
      })
    } else if (role === 'SERVICE_PROVIDER') {
      const serviceProvider = await prisma.serviceProvider.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          state,
          district,
          availability: {}, // Initialize with an empty object
        },
      })

      // Create services for the service provider
      if (services && services.length > 0) {
        await prisma.service.createMany({
          data: services.map(serviceName => ({
            name: serviceName,
            serviceProviderId: serviceProvider.id,
          })),
        })
      }
    } else {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Registration successful' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 })
  }
}