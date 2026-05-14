import { useState, useEffect } from 'react'
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import type { Database, Destination } from '@/types/database'

export function useDestinations() {
  const supabase = useSupabaseClient<Database>()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDestinations(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch destinations')
    } finally {
      setLoading(false)
    }
  }

  return { destinations, loading, error, refetch: fetchDestinations }
}

export function useDestination(id: string) {
  const supabase = useSupabaseClient<Database>()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDestination()
  }, [id])

  const fetchDestination = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setDestination(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch destination')
    } finally {
      setLoading(false)
    }
  }

  return { destination, loading, error }
}

export function useSavedDestinations() {
  const supabase = useSupabaseClient<Database>()
  const session = useSession()
  const [savedDestinations, setSavedDestinations] = useState<Destination[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchSavedDestinations()
    } else {
      setSavedDestinations([])
      setSavedIds(new Set())
      setLoading(false)
    }
  }, [session])

  const fetchSavedDestinations = async () => {
    if (!session?.user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_saves')
        .select('destination_id, destinations(*)')
        .eq('user_id', session.user.id) as { data: any[] | null, error: any };

      if (error) throw error

      const destinations = (data?.map((save: any) => save.destinations) || [])
        .filter((dest): dest is Destination => dest !== null);

      setSavedDestinations(destinations)
      setSavedIds(new Set(destinations.map((d) => d.id)))
    } catch (err) {
      console.error('Error fetching saved destinations:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSave = async (destinationId: string) => {
    if (!session?.user) {
      alert('Please sign in to save destinations')
      return
    }

    const isSaved = savedIds.has(destinationId)

    try {
      if (isSaved) {
        // Remove save
        const { error } = await supabase
          .from('user_saves')
          .delete()
          .eq('user_id', session.user.id)
          .eq('destination_id', destinationId)

        if (error) throw error

        setSavedIds((prev) => {
          const next = new Set(prev)
          next.delete(destinationId)
          return next
        })
      } else {
        const { error } = await supabase
          .from('user_saves')
          .insert({
            destination_id: destinationId,
            user_id: session.user.id
          } as any)

        if (error) throw error

        setSavedIds((prev) => new Set(prev).add(destinationId))
      }

      // Refetch to update the list
      await fetchSavedDestinations()
    } catch (err) {
      console.error('Error toggling save:', err)
      alert('Failed to update save status')
    }
  }

  const isSaved = (destinationId: string) => savedIds.has(destinationId)

  return {
    savedDestinations,
    loading,
    toggleSave,
    isSaved,
    refetch: fetchSavedDestinations,
  }
}
