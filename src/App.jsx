import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  CreditCard,
  Check,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  BUSINESS_INFO,
  SERVICES,
  EXTRAS,
  NAIL_CARE_TIPS,
} from "./data/businessConfig";
import BookingSection from "./components/BookingSection";
import AdminDashboard from "./pages/AdminDashboard";

const PORTFOLIO_ITEMS = [
  {
    title: "Soft Gel & Nail Art Minimal",
    category: "Soft Gel",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Kapping Gel & French Clásico",
    category: "Capping",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Esculpidas Almendra",
    category: "Esculpidas",
    image:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Semipermanente Gloss",
    category: "Semipermanente",
    image:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80",
  },
];

const HOURS_DISPLAY = [
  { day: "Lunes", hours: "9:00 – 20:00" },
  { day: "Martes", hours: "10:00 – 20:00" },
  { day: "Miércoles", hours: "9:00 – 20:00" },
  { day: "Jueves", hours: "12:00 – 20:30" },
  { day: "Viernes", hours: "9:00 – 20:30" },
  { day: "Sábado", hours: "9:30 – 19:00" },
  { day: "Domingo", hours: "Cerrado" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-white selection:text-zinc-950">
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#" className="font-serif text-xl tracking-widest uppercase">
            {BUSINESS_INFO.name}
          </a>

          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-zinc-400">
            <a href="#trabajos" className="hover:text-white transition">
              Trabajos
            </a>
            <a href="#servicios" className="hover:text-white transition">
              Servicios & Precios
            </a>
            <a href="#cuidados" className="hover:text-white transition">
              Cuidados
            </a>
            <a href="#ubicacion" className="hover:text-white transition">
              Ubicación
            </a>
          </nav>

          <a
            href="#turnos"
            className="bg-white text-zinc-950 hover:bg-zinc-200 text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-full transition"
          >
            Sacar Turno
          </a>
        </div>
      </header>

      <section className="relative py-24 md:py-32 px-4 border-b border-zinc-900 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            Estudio de Manicuría • Córdoba
          </p>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-tight text-white">
            Arte, detalle y cuidado para tus uñas.
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Semipermanente, Capping, Soft Gel y Esculpidas personalizadas.
            Reservá tu turno online en segundos y asegurá tu lugar.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#turnos"
              className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold px-8 py-3.5 rounded-full text-sm transition"
            >
              Reservar mi turno
            </a>
            <a
              href={BUSINESS_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-zinc-800 hover:border-zinc-600 text-zinc-300 px-6 py-3.5 rounded-full text-sm transition"
            >
              <ArrowUpRight className="w-4 h-4" />
              {BUSINESS_INFO.instagram}
            </a>
          </div>
        </div>
      </section>

      <section id="trabajos" className="py-20 px-4 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                Portfolio
              </p>
              <h2 className="text-3xl md:text-4xl font-serif mt-1">
                Trabajos realizados
              </h2>
            </div>
            <a
              href={BUSINESS_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
            >
              Ver más diseños en Instagram <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PORTFOLIO_ITEMS.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 aspect-[4/5]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[11px] uppercase tracking-widest text-zinc-400">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg text-white">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="servicios" className="py-20 px-4 border-b border-zinc-900 bg-zinc-900/20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
              Menú de Servicios
            </p>
            <h2 className="text-3xl md:text-4xl font-serif">Lista de Precios</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-5">
              <h3 className="text-sm uppercase tracking-[0.2em] border-b border-zinc-800 pb-2 text-zinc-300">
                Nails
              </h3>
              <div className="space-y-4">
                {SERVICES.map((service) => (
                  <div key={service.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium text-white uppercase text-sm tracking-wide">
                        {service.name}
                      </span>
                      <span className="font-semibold text-white">
                        ${service.price.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-5">
                <h3 className="text-sm uppercase tracking-[0.2em] border-b border-zinc-800 pb-2 text-zinc-300">
                  Extras & Remoción
                </h3>
                <div className="space-y-3">
                  {EXTRAS.map((extra) => (
                    <div
                      key={extra.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-zinc-300">{extra.name}</span>
                      <span className="font-medium text-white">
                        ${extra.price.toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400">
                  <CreditCard className="w-4 h-4" />
                  <span>Medios de Pago</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {BUSINESS_INFO.paymentMethods.map((method) => (
                    <span
                      key={method}
                      className="px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-200"
                    >
                      {method}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500 pt-1">
                  Los valores están sujetos a modificación. Recordá avisar si
                  tenés que realizar algún retiro previo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingSection />

      <section id="cuidados" className="py-20 px-4 border-t border-zinc-900 bg-zinc-900/20">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
              Recomendaciones
            </p>
            <h2 className="text-3xl md:text-4xl font-serif">
              ¿Cómo cuidar tus uñas?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {NAIL_CARE_TIPS.map((tip, index) => (
              <div
                key={index}
                className="border border-zinc-800 bg-zinc-950 p-5 rounded-2xl flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-white" />
                </span>
                <p className="text-sm text-zinc-300 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ubicacion" className="py-20 px-4 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                Dónde estamos
              </p>
              <h2 className="text-3xl font-serif mt-1">Horarios y Ubicación</h2>
            </div>

            <div className="space-y-3 text-sm text-zinc-300">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-1" />
                <span>{BUSINESS_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>WhatsApp: {BUSINESS_INFO.whatsappDisplay}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs px-5 py-3 rounded-xl transition"
              >
                <MapPin className="w-4 h-4" /> Abrir en Google Maps
              </a>
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-white text-xs px-5 py-3 rounded-xl transition"
              >
                <MessageCircle className="w-4 h-4" /> Consultar por WhatsApp
              </a>
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400">
              <Clock className="w-4 h-4" />
              <span>Horarios de Atención</span>
            </div>
            <div className="divide-y divide-zinc-800/80 text-sm">
              {HOURS_DISPLAY.map((item) => (
                <div
                  key={item.day}
                  className="py-2.5 flex justify-between items-center"
                >
                  <span className="text-zinc-300">{item.day}</span>
                  <span
                    className={
                      item.hours === "Cerrado"
                        ? "text-zinc-500"
                        : "font-medium text-white"
                    }
                  >
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-8 px-4 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} {BUSINESS_INFO.name} — Córdoba,
            Argentina.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={BUSINESS_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300"
            >
              Instagram
            </a>
            <span>•</span>
            <Link to="/admin" className="hover:text-zinc-300">
              Acceso Administración
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}