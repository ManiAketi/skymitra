import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '../auth/[...nextauth]/route' // Adjust the import path as needed

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SERVICE_PROVIDER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const serviceProviderId = session.user.id as string
  const { name } = await request.json()

  try {
    const newService = await prisma.service.create({
      data: {
        name,
        serviceProviderId,
      },
    })
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ message: 'Error creating service' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SERVICE_PROVIDER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const serviceProviderId = session.user.id as string

  try {
    const services = await prisma.service.findMany({
      where: { serviceProviderId },
    })
    return NextResponse.json(services, { status: 200 })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ message: 'Error fetching services' }, { status: 500 })
  }
}
