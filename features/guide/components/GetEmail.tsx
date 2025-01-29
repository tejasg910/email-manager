"use client"
import { Chrome, ClipboardCopy, Linkedin, ScrollText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-react-toast'

export default function EmailExtractionGuide() {

    const { error, success } = useToast()
    const searchQuery = '"Your Target Role" AND "@"'

    const handleCopyQuery = async () => {
        try {
            await navigator.clipboard.writeText(searchQuery)
            success("Search query copied to clipboard!")
        } catch (err) {
            error("Failed to copy query")
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 mt-16">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <Chrome className="w-8 h-8 text-blue-600" />
                    Email Extraction Guide
                </h1>
                <p className="text-gray-600">Step-by-step instructions to find relevant emails</p>
            </div>

            <div className="space-y-6">
                {/* Step 1 */}
                <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">1</span>
                        <h3>Install Chrome Extension</h3>
                    </div>
                    <div className="mt-2 space-y-2">
                        <p className="text-gray-600">
                            Install the official Email Extractor extension from Chrome Web Store:
                        </p>
                        <Button asChild variant="link" className="text-blue-600 pl-0">
                            <a
                                href="https://chromewebstore.google.com/detail/email-extractor/jdianbbpnakhcmfkcckaboohfgnngfcc"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Chrome className="w-4 h-4 mr-2" />
                                Email Extractor Extension
                            </a>
                        </Button>
                        <div className="bg-gray-50 p-4 rounded-md mt-2">
                            <p className="text-sm text-gray-500">
                                After installation, pin the extension to your Chrome toolbar
                                <span className="ml-2">📌</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
                        <h3>LinkedIn Search Setup</h3>
                    </div>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                            <Linkedin className="w-5 h-5 text-blue-700" />
                            <p className="text-gray-600">
                                Use this search query on LinkedIn:
                            </p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-md flex items-center justify-between">
                            <code className="text-sm">{searchQuery}</code>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyQuery}
                                className="hover:bg-gray-200"
                            >
                                <ClipboardCopy className="w-4 h-4 " />
                                Copy
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm font-medium mb-2">🕒 Filter by Date</p>
                                <p className="text-gray-600 text-sm">
                                    Set time filter to "Past week" or "24 hours" for recent profiles
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm font-medium mb-2">🔍 Search Tips</p>
                                <p className="text-gray-600 text-sm">
                                    Scroll through results to load more profiles before extracting
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">3</span>
                        <h3>Extract & Copy Emails</h3>
                    </div>
                    <div className="mt-2 space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-600">
                                1. Click the Email Extractor extension icon
                                <br />
                                2. Wait for email scanning to complete
                                <br />
                                3. Click "Copy All Emails" button
                            </p>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                            <div className="bg-gray-100 p-2 flex items-center gap-2">
                                <ScrollText className="w-4 h-4" />
                                <span className="text-sm font-medium">Example Output</span>
                            </div>
                            <div className="p-4 text-sm font-mono">
                                john.doe@gmail.com
                                <br />
                                jane.smith@protonmail.com
                                <br />
                                ...
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Note */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-8">
                    <p className="text-sm text-yellow-700">
                        ⚠️ Always verify email sources and comply with privacy regulations
                    </p>
                </div>
            </div>
        </div>
    )
}