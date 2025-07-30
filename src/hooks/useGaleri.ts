import { useState, useEffect } from 'react'
import { IGaleri } from '@/types/galeri'

interface UseGaleriResult {
  galeri: IGaleri[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
}

interface UseGaleriOptions {
  pageSize?: number
  initialLoad?: boolean
}

export function useGaleri(options: UseGaleriOptions = {}): UseGaleriResult {
  const { pageSize = 12, initialLoad = true } = options
  
  const [galeri, setGaleri] = useState<IGaleri[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)

  const fetchGaleri = async (reset = false) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        pageSize: pageSize.toString(),
      })

      if (!reset && cursor) {
        params.append('cursor', cursor)
      }

      const response = await fetch(`/api/galeri?${params.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch galeri')
      }

      if (result.success) {
        const newGaleri = result.data.data || []
        
        if (reset) {
          setGaleri(newGaleri)
        } else {
          setGaleri(prev => [...prev, ...newGaleri])
        }

        setHasMore(result.data.hasMore || false)
        setCursor(result.data.lastDoc ? JSON.stringify(result.data.lastDoc) : null)
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching galeri:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchGaleri(false)
    }
  }

  const refresh = () => {
    setCursor(null)
    fetchGaleri(true)
  }

  useEffect(() => {
    if (initialLoad) {
      fetchGaleri(true)
    }
  }, [])

  return {
    galeri,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  }
}

// Hook untuk single galeri by id
export function useGaleriById(id: string) {
  const [galeri, setGaleri] = useState<IGaleri | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchGaleri = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/galeri?id=${encodeURIComponent(id)}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Galeri tidak ditemukan')
        }

        if (result.success) {
          setGaleri(result.data)
        }
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching galeri by id:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGaleri()
  }, [id])

  return { galeri, loading, error }
}

// Hook untuk galeri terbaru (untuk homepage)
export function useLatestGaleri(limit = 6) {
  const [galeri, setGaleri] = useState<IGaleri[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestGaleri = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/galeri?pageSize=${limit}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch latest galeri')
        }

        if (result.success) {
          setGaleri(result.data.data || [])
        }
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching latest galeri:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestGaleri()
  }, [limit])

  return { galeri, loading, error }
} 