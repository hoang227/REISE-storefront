import {Image, Type} from 'lucide-react'
import {UploadedImage} from '~/contexts/ImageContext'
import {ImagesTab} from './tabs/ImagesTab'
import {TextTab} from './tabs/TextTab'
import {TabNavigation} from './TabNavigation'

export type TabType = 'images' | 'text' | 'settings'

interface SidebarTabsProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  images: UploadedImage[]
  selectedImage: UploadedImage | null
  handleImageClick: (image: UploadedImage) => void
  handleImageFocus: (image: UploadedImage) => void
  handleFiles: (files: FileList | null) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  currentPageTemplate: any
  selectedInput: string | null
  handleInputClick: (inputId: string) => void
  handleInputUpdate: (inputId: string, newText: string) => void
  getTextFromInput: (inputId: string) => string
}

export function SidebarTabs({
  activeTab,
  setActiveTab,
  images,
  selectedImage,
  handleImageClick,
  handleImageFocus,
  handleFiles,
  fileInputRef,
  currentPageTemplate,
  selectedInput,
  handleInputClick,
  handleInputUpdate,
  getTextFromInput,
}: SidebarTabsProps) {
  const tabs = [
    {id: 'images' as TabType, label: 'Images', icon: Image},
    {id: 'text' as TabType, label: 'Text', icon: Type},
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'images':
        return (
          <ImagesTab
            images={images}
            selectedImage={selectedImage}
            handleImageClick={handleImageClick}
            handleImageFocus={handleImageFocus}
            handleFiles={handleFiles}
            fileInputRef={fileInputRef}
          />
        )
      case 'text':
        return (
          <TextTab
            currentPageTemplate={currentPageTemplate}
            selectedInput={selectedInput}
            handleInputClick={handleInputClick}
            handleInputUpdate={handleInputUpdate}
            getTextFromInput={getTextFromInput}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex w-[380px] border-r border-gray-200 bg-white">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="w-[300px] overflow-y-auto">{renderTabContent()}</div>
    </div>
  )
}
