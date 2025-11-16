"use server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

interface CloudinaryUploadResult {
  public_id: string
  [key: string]: string
}

export const uploadImage = async (file: File) => {
  const bytes = file.arrayBuffer()
  const buffer = Buffer.from(await bytes)
  const result = await new Promise<CloudinaryUploadResult>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "saas-lms" },
        (error, result) => {
          if (error) {
            console.log(error)
            reject(error)
          } else {
            resolve(result as CloudinaryUploadResult)
          }
        },
      )
      uploadStream.end(buffer)
    },
  )
  // console.log("image info",result.url);
  return result.public_id
}
