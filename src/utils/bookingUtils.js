import { WEEKLY_SCHEDULE, BUSINESS_INFO } from "../data/businessConfig";

export function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function getAvailableSlots(
  dateStr,
  serviceDuration,
  existingAppointments = [],
  blockedSlots = [],
  stepMinutes = 30
) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay();

  const schedule = WEEKLY_SCHEDULE[dayOfWeek];
  if (!schedule) return [];

  const fullDayBlocked = blockedSlots.some((b) => !b.start_time && !b.end_time);
  if (fullDayBlocked) return [];

  const openMinutes = timeToMinutes(schedule.open);
  const closeMinutes = timeToMinutes(schedule.close);

  const activeIntervals = existingAppointments
    .filter((appt) => appt.status !== "cancelado")
    .map((appt) => ({
      start: timeToMinutes(appt.start_time.slice(0, 5)),
      end: timeToMinutes(appt.end_time.slice(0, 5)),
    }));

  blockedSlots.forEach((block) => {
    if (block.start_time && block.end_time) {
      activeIntervals.push({
        start: timeToMinutes(block.start_time.slice(0, 5)),
        end: timeToMinutes(block.end_time.slice(0, 5)),
      });
    }
  });

  const now = new Date();
  const isToday =
    now.getFullYear() === year &&
    now.getMonth() === month - 1 &&
    now.getDate() === day;
  const currentMinutesWithBuffer = now.getHours() * 60 + now.getMinutes() + 60;

  const availableSlots = [];

  for (
    let slotStart = openMinutes;
    slotStart + serviceDuration <= closeMinutes;
    slotStart += stepMinutes
  ) {
    if (isToday && slotStart < currentMinutesWithBuffer) {
      continue;
    }

    const slotEnd = slotStart + serviceDuration;

    const hasOverlap = activeIntervals.some(
      (busy) => slotStart < busy.end && slotEnd > busy.start
    );

    if (!hasOverlap) {
      availableSlots.push({
        start: minutesToTime(slotStart),
        end: minutesToTime(slotEnd),
      });
    }
  }

  return availableSlots;
}

export function buildWhatsAppConfirmationUrl({
  clientName,
  serviceName,
  extrasNames = [],
  dateStr,
  startTime,
  totalPrice,
}) {
  const [year, month, day] = dateStr.split("-");
  const formattedDate = `${day}/${month}/${year}`;
  const extrasText =
    extrasNames.length > 0 ? `\n• *Extras:* ${extrasNames.join(", ")}` : "";

  const message =
    `¡Hola Libre Nails! Acabo de reservar un turno desde la web:\n\n` +
    `• *Nombre:* ${clientName}\n` +
    `• *Servicio:* ${serviceName}${extrasText}\n` +
    `• *Fecha:* ${formattedDate}\n` +
    `• *Hora:* ${startTime} hs\n` +
    `• *Total estimado:* $${totalPrice.toLocaleString("es-AR")}\n\n` +
    `Te envío por acá el comprobante del anticipo de $${BUSINESS_INFO.depositAmount.toLocaleString("es-AR")} para confirmar mi lugar. ¡Gracias!`;

  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}