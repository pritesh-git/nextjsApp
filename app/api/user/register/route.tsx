import { db, fireStorage } from '@/firebaseConfig'
import { UserType } from '@/shared/interfaces/types'
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { get } from 'lodash'
import { NextRequest, NextResponse } from 'next/server'

function generateUniqueFilename(
  fileOriginalName: string,
  userName = 'User',
): string {
  const extension = fileOriginalName.split('.').pop()
  const sanitizedUserName = userName.replace(/[^a-zA-Z0-9]/g, '')
  const randomData = Math.random().toString(36).substring(2, 15)
  return `${sanitizedUserName}_${randomData}.${extension}`
}

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData()
    const formDataObject: { [key: string]: string | File } = {}

    const entries = Array.from(formData.entries())
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i]
      formDataObject[key] = value
    }

    const existingUsersQuery = query(
      collection(db, 'users'),
      where('email', '==', formDataObject.email),
    )

    const existingUsersSnapshot = await getDocs(existingUsersQuery)
    if (!existingUsersSnapshot.empty) {
      return {
        success: false,
        message: 'Email already exists. Please use a different email.',
      }
    }

    const profilePicFile = get(formDataObject, 'profile_pic', null)
    if (
      !(profilePicFile instanceof File) ||
      !profilePicFile.type.startsWith('image/')
    ) {
      return NextResponse.json({
        success: false,
        message: 'Please upload valid Profile Picture',
      })
    }

    const seedCustomData = {
      ...(formDataObject as Partial<UserType<File>>),
      hobbies: formDataObject.hobbies || [],
      active_status:
        formDataObject.active_status !== undefined
          ? formDataObject.active_status
          : true,
      create_date: formDataObject.create_date || new Date(),
    } as UserType

    seedCustomData.fullName = `${seedCustomData.first_name} ${seedCustomData.last_name}`

    const generateName = generateUniqueFilename(
      profilePicFile.name,
      seedCustomData.first_name,
    )

    const fileRef = ref(fireStorage, `users/${generateName}`)

    try {
      const snapshot = await uploadBytes(fileRef, profilePicFile)
      const imageUrl = await getDownloadURL(snapshot.ref)
      seedCustomData.profile_pic = imageUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      return NextResponse.json({
        success: false,
        message: 'Error uploading Profile Picture',
      })
    }
    const userRef = await addDoc(collection(db, 'users'), seedCustomData)

    const newUserDoc = await getDoc(userRef)
    const newUser = { id: newUserDoc.id, ...newUserDoc.data() } as UserType
    if (!newUser) {
      throw new Error('Failed to register user')
    }
    return NextResponse.json({ success: true, data: newUser })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred during registration',
    })
  }
}
