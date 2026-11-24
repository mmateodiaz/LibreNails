import { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, CheckCircle2, AlertCircle, MessageCircle, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import {
  SERVICES,
  EXTRAS,
  BOOKING_RULES,
  BUSINESS_INFO,
} from "../data/businessConfig";
import {
  getAvailableSlots,
  buildWhatsAppConfirmationUrl,
} from "../utils/bookingUtils";

export default function BookingSection() {
  const [selectedServiceId, setSelectedServiceId] = useState(SERVICES[0].id);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [dayAppointments, setDayAppointments] = useState([]);
  const [dayBlockedSlots, setDayBlockedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const selectedService = useMemo(
    () => SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0],
    [selectedServiceId]
  );

  const { totalDuration, totalPrice, chosenExtrasObjects } = useMemo(() => {
    const extrasObjs = EXTRAS.filter((e) => selectedExtras.includes(e.id));
    const extrasDuration = extrasObjs.reduce((acc, e) => acc + e.extraDuration, 0);
    const extrasPrice = extrasObjs.reduce((acc, e) => acc + e.price, 0);
    return {
      totalDuration: selectedService.duration + extrasDuration,
      totalPrice: selectedService.price + extrasPrice,
      chosenExtrasObjects: extrasObjs,
    };
  }, [selectedService, selectedExtras]);

  useEffect(() => {
    if (!selectedDate) return;
    setSelectedSlot(null);
    setErrorMsg("");

    async function fetchAvailability() {
      setLoadingSlots(true);
      try {
        const [{ data: appts, error: apptErr }, { data: blocks, error: blockErr }] =
          await Promise.all([
            supabase
              .from("appointments")
              .select("start_time, end_time, status")
              .eq("appointment_date", selectedDate)
              .neq("status", "cancelado"),
            supabase
              .from("blocked_slots")
              .select("start_time, end_time")
              .eq("blocked_date", selectedDate),
          ]);

        if (apptErr) throw apptErr;
        if (blockErr) throw blockErr;

        setDayAppointments(appts || []);
        setDayBlockedSlots(blocks || []);
      } catch (err) {
        console.error("Error cargando disponibilidad:", err);
        setErrorMsg("No pudimos cargar los horarios. Revisá tu conexión e intentá de nuevo.");
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchAvailability();
  }, [selectedDate]);

  const availableSlots = useMemo(() => {
    return getAvailableSlots(
      selectedDate,
      totalDuration,
      dayAppointments,
      dayBlockedSlots,
      30
    );
  }, [selectedDate, totalDuration, dayAppointments, dayBlockedSlots]);

  const toggleExtra = (extraId) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    );
    setSelectedSlot(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedSlot) {
      setErrorMsg("Por favor elegí un horario disponible.");
      return;
    }
    if (!clientName.trim() || !clientPhone.trim()) {
      setErrorMsg("Completá tu nombre completo y teléfono para agendar.");
      return;
    }

    setSubmitting(true);
    try {
      const extrasNames = chosenExtrasObjects.map((e) => e.name);

      const { error } = await supabase.from("appointments").insert([
        {
          client_name: clientName.trim(),
          client_phone: clientPhone.trim(),
          service_name: selectedService.name,
          extras: extrasNames,
          total_price: totalPrice,
          appointment_date: selectedDate,
          start_time: selectedSlot.start,
          end_time: selectedSlot.end,
          status: "pendiente_sena",
          notes: notes.trim() || null,
        },
      ]);

      if (error) throw error;

      const whatsappUrl = buildWhatsAppConfirmationUrl({
        clientName: clientName.trim(),
        serviceName: selectedService.name,
        extrasNames,
        dateStr: selectedDate,
        startTime: selectedSlot.start,
        totalPrice,
      });

      setBookingSuccess({
        whatsappUrl,
        serviceName: selectedService.name,
        date: selectedDate,
        time: selectedSlot.start,
        totalPrice,
      });

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Error al reservar:", err);
      setErrorMsg("Hubo un problema al guardar el turno. Por favor intentá nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  if (bookingSuccess) {
    return (
      <section id="turnos" className="py-20 px-4 bg-zinc-950 text-white">
        <div className="max-w-xl mx-auto border border-zinc-800 bg-zinc-900/70 rounded-2xl p-8 text-center space-y-6">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-2xl font-serif tracking-wide">
              ¡Tu lugar quedó pre-reservado!
            </h3>
            <p className="text-zinc-400 text-sm">
              Recordá enviar el comprobante del anticipo de{" "}
              <span className="text-white font-semibold">
                ${BUSINESS_INFO.depositAmount.toLocaleString("es-AR")}
              </span>{" "}
              por WhatsApp hasta 24 hs antes para confirmar definitivamente tu turno.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-left text-sm space-y-1.5">
            <p>
              <span className="text-zinc-400">Servicio:</span>{" "}
              <span className="font-medium">{bookingSuccess.serviceName}</span>
            </p>
            <p>
              <span className="text-zinc-400">Fecha y hora:</span>{" "}
              <span className="font-medium">
                {bookingSuccess.date.split("-").reverse().join("/")} a las{" "}
                {bookingSuccess.time} hs
              </span>
            </p>
            <p>
              <span className="text-zinc-400">Total estimado:</span>{" "}
              <span className="font-medium">
                ${bookingSuccess.totalPrice.toLocaleString("es-AR")}
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={bookingSuccess.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-6 py-3 rounded-xl transition"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar comprobante por WhatsApp
            </a>
            <button
              onClick={() => {
                setBookingSuccess(null);
                setSelectedSlot(null);
                setNotes("");
              }}
              className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 px-5 py-3 rounded-xl text-sm transition"
            >
              Sacar otro turno
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="turnos" className="py-20 px-4 bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
            Agenda Online
          </p>
          <h2 className="text-3xl md:text-4xl font-serif">Reservá tu turno</h2>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto">
            Elegí el servicio, seleccioná día y horario disponible, y confirmá
            tu cita enviando la seña por WhatsApp.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {BOOKING_RULES.map((rule) => (
            <div
              key={rule.title}
              className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 space-y-1"
            >
              <h3 className="text-xs uppercase tracking-wider font-semibold text-white">
                {rule.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{rule.text}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-12 gap-8 border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 md:p-8"
        >
          <div className="lg:col-span-6 space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-3">
                1. Elegí el servicio principal
              </label>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {SERVICES.map((service) => {
                  const active = service.id === selectedServiceId;
                  return (
                    <button
                      type="button"
                      key={service.id}
                      onClick={() => {
                        setSelectedServiceId(service.id);
                        setSelectedSlot(null);
                      }}
                      className={`text-left p-3.5 rounded-xl border transition ${
                        active
                          ? "border-white bg-white text-zinc-950"
                          : "border-zinc-800 bg-zinc-950/60 text-white hover:border-zinc-600"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-medium text-sm">{service.name}</span>
                        <span
                          className={`text-xs font-semibold ${
                            active ? "text-zinc-900" : "text-zinc-300"
                          }`}
                        >
                          ${service.price.toLocaleString("es-AR")}
                        </span>
                      </div>
                      <span
                        className={`block text-[11px] mt-1 ${
                          active ? "text-zinc-700" : "text-zinc-500"
                        }`}
                      >
                        Duración aprox: {service.duration} min
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-3">
                2. Adicionales / Remoción (opcional)
              </label>
              <div className="space-y-2">
                {EXTRAS.map((extra) => {
                  const checked = selectedExtras.includes(extra.id);
                  return (
                    <label
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        checked
                          ? "border-zinc-400 bg-zinc-800/80"
                          : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="accent-white w-4 h-4"
                        />
                        <span className="text-sm">{extra.name}</span>
                      </div>
                      <span className="text-xs text-zinc-300 font-medium">
                        +${extra.price.toLocaleString("es-AR")}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4 flex items-center justify-between text-sm">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Tiempo estimado: {totalDuration} min
              </span>
              <span className="text-lg font-semibold">
                Total: ${totalPrice.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                3. Seleccioná el día
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="date"
                  min={minDate}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                4. Horarios disponibles
              </label>
              {loadingSlots ? (
                <p className="text-sm text-zinc-400 py-4">Buscando horarios...</p>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 text-sm text-zinc-400">
                  No hay horarios disponibles para este día (domingos cerrado o agenda completa). Probá otra fecha.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot?.start === slot.start;
                    return (
                      <button
                        type="button"
                        key={slot.start}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1 transition ${
                          isSelected
                            ? "bg-white text-zinc-950 border-white font-semibold"
                            : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-500"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {slot.start}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <label className="block text-xs uppercase tracking-wider text-zinc-400">
                5. Tus datos
              </label>
              <input
                type="text"
                placeholder="Nombre y Apellido *"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                required
              />
              <input
                type="tel"
                placeholder="Teléfono / WhatsApp (ej. 351 1234567) *"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                required
              />
              <input
                type="text"
                placeholder="Nota opcional (ej. si querés algún diseño especial)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-900/60 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !selectedSlot}
              className="w-full bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              {submitting
                ? "Agendando..."
                : "Confirmar turno y enviar seña por WhatsApp"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}