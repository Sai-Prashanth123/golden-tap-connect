import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsService, SearchEventsParams } from '@/services/events.service';
import { toast } from 'sonner';

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params: SearchEventsParams) => [...eventKeys.lists(), params] as const,
  detail: (id: string) => [...eventKeys.all, 'detail', id] as const,
  myRegistrations: () => [...eventKeys.all, 'my-registrations'] as const,
};

export function useEvents(params: SearchEventsParams = {}) {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventsService.listEvents(params),
    select: (res) => res.data,
    staleTime: 30_000,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsService.getEvent(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useMyRegistrations(page = 1, limit = 20) {
  return useQuery({
    queryKey: eventKeys.myRegistrations(),
    queryFn: () => eventsService.getMyRegistrations(page, limit),
    select: (res) => res.data,
  });
}

export function useRegisterForEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => eventsService.registerForEvent(eventId),
    onSuccess: (_, eventId) => {
      qc.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      qc.invalidateQueries({ queryKey: eventKeys.myRegistrations() });
      toast.success('Successfully registered!');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCancelRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => eventsService.cancelRegistration(eventId),
    onSuccess: (_, eventId) => {
      qc.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      qc.invalidateQueries({ queryKey: eventKeys.myRegistrations() });
      toast.success('Registration cancelled');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
