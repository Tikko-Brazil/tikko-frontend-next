export interface Event {
  id: number;
  name: string;
  description: string;
  is_paid: boolean;
  start_date: string;
  end_date?: string;
  address_name?: string;
  longitude?: number;
  latitude?: number;
  address_complement?: string;
  is_private: boolean;
  auto_accept: boolean;
  company_id?: number;
  ticket_pricing_id?: number;
  is_active: boolean;
  image?: string;
}

export type Gender = 'male' | 'female' | 'unisex';

export interface TicketPricing {
  id: number;
  event_id: number;
  ticket_type: string;
  gender: Gender;
  lot: number;
  price: number;
  sold_count: number;
  start_date: string;
  end_date: string;
  active: boolean;
  male_capacity: number;
  female_capacity: number;
  door: boolean;
}

export interface EventResponse {
  event: Event;
  ticket_pricing: TicketPricing[];
}
