import { SendBulkResponse } from "@/lib/type"

const API_BASE_URL = '/api'

export async function fetchUnsendEmails() {
  const response = await fetch(`${API_BASE_URL}/get-unsent`)
  return response.json()
}




export async function sendEmail(data: {
  emailId: string,
  templateId: string,
  resumeUrl: string,
  githubUrl: string | null
}) {
  const response: Response = await fetch(`${API_BASE_URL}/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data })
  })
  if (response.ok) {
    return response.json()
  }
  else {
    throw new Error('Failed to send email')

  }
}

export async function sendBulkEmails(ids: {
  emailId: string[],
  templateId: string,
  resumeUrl: string,
  githubUrl: string | null
}) {
  const response = await fetch(`${API_BASE_URL}/send-bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...ids })
  })



  if (response.ok) {
    return response.json()
  }
  else {
    throw new Error('Failed to send emails')

  }
}

export async function removeEmail(id: string) {
  const response = await fetch(`${API_BASE_URL}/remove-email`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
  return response.json()
}

export async function fetchSentEmails(page: number) {
  const response = await fetch(`${API_BASE_URL}/get-sent?page=${page}`)
  return response.json()
}

export async function addEmails(emails: string[]) {
  const response = await fetch(`${API_BASE_URL}/add-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails })
  })
  return response.json()
}

export async function fetchEmailTemplates() {
  const response = await fetch(`${API_BASE_URL}/get-template`)
  return response.json()
}

