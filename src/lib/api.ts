import { EventResponse } from './types';

export async function fetchEvent(eventId: string): Promise<EventResponse> {
  // Extract numeric ID from slug (e.g., "colmeia-27" -> "27")
  const numericId = eventId.split('-').pop();
  
  const response = await fetch(`/api/event/${numericId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }
  
  return response.json();
}
