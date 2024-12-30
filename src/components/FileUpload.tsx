import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the interface for the FileUpload component props
interface FileUploadProps {
  onUpload: (url: string) => void
}

// Define constants for maximum file size and allowed file types
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']

// Component for handling file uploads with drag and drop functionality
export default function FileUpload({ onUpload }: FileUploadProps) {
  // State to track if a file is being uploaded
  const [uploading, setUploading] = useState(false)
  
  // State to store the preview URL of the uploaded file
  const [preview, setPreview] = useState<string | null>(null)

  // State to store any error messages
  const [error, setError] = useState<string | null>(null)

  // Function to validate the uploaded file
  // Checks if the file type is supported and if the file size is within the allowed limit
  async function validateFile(file: File) {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('File type not supported. Please upload a JPEG, PNG, or GIF image.')
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size too large. Maximum size is 5MB.')
    }
  }

  // Function to handle file upload
  // Uploads the file to the server and updates the preview URL
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      // Set uploading state to true
      setUploading(true)
      
      // Reset any previous error messages
      setError(null)

      // Check if a file has been selected
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Please select an image to upload.')
      }

      // Get the selected file
      const file = event.target.files[0]

      // Validate the file
      await validateFile(file)

      // Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`

      // Try to upload the file directly
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      // Check if there was an error during upload
      if (uploadError) throw uploadError

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      // Check if the public URL was retrieved successfully
      if (!publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL')
      }

      // Append a query parameter to avoid caching
      const finalUrl = `${publicUrlData.publicUrl}?_=${Date.now()}`

      // Update the preview URL and call the onUpload callback
      setPreview(finalUrl)
      onUpload(finalUrl)

    } catch (error) {
      // Log any errors and update the error message state
      console.error('Error uploading image:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      // Set uploading state to false
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="file"
          id="image"
          accept={ALLOWED_FILE_TYPES.join(',')}
          onChange={handleUpload}
          disabled={uploading}
          className={`hidden ${error ? 'border-red-500' : ''}`}
        />
        <Label
          htmlFor="image"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              JPEG, PNG, GIF (MAX. 5MB)
            </p>
          </div>
        </Label>
      </div>
      
      {uploading && (
        <div className="flex items-center justify-center space-x-2 animate-pulse">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
          <div className="w-8 h-8 bg-primary rounded-full"></div>
          <div className="w-8 h-8 bg-primary rounded-full"></div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {preview && (
        <div className="mt-4 flex justify-center">
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-full border-4 border-primary" />
        </div>
      )}
    </div>
  )
}
