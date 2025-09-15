"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEvent } from "@/lib/api";
import { formatTicketTitle } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
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

interface EventPageClientProps {
  eventId: string;
}

export default function EventPageClient({ eventId }: EventPageClientProps) {
  const [selectedTicket, setSelectedTicket] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEvent(eventId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Evento não encontrado
      </div>
    );
  }

  const { event, ticket_pricing } = data;

  // Transform backend data to match existing interface
  const transformedEvent = {
    id: event.id.toString(),
    title: event.name,
    description: event.description,
    date: new Date(event.start_date).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: new Date(event.start_date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    venue: event.address_name || "",
    address: event.address_complement || "",
    organizer: "Tikko Events",
    image: event.image || "",
    tickets: ticket_pricing
      .filter((tp) => tp.active)
      .map((tp) => ({
        id: tp.id.toString(),
        name: formatTicketTitle(tp),
        price: tp.price,
        requiresApproval: !event.auto_accept,
      })),
    tags: [],
  };

  const selectedTicketData = transformedEvent.tickets.find(
    (t) => t.id === selectedTicket
  );
  const totalPrice = selectedTicketData
    ? selectedTicketData.price * quantity
    : 0;

  const adjustQuantity = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${transformedEvent.title} - Tikko`,
      text: `${transformedEvent.title} - ${transformedEvent.date} em ${transformedEvent.venue}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copiado para a área de transferência!");
      } catch (err) {
        console.log("Error copying to clipboard:", err);
        alert(`Compartilhe este link: ${window.location.href}`);
      }
    }
  };

  const openGoogleMaps = () => {
    const address = encodeURIComponent(
      `${transformedEvent.venue}, ${transformedEvent.address}`
    );
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* App Bar with Back Button and Share */}
      <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos eventos
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="text-muted-foreground hover:text-foreground"
            title="Compartilhar evento"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={
              transformedEvent.image.startsWith("/")
                ? heroImage
                : transformedEvent.image
            }
            className="w-full h-full object-cover"
            alt={transformedEvent.title}
            width={500}
            height={300}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-background"></div>
        </div>
      </section>
      <div className="relative z-10 h-full flex items-end">
        <div className="container mx-auto px-4 pb-8 md:pb-12">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-2 md:mb-4">
              {transformedEvent.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-lg">
                  {transformedEvent.date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-lg">
                  {transformedEvent.time}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Location Section */}
        <Card className="bg-tikko-card-light text-gray-900 shadow-lg mb-6 md:mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <MapPin className="w-5 h-5 text-tikko-orange mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lg text-gray-900">
                    {transformedEvent.venue}
                  </p>
                  <p className="text-gray-600">{transformedEvent.address}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Organizado por {transformedEvent.organizer}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={openGoogleMaps}
                className="text-tikko-orange hover:text-tikko-orange hover:bg-tikko-orange/10 flex-shrink-0"
                title="Ver no Google Maps"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Ticket Selection Section */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <Card className="bg-card shadow-lg lg:sticky lg:top-24">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">
                  Obter ingressos
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Por favor, escolha o tipo de ingresso desejado:
                </p>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
                <RadioGroup
                  value={selectedTicket}
                  onValueChange={setSelectedTicket}
                  className="space-y-3"
                >
                  {transformedEvent.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`border rounded-lg p-3 md:p-4 transition-all duration-200 ${
                        selectedTicket === ticket.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <RadioGroupItem
                            value={ticket.id}
                            id={ticket.id}
                            className="mt-1"
                          />
                          <Label
                            htmlFor={ticket.id}
                            className="flex-1 cursor-pointer"
                          >
                            <div>
                              <p className="font-medium text-sm md:text-base">
                                {ticket.name}
                              </p>
                              {ticket.requiresApproval && (
                                <p className="text-xs md:text-sm text-muted-foreground">
                                  Requer aprovação
                                </p>
                              )}
                            </div>
                          </Label>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-base md:text-lg">
                            R${" "}
                            {ticket.price.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                {selectedTicket && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm md:text-base">
                        Quantidade:
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => adjustQuantity(-1)}
                          disabled={quantity <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => adjustQuantity(1)}
                          disabled={quantity >= 10}
                          className="h-8 w-8"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-base md:text-lg font-bold">
                      <span>Total:</span>
                      <span>R$ {totalPrice.toFixed(2)}</span>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => {
                        alert(
                          `Redirecionando para pagamento: ${
                            selectedTicketData?.name
                          } (${quantity}x) - Total: R$ ${totalPrice.toFixed(2)}`
                        );
                      }}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Continuar para pagamento
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Event Description Section */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="bg-tikko-card-light text-gray-900 shadow-lg">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-xl md:text-2xl text-gray-900">
                  {transformedEvent.title}
                </CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-gray-600">
                    Organizado por {transformedEvent.organizer}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {transformedEvent.date} às {transformedEvent.time}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {transformedEvent.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-tikko-orange/10 text-tikko-orange border-tikko-orange/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="prose prose-gray max-w-none">
                  {transformedEvent.description
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-gray-700 mb-4 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-lg font-bold text-primary">
                Tikko
              </Link>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Voltar aos eventos
              </Link>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 Tikko. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
