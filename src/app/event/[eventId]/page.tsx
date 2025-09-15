import Image from "next/image";
import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Minus,
  Plus,
  Share2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import heroImage from "@/assets/hero-event-image.jpg";
import { Metadata, Viewport } from "next";
import EventPageClient from "./EventPageClient";

interface TicketType {
  id: string;
  name: string;
  price: number;
  description?: string;
  requiresApproval?: boolean;
}

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  organizer: string;
  image: string;
  tickets: TicketType[];
  tags: string[];
}

// Static event data - in a real app, this would come from an API

// Static event data - in a real app, this would come from an API
const eventData: EventData = {
  id: "colmeia-27",
  title: "Colmeia",
  description: `Bem-vindo à Colmeia 🐝

Você não compra um ingresso. Você é aceito.

Uma experiência exclusiva onde a música eletrônica encontra a sofisticação. A Colmeia é mais que uma festa, é uma comunidade seletiva de amantes da música eletrônica de qualidade.

Nossa proposta é criar um ambiente intimista e elegante, onde cada participante faz parte de algo especial. Com sistema de aprovação para garantir a qualidade da experiência, oferecemos diferentes níveis de acesso para você viver a noite do seu jeito.

✨ Line-up cuidadosamente selecionado
🎵 Som de alta qualidade em ambiente acústico premium  
🥂 Bar premium com drinks autorais
🔒 Ambiente exclusivo e seguro
👥 Networking com pessoas que compartilham sua paixão pela música

Prepare-se para uma noite inesquecível.`,
  date: "Sábado, 25 de outubro de 2025",
  time: "23:00 - 07:00",
  venue: "Sala 528 (Anexo ao Greenvalley)",
  address:
    "Rua Antônio Lopes Gonçalves Bastos, Rio Pequeno, Camboriú - Santa Catarina",
  organizer: "Tikko Events",
  image: "https://i.ibb.co/SDCg6cRW/idea2.jpg",
  tickets: [
    {
      id: "frontstage-m",
      name: "Frontstage Masculino - Pré-venda",
      price: 70,
      requiresApproval: true,
    },
    {
      id: "frontstage-f",
      name: "Frontstage Feminino - Pré-venda",
      price: 40,
      requiresApproval: true,
    },
    {
      id: "backstage-m",
      name: "Backstage Masculino - Pré-venda",
      price: 210,
      requiresApproval: true,
    },
    {
      id: "backstage-f",
      name: "Backstage Feminino - Pré-venda",
      price: 160,
      requiresApproval: true,
    },
  ],
  tags: [
    "Música Eletrônica",
    "Festa Exclusiva",
    "Requer Aprovação",
    "Camboriú",
  ],
};

async function getEventData(eventId: string): Promise<EventData | null> {
  // In a real app, this would fetch from your API
  if (eventId === "colmeia-27") {
    return eventData;
  }
  return null;
}

export async function generateViewport(): Promise<Viewport> {
  return {
    width: 'device-width',
    initialScale: 1,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEventData(eventId);

  if (!event) {
    return {
      title: "Evento não encontrado - Tikko",
    };
  }

  const eventDate = new Date(`${event.date} ${event.time}`);
  const formattedDate = eventDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    title: `${event.title} - ${formattedDate} | Tikko`,
    description: event.description.slice(0, 160) + "...",
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160) + "...",
      type: "website",
      locale: "pt_BR",
      url: `https://tikko-frontend-next.vercel.app/event/${eventId}`,
      siteName: "Tikko",
      images: [
        {
          url: event.image || "/hero-event-image.jpg",
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description.slice(0, 160) + "...",
      images: [event.image || "/hero-event-image.jpg"],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEventData(eventId);

  if (!event) {
    return <div>Evento não encontrado</div>;
  }

  return <EventPageClient event={event} />;
}
