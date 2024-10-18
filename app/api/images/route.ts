// app/api/images/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'
import { authOptions } from '../auth/[...nextauth]/route'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SERVICE_PROVIDER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const serviceProviderId = session.user.id as string

  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ message: 'No image file provided' }, { status: 400 })
    }

    // Convert the file to a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload the image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      {
        folder: 'service_provider_images',
        resource_type: 'image',
      },
      async (error, result) => {
        if (error || !result) {
          console.error('Cloudinary upload error:', error)
          return NextResponse.json({ message: 'Image upload failed' }, { status: 500 })
        }

        // Save the image URL and serviceProviderId in the database
        const newImage = await prisma.image.create({
          data: {
            url: result.secure_url,
            serviceProviderId,
          },
        })

        return NextResponse.json(newImage, { status: 201 })
      }
    )

    // Write the buffer to the Cloudinary upload stream
    uploadResult.end(buffer)
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ message: 'Error uploading image' }, { status: 500 })
  }
}

export const GET = async (request: Request) => {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SERVICE_PROVIDER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const serviceProviderId = session.user.id as string

  try {
    const images = await prisma.image.findMany({
      where: { serviceProviderId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(images, { status: 200 })
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json({ message: 'Error fetching images' }, { status: 500 })
  }
}
