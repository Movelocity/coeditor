import { FileItem } from '@/lib/types'
import { FiLogOut, FiUser } from 'react-icons/fi'

interface BannerProps {
  selectedFile: FileItem | null
}

const Banner = ({ selectedFile }: BannerProps) => {
  return (
    <div className="h-16 border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center">
        {selectedFile ? (
          <h1 className="text-xl font-semibold text-gray-100">
            {selectedFile.name}
          </h1>
        ) : (
          <h1 className="text-xl font-semibold text-gray-400">
            Select a file to edit
          </h1>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="flex items-center text-gray-300 hover:text-white">
          <FiUser className="mr-2" />
          <span>Profile</span>
        </button>
        <button className="flex items-center text-gray-300 hover:text-white">
          <FiLogOut className="mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Banner 