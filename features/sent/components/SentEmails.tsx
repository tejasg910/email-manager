import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Dashboard from '@/features/dashboard/components/Dashboard'
import { useGetSentEmails } from '../api/useSendEmail'

interface Email {
  id: string
  email: string
  sent: boolean
  created_at: string
}

interface PaginationResponse {
  success: boolean
  data: Email[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function SentEmails() {
  // const { emails, isLoading: loadingemails, error: getemailsError } = useGetSentEmails()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([])
  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/get-sent?page=${currentPage}&limit=10`)
        if (!response.ok) throw new Error('Failed to fetch emails')

        const data: PaginationResponse = await response.json()

        setTotalPages(data.pagination.totalPages);
        setEmails(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load emails')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmails()
  }, [currentPage])

  if (error) {
    return (
      <div className="text-center py-4 text-indigo-600">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-6 text-indigo-800">Sent Emails</h2>

      <Dashboard />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {emails.length === 0 ? (
              <p className="text-center text-indigo-600 py-8">No sent emails found</p>
            ) : (
              emails.map(email => (
                <Card key={email.id} className="hover:border-indigo-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-indigo-900">{email.email}</p>
                        <p className="text-sm text-indigo-600">
                          Sent at: {new Date(email.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              variant="outline"
              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            >
              Previous
            </Button>

            <span className="text-sm text-indigo-600">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || isLoading}
              variant="outline"
              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}