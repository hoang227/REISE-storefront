import {Type, Edit3, Check} from 'lucide-react'
import {cn} from '~/lib/utils'
import {useState, useEffect} from 'react'

interface TextTabProps {
  currentPageTemplate: any
  selectedInput: string | null
  handleInputClick: (inputId: string) => void
  handleInputUpdate: (inputId: string, newText: string) => void
  getTextFromInput: (inputId: string) => string
}

export function TextTab({
  currentPageTemplate,
  selectedInput,
  handleInputClick,
  handleInputUpdate,
  getTextFromInput,
}: TextTabProps) {
  const [textInputs, setTextInputs] = useState<Record<string, string>>({})
  const [appliedTexts, setAppliedTexts] = useState<Record<string, boolean>>({})

  // Initialize text inputs when template changes
  useEffect(() => {
    if (currentPageTemplate?.textAreas) {
      const initialTexts: Record<string, string> = {}
      currentPageTemplate.textAreas.forEach((input: any) => {
        initialTexts[input.id] = getTextFromInput(input.id) || ''
      })
      setTextInputs(initialTexts)
      setAppliedTexts({})
    } else {
      // Clear text inputs when there are no text areas
      setTextInputs({})
      setAppliedTexts({})
    }
  }, [currentPageTemplate, getTextFromInput])

  const handleTextInputChange = (inputId: string, value: string) => {
    setTextInputs((prev) => ({
      ...prev,
      [inputId]: value,
    }))
    // Clear applied status when text changes
    setAppliedTexts((prev) => ({
      ...prev,
      [inputId]: false,
    }))
  }

  const handleApplyText = (inputId: string) => {
    const newText = textInputs[inputId] || ''
    handleInputUpdate(inputId, newText)

    // Show success feedback
    setAppliedTexts((prev) => ({
      ...prev,
      [inputId]: true,
    }))

    // Clear success feedback after 2 seconds
    setTimeout(() => {
      setAppliedTexts((prev) => ({
        ...prev,
        [inputId]: false,
      }))
    }, 2000)
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/10">
            <Type className="h-4 w-4 text-brand-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Text Editor</h3>
            <p className="text-xs text-gray-500">Customize your page text</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentPageTemplate?.textAreas &&
        currentPageTemplate.textAreas.length > 0 &&
        Object.keys(textInputs).length > 0 ? (
          <div className="space-y-3">
            {currentPageTemplate.textAreas.map((input: any) => (
              <div
                key={input.id}
                className={cn(
                  'group rounded-xl border bg-white p-4 transition-all duration-200',
                  selectedInput === input.id
                    ? 'border-brand-accent shadow-sm ring-1 ring-brand-accent/20'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                )}
              >
                {/* Text Area Header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Edit3 className="h-3 w-3 text-gray-400" />
                    <span className="text-xs font-medium capitalize text-gray-700">
                      {input.id
                        .replace(/-/g, ' ')
                        .replace(/^page(\d+)/, 'Page $1')}
                    </span>
                  </div>
                  {input.maxLength && (
                    <span className="text-xs text-gray-400">
                      {textInputs[input.id]?.length || 0}/{input.maxLength}
                    </span>
                  )}
                </div>

                {/* Text Input */}
                <div className="space-y-3">
                  <textarea
                    value={textInputs[input.id] || ''}
                    onChange={(e) =>
                      handleTextInputChange(input.id, e.target.value)
                    }
                    placeholder={input.defaultText || 'Enter your text here...'}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-accent/20"
                    rows={2}
                    maxLength={input.maxLength}
                  />

                  {/* Apply Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleApplyText(input.id)}
                      className={cn(
                        'flex items-center space-x-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                        appliedTexts[input.id]
                          ? 'bg-green-500 text-white shadow-sm'
                          : 'bg-brand-accent text-white hover:bg-brand-accent/90 hover:shadow-sm'
                      )}
                    >
                      {appliedTexts[input.id] ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <span>Apply</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Type className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-sm font-medium text-gray-900">
              No Text Areas
            </h3>
            <p className="max-w-xs text-xs text-gray-500">
              This page template doesn&apos;t have any editable text areas. Try
              selecting a different template.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
