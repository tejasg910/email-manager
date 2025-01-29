import { useState, useEffect } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Toast from '@radix-ui/react-toast'
import { CheckIcon, Loader2 } from "lucide-react"


import { Progress } from "@/components/ui/progress";
import { useDeleteEmail, useGetPendingEmails, useSendBulkEmail, useSendEmail } from '../api/usePendingMails'
import { useToast } from '@/hooks/use-react-toast';
interface Email {
  id: string
  email: string
  sent: boolean
}

export default function PendingEmails() {

  const { emails, isLoading: loadingemails, error: getemailsError, mutate } = useGetPendingEmails()

  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState<Record<string, boolean>>({})
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: '', description: '', type: 'success' })
  const [percentage, setPercentage] = useState(0);
  const [sendingEmails, setSendingEmails] = useState(false)
  const sendEmail = useSendEmail();
  const sendBulkEmails = useSendBulkEmail();

  const deleteEmail = useDeleteEmail()

  const { error, success } = useToast()


  const [showPercent, setShowPercent] = useState(false)


  const showToast = (title: string, description: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ title, description, type })
    setToastOpen(true)
  }



  const validateSendRequirements = () => {
    const templateId = localStorage.getItem('selectedTemplateId')
    // const resumeUrl = localStorage.getItem('driveLink')
    // const githubUrl = localStorage.getItem('githubUrl')

    if (!templateId) {
      error('Template Required')
      return false
    }


    return { templateId }
  }

  const handleSelectAll = () => {
    setSelectedEmails(
      selectedEmails.length === emails.length
        ? []
        : emails.map(email => email.id)
    )
  }

  const handleSelect = (id: string) => {
    setSelectedEmails(prev =>
      prev.includes(id) ? prev.filter(emailId => emailId !== id) : [...prev, id]
    )
  }
  const updateProgress = (percent: any) => {
    setPercentage(percent)
  }
  const handleSendIndividual = async (id: string) => {
    const requirements = validateSendRequirements()
    if (!requirements) return


    console.log(requirements, "this is requirements ")
    setIsSending(prev => ({ ...prev, [id]: true }))
    try {

      await sendEmail({
        emailId: id,
        templateId: requirements.templateId,
      
      })



      success('Email sent successfully')
    } catch (err) {
      error('Failed to send email', 'error')
    } finally {
      setIsSending(prev => ({ ...prev, [id]: false }))
    }
  }

  const handleSendAll = async () => {

    const requirements = validateSendRequirements()
    if (!requirements) return

    setIsLoading(true)
    try {
      // Use the bulk send endpoint

      console.log("came in api request")
      const data = await sendBulkEmails({
        emailId: selectedEmails,
        templateId: requirements.templateId,
      
      });

      if (data?.success) {
        setShowPercent(true)

        console.log(data, "this is data")


        const interval = setInterval(async () => {

          const res = await fetch(`/api/campain/${data?.campaignId}`);
          console.log(res.status, "this is tstauts")


          if (res.status === 200) {


            const status = await res.json();


            // Update your UI with status.stats
            updateProgress(status.stats.percentage);

            if (status.isComplete) {
              success(

                `Emails sent successfully`
              );
              mutate()
              clearInterval(interval);
              // showComplete();
              setShowPercent(false)
            }
          } else {
            clearInterval(interval);
            setShowPercent(false);

            error("Failed to send emails")
          }
        }, 2000);


        // Update UI based on results


        setSelectedEmails([])

      } else {
        error(data?.error)
      }

    } catch (err) {
      error(

        error instanceof Error ? error?.message : 'Failed to send emails',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await deleteEmail(id)

      success('Email removed successfully')
    } catch (err) {
      error('Failed to remove email')
    }
  }
  console.log(emails, "this is pending emails")




  if (showPercent) {
    return <EmailProgressBar percentage={percentage} />
  }


  if (emails?.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">

        No pending emails found
      </div>
    )
  }


  if (loadingemails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }


  return (
    <div className="space-y-4 p-4">
      <Toast.Provider swipeDirection="right">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Pending Emails</h2>
          <div className="space-x-4">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              {selectedEmails.length === emails.length ? 'Unmark All' : 'Mark All'}
            </button>
            <button
              onClick={handleSendAll}
              disabled={selectedEmails.length === 0 || isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className='flex'>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  <span>  Sending...</span>
                </div>
              ) : (
                'Send Selected'
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {emails.map(email => (
            <div
              key={email.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <Checkbox.Root
                  className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                  checked={selectedEmails.includes(email.id)}
                  onCheckedChange={() => handleSelect(email.id)}
                  disabled={isSending[email.id]}
                >
                  <Checkbox.Indicator>
                    <CheckIcon className="h-4 w-4 text-indigo-600" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="font-medium">{email.email}</span>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => handleSendIndividual(email.id)}
                  disabled={isSending[email.id]}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSending[email.id] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                      Sending...
                    </>
                  ) : (
                    'Send'
                  )}
                </button>
                <button
                  onClick={() => handleRemove(email.id)}
                  disabled={isSending[email.id]}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`fixed bottom-4 right-4 z-50 rounded-md shadow-lg p-4 ${toastMessage.type === 'error' ? 'bg-red-100' : 'bg-green-100'
            }`}
        >
          <Toast.Title className="font-medium mb-1">
            {toastMessage.title}
          </Toast.Title>
          <Toast.Description>
            {toastMessage.description}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 p-4 z-50" />
      </Toast.Provider>
    </div>
  )
}



const EmailProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Sending Emails</span>
          <span className="text-sm font-medium text-gray-900">{Math.round(percentage)}%</span>
        </div>
        <Progress value={percentage} className="w-full" />
        <p className="text-xs text-gray-500 text-center">
          {percentage < 100 ? 'Processing emails...' : 'Complete!'}
        </p>
      </div>
    </div>
  );
};

