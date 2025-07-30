import { useState, useEffect } from 'react'
import { IUmum } from '@/types/umum'

interface UseUmumResult {
  umum: IUmum[]
  loading: boolean
  error: string | null
  refresh: () => void
}

interface UseUmumByJenisResult {
  umum: IUmum | null
  loading: boolean
  error: string | null
  refresh: () => void
}

interface UseUmumMutationResult {
  loading: boolean
  error: string | null
  updateUmum: (data: IUmum[]) => Promise<boolean>
  updateUmumByJenis: (jenis: IUmum['jenis'], data: Partial<IUmum>) => Promise<boolean>
  deleteUmum: (jenis: IUmum['jenis']) => Promise<boolean>
}

// Hook untuk mengambil semua data umum
export function useUmum(): UseUmumResult {
  const [umum, setUmum] = useState<IUmum[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUmum = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/umum')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch umum')
      }

      if (result.success) {
        setUmum(result.data || [])
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching umum:', err)
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => {
    fetchUmum()
  }

  useEffect(() => {
    fetchUmum()
  }, [])

  return {
    umum,
    loading,
    error,
    refresh
  }
}

// Hook untuk mengambil umum berdasarkan jenis
export function useUmumByJenis(jenis: IUmum['jenis']): UseUmumByJenisResult {
  const [umum, setUmum] = useState<IUmum | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUmumByJenis = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/umum?jenis=${encodeURIComponent(jenis)}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Data umum tidak ditemukan')
      }

      if (result.success) {
        setUmum(result.data)
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching umum by jenis:', err)
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => {
    fetchUmumByJenis()
  }

  useEffect(() => {
    if (jenis) {
      fetchUmumByJenis()
    }
  }, [jenis])

  return {
    umum,
    loading,
    error,
    refresh
  }
}

// Hook untuk mutasi data umum (create, update, delete)
export function useUmumMutation(): UseUmumMutationResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateUmum = async (data: IUmum[]): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/umum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update umum')
      }

      return result.success
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating umum:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateUmumByJenis = async (jenis: IUmum['jenis'], data: Partial<IUmum>): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/umum?jenis=${encodeURIComponent(jenis)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update umum')
      }

      return result.success
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating umum by jenis:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteUmum = async (jenis: IUmum['jenis']): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/umum?jenis=${encodeURIComponent(jenis)}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete umum')
      }

      return result.success
    } catch (err: any) {
      setError(err.message)
      console.error('Error deleting umum:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    updateUmum,
    updateUmumByJenis,
    deleteUmum
  }
}

// Hook untuk mengambil umum spesifik
export function useInfografi() {
  return useUmumByJenis('infografi')
}

export function usePenduduk() {
  return useUmumByJenis('penduduk')
}

export function useSaranaPendidikan() {
  return useUmumByJenis('saranaPendidikan')
}

export function useSaranaKesehatan() {
  return useUmumByJenis('saranaKesehatan')
}
