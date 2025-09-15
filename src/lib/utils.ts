import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TicketPricing, Gender } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTicketTitle(ticketPricing: TicketPricing): string {
  const genderMap = {
    male: 'Masculino',
    female: 'Feminino',
    unisex: 'Unissex'
  };
  
  const lotSuffix = ticketPricing.lot === 0 ? ' - Pré-venda' : ` - ${ticketPricing.lot}º Lote`;
  
  return `${ticketPricing.ticket_type} ${genderMap[ticketPricing.gender]}${lotSuffix}`;
}
