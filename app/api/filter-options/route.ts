// app/api/filter-options/route.ts

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Fetch distinct services from ServiceProvider services
    const servicesResult = await prisma.service.findMany({
      distinct: ['name'],
      select: {
        name: true,
      },
    })
    const services = servicesResult.map((service) => service.name)

    // Fetch distinct states from ServiceProvider
    const statesResult = await prisma.serviceProvider.findMany({
      distinct: ['state'],
      select: {
        state: true,
      },
    })
    const states = statesResult.map((provider) => provider.state)

    // Fetch distinct districts from ServiceProvider
    const districtsResult = await prisma.serviceProvider.findMany({
      distinct: ['district'],
      select: {
        district: true,
      },
    })
    const districts = districtsResult.map((provider) => provider.district)

    return NextResponse.json(
      {
        services,
        states,
        districts,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return NextResponse.json(
      { message: 'Error fetching filter options' },
      { status: 500 }
    )
  }
}
