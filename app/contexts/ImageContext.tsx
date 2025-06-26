import {createContext, useContext, useState, ReactNode, useEffect} from 'react'

export interface UploadedImage {
  id: string
  file?: File
  preview: string
  status: 'uploading' | 'complete' | 'error'
  progress?: number
  error?: string
}

interface ImageContextType {
  images: UploadedImage[]
  addImages: (files: FileList) => void
  removeImage: (id: string) => void
  clearImages: () => void
  updateImageStatus: (
    id: string,
    status: UploadedImage['status'],
    progress?: number,
    error?: string
  ) => void
  getImageById: (id: string) => UploadedImage | undefined
}

const ImageContext = createContext<ImageContextType | undefined>(undefined)

interface ImageProviderProps {
  children: ReactNode
}

// IndexedDB setup
const DB_NAME = 'PhotobookDB'
const DB_VERSION = 1
const STORE_NAME = 'images'

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {keyPath: 'id'})
      }
    }
  })
}

// Save images to IndexedDB
const saveImagesToDB = async (images: UploadedImage[]): Promise<void> => {
  const db = await initDB()
  const transaction = db.transaction([STORE_NAME], 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  // Clear existing data
  await new Promise<void>((resolve, reject) => {
    const clearRequest = store.clear()
    clearRequest.onsuccess = () => resolve()
    clearRequest.onerror = () => reject(clearRequest.error)
  })

  // Add new images
  for (const image of images) {
    await new Promise<void>((resolve, reject) => {
      const addRequest = store.add(image)
      addRequest.onsuccess = () => resolve()
      addRequest.onerror = () => reject(addRequest.error)
    })
  }
}

// Load images from IndexedDB
const loadImagesFromDB = async (): Promise<UploadedImage[]> => {
  const db = await initDB()
  const transaction = db.transaction([STORE_NAME], 'readonly')
  const store = transaction.objectStore(STORE_NAME)

  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Clear images from IndexedDB
const clearImagesFromDB = async (): Promise<void> => {
  const db = await initDB()
  const transaction = db.transaction([STORE_NAME], 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  return new Promise((resolve, reject) => {
    const request = store.clear()
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export function ImageProvider({children}: ImageProviderProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load images from IndexedDB on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        const savedImages = await loadImagesFromDB()
        setImages(savedImages)
      } catch (error) {
        console.error('Error loading images from IndexedDB:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  // Save images to IndexedDB whenever they change
  useEffect(() => {
    if (!isLoading) {
      // Don't save during initial load
      const saveImages = async () => {
        try {
          if (images.length > 0) {
            await saveImagesToDB(images)
          } else {
            await clearImagesFromDB()
          }
        } catch (error) {
          console.error('Error saving images to IndexedDB:', error)
        }
      }

      saveImages()
    }
  }, [images, isLoading])

  // Compress image to reduce file size
  const compressImage = (
    file: File,
    maxWidth: number = 1200,
    quality: number = 0.8
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        const newWidth = img.width * ratio
        const newHeight = img.height * ratio

        // Set canvas size
        canvas.width = newWidth
        canvas.height = newHeight

        // Draw and compress
        ctx.drawImage(img, 0, 0, newWidth, newHeight)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)

        resolve(compressedDataUrl)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const addImages = (files: FileList) => {
    Array.from(files).forEach((file) => {
      // Compress image before storing
      compressImage(file).then((compressedPreview) => {
        const newImage = {
          id: crypto.randomUUID(),
          file,
          preview: compressedPreview, // Use compressed base64
          status: 'complete' as const,
          progress: 100,
        }
        setImages((prev) => [...prev, newImage])
      })
    })
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove) {
        // No need to revoke URL for base64 data URLs
        // Only revoke if it's a blob URL
        if (
          imageToRemove.preview &&
          imageToRemove.preview.startsWith('blob:')
        ) {
          URL.revokeObjectURL(imageToRemove.preview)
        }
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const clearImages = () => {
    // Clean up object URLs to prevent memory leaks (only for blob URLs)
    images.forEach((image) => {
      if (image.preview && image.preview.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview)
      }
    })
    setImages([])
  }

  const updateImageStatus = (
    id: string,
    status: UploadedImage['status'],
    progress?: number,
    error?: string
  ) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? {...img, status, progress, error} : img
      )
    )
  }

  const getImageById = (id: string) => {
    return images.find((img) => img.id === id)
  }

  const value: ImageContextType = {
    images,
    addImages,
    removeImage,
    clearImages,
    updateImageStatus,
    getImageById,
  }

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
}

export function useImages() {
  const context = useContext(ImageContext)
  if (context === undefined) {
    throw new Error('useImages must be used within an ImageProvider')
  }
  return context
}
