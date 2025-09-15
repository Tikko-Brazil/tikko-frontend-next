import { Metadata, Viewport } from "next";
import EventPageClient from "./EventPageClient";
import { fetchEvent } from "@/lib/api";

export async function generateViewport(): Promise<Viewport> {
  return {
    width: "device-width",
    initialScale: 1,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;

  try {
    const data = await fetchEvent(eventId);
    const event = data.event;

    return {
      title: `${event.name} | Tikko`,
      description: event.description.slice(0, 160) + "...",
      openGraph: {
        title: event.name,
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
            alt: event.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: event.name,
        description: event.description.slice(0, 160) + "...",
        images: [event.image || "/hero-event-image.jpg"],
      },
    };
  } catch {
    return {
      title: "Evento não encontrado - Tikko",
    };
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return <EventPageClient eventId={eventId} />;
}
