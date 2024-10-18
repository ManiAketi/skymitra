// app/api/service-providers/route.ts

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const service = searchParams.get('service')
    const state = searchParams.get('state')
    const district = searchParams.get('district')

    // Build the where clause based on the filters
    const whereClause: any = {}

    if (state) {
      whereClause.state = state
    }

    if (district) {
      whereClause.district = district
    }

    // Fetch service providers matching the filters
    const serviceProviders = await prisma.serviceProvider.findMany({
      where: whereClause,
      include: {
        services: {
          select: {
            name: true,
          },
          where: service
            ? {
                name: service,
              }
            : undefined,
        },
        images: {
          select: {
            url: true,
          },
          take: 1, // Get the first image
        },
      },
    })

    // Map the data to match the expected structure
    const providers = serviceProviders.map((provider) => ({
      id: provider.id,
      name: provider.name,
      rating: provider.rating || 4.5, // Use a default value if rating is not available
      state: provider.state,
      district: provider.district,
      services: provider.services.map((s) => s.name),
      phoneNumber: provider.phoneNumber,
      pricePerHour: provider.pricePerHour || 1000, // Use a default value if not available
      responseTime: provider.responseTime || '1 hour', // Use a default value if not available
      recentEnquiries: provider.recentEnquiries || 10, // Use a default value if not available
      imageUrl: provider.images[0]?.url || null,
    }))

    return NextResponse.json(providers, { status: 200 })
  } catch (error) {
    console.error('Error fetching service providers:', error)
    return NextResponse.json(
      { message: 'Error fetching service providers' },
      { status: 500 }
    )
  }
}
