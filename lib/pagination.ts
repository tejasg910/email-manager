export const calculateRange = (page: number = 1, limit: number = 10) => {
    const start = (page - 1) * limit
    const end = start + limit - 1
    return { start, end }
  }
  