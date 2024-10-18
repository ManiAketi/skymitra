import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '../../auth/[...nextauth]/route' //apply changes

const prisma = new PrismaClient()

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SERVICE_PROVIDER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const serviceProviderId = session.user.id as string
  const { id } = params
  const { name } = await request.json()

  try {
    const updatedService = await prisma.service.updateMany({
      where: {
        id,
        serviceProviderId,
      },
      data: { name },
    })
    return NextResponse.json(updatedService, { status: 200 })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ message: 'Error updating service' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SERVICE_PROVIDER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const serviceProviderId = session.user.id as string
  const { id } = params

  try {
    await prisma.service.deleteMany({
      where: {
        id,
        serviceProviderId,
      },
    })
    return NextResponse.json({ message: 'Service deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ message: 'Error deleting service' }, { status: 500 })
  }
}
