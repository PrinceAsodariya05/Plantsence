import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchHistory, identifyPlant } from '../lib/api.js';

export function usePlantScan(sessionId) {
  const queryClient = useQueryClient();
  const historyQuery = useQuery({
    queryKey: ['plant-history', sessionId],
    queryFn: () => fetchHistory(sessionId),
    enabled: Boolean(sessionId)
  });
  const scanMutation = useMutation({
    mutationFn: ({ file, signal }) => identifyPlant(file, sessionId, signal),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plant-history', sessionId] })
  });
  return { historyQuery, scanMutation };
}
