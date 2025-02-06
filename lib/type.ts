export type EmailTemplate = {
  id: string
  name: string
  html: string,
  portfolio: string,
  resume: string,
  subject: string
}

export type Email = {
  id: string
  email: string
  sent: boolean
  created_at: string
  status: string
}


export type PaginationParams = {
  page?: number
  limit?: number
}



interface SuccessResponse {
  success: true;
  results: Email[]
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

interface ErrorResponse {
  success: false;
  error: string;
}

export type SendBulkResponse = SuccessResponse | ErrorResponse;
