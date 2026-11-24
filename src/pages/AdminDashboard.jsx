import { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Trash2,
  Lock,
  LogOut,
  Phone,
  Clock,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  const [blockDate, setBlockDate] = useState("");
  const [blockFullDay, setBlockFullDay] = useState(true);
  const [blockStart, setBlockStart] = useState("09:00");
  const [blockEnd, setBlockEnd] = useState("13:00");
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchAdminData();
    }
  }, [session, filterDate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError("Email o contraseña incorrectos.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchAdminData = async () => {
    setLoadingData(true);
    try {
      let query = supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (filterDate) {
        query = query.eq("appointment_date", filterDate);
      } else {
        const today = new Date().toISOString().split("T")[0];
        query = query.gte("appointment_date", today);
      }

      const [{ data: appts }, { data: blocks }] = await Promise.all([
        query,
        supabase
          .from("blocked_slots")
          .select("*")
          .gte("blocked_date", new Date().toISOString().split("T")[0])
          .order("blocked_date", { ascending: true }),
      ]);

      setAppointments(appts || []);
      setBlockedSlots(blocks || []);
    } catch (err) {
      console.error("Error cargando datos admin:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este turno definitivamente?")) return;
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (!error) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleAddBlock = async (e) => {
    e.preventDefault();
    if (!blockDate) return;

    const payload = {
      blocked_date: blockDate,
      start_time: blockFullDay ? null : blockStart,
      end_time: blockFullDay ? null : blockEnd,
      reason: blockReason.trim() || "Bloqueado por administración",
    };

    const { error } = await supabase.from("blocked_slots").insert([payload]);
    if (!error) {
      setBlockDate("");
      setBlockReason("");
      fetchAdminData();
    }
  };

  const deleteBlock = async (id) => {
    const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
    if (!error) {
      setBlockedSlots((prev) => prev.filter((b) => b.id !== id));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Cargando panel...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm border border-zinc-800 bg-zinc-900/60 p-8 rounded-2xl space-y-5"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-serif">Libre Nails — Admin</h1>
            <p className="text-xs text-zinc-400">
              Ingresá con tu cuenta para gestionar turnos
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white"
              required
            />
          </div>

          {authError && <p className="text-xs text-red-400">{authError}</p>}

          <button
            type="submit"
            className="w-full bg-white text-zinc-950 font-semibold py-2.5 rounded-xl hover:bg-zinc-200 transition cursor-pointer"
          >
            Entrar al panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl font-serif">Agenda de Turnos — Libre Nails</h1>
            <p className="text-xs text-zinc-400">
              Gestioná reservas, confirmá señas y bloqueá días libres
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs border border-zinc-700 hover:border-zinc-500 px-3.5 py-2 rounded-lg transition"
            >
              Ver web pública
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3.5 py-2 rounded-lg text-zinc-300 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                {filterDate && (
                  <button
                    onClick={() => setFilterDate("")}
                    className="text-xs text-zinc-400 hover:text-white underline"
                  >
                    Ver todos los próximos
                  </button>
                )}
              </div>

              <button
                onClick={fetchAdminData}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Actualizar
              </button>
            </div>

            {loadingData ? (
              <p className="text-sm text-zinc-400 py-8">Cargando turnos...</p>
            ) : appointments.length === 0 ? (
              <div className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-8 text-center text-sm text-zinc-400">
                No hay turnos registrados para el filtro seleccionado.
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt) => {
                  const isConfirmed = appt.status === "confirmado";
                  const isCancelled = appt.status === "cancelado";
                  return (
                    <div
                      key={appt.id}
                      className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCancelled
                          ? "border-zinc-900 bg-zinc-950 opacity-50"
                          : isConfirmed
                          ? "border-emerald-900/60 bg-zinc-900/60"
                          : "border-amber-900/60 bg-zinc-900/60"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-base">
                            {appt.client_name}
                          </span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                              isCancelled
                                ? "bg-red-950 text-red-300"
                                : isConfirmed
                                ? "bg-emerald-950 text-emerald-300"
                                : "bg-amber-950 text-amber-300"
                            }`}
                          >
                            {isCancelled
                              ? "Cancelado"
                              : isConfirmed
                              ? "Seña Confirmada"
                              : "Pendiente de seña"}
                          </span>
                        </div>

                        <p className="text-sm text-zinc-300">
                          <span className="font-medium">{appt.service_name}</span>
                          {appt.extras && appt.extras.length > 0 && (
                            <span className="text-zinc-400 text-xs">
                              {" "}
                              + {appt.extras.join(", ")}
                            </span>
                          )}{" "}
                          •{" "}
                          <span className="text-zinc-300">
                            ${Number(appt.total_price).toLocaleString("es-AR")}
                          </span>
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                          <span className="inline-flex items-center gap-1 text-white font-medium">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            {appt.appointment_date.split("-").reverse().join("/")} •{" "}
                            {appt.start_time.slice(0, 5)} a {appt.end_time.slice(0, 5)} hs
                          </span>
                          <a
                            href={`https://wa.me/549${appt.client_phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-emerald-400"
                          >
                            <Phone className="w-3.5 h-3.5" /> {appt.client_phone}
                          </a>
                        </div>

                        {appt.notes && (
                          <p className="text-xs text-zinc-500 italic pt-1">
                            Nota: "{appt.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isConfirmed && !isCancelled && (
                          <button
                            onClick={() => updateAppointmentStatus(appt.id, "confirmado")}
                            title="Confirmar seña recibida"
                            className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmar seña
                          </button>
                        )}
                        {!isCancelled && (
                          <button
                            onClick={() => updateAppointmentStatus(appt.id, "cancelado")}
                            title="Cancelar y liberar horario"
                            className="inline-flex items-center gap-1 border border-zinc-700 hover:border-red-500 hover:text-red-400 text-zinc-300 text-xs px-2.5 py-2 rounded-lg transition cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancelar
                          </button>
                        )}
                        <button
                          onClick={() => deleteAppointment(appt.id)}
                          title="Eliminar registro"
                          className="p-2 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <form
              onSubmit={handleAddBlock}
              className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider">
                  Bloquear día u horario
                </h2>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Fecha</label>
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={blockFullDay}
                  onChange={(e) => setBlockFullDay(e.target.checked)}
                  className="accent-white"
                />
                Bloquear todo el día
              </label>

              {!blockFullDay && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Desde</label>
                    <input
                      type="time"
                      value={blockStart}
                      onChange={(e) => setBlockStart(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Hasta</label>
                    <input
                      type="time"
                      value={blockEnd}
                      onChange={(e) => setBlockEnd(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              <input
                type="text"
                placeholder="Motivo (ej. Franco / Feriado)"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
              />

              <button
                type="submit"
                className="w-full bg-white text-zinc-950 font-semibold text-xs py-2.5 rounded-lg hover:bg-zinc-200 transition cursor-pointer"
              >
                Guardar bloqueo
              </button>
            </form>

            {blockedSlots.length > 0 && (
              <div className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-5 space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  Bloqueos activos
                </h3>
                <div className="space-y-2">
                  {blockedSlots.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between text-xs bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {b.blocked_date.split("-").reverse().join("/")}{" "}
                          {b.start_time
                            ? `(${b.start_time.slice(0, 5)} - ${b.end_time.slice(0, 5)})`
                            : "(Día completo)"}
                        </p>
                        <p className="text-zinc-500">{b.reason}</p>
                      </div>
                      <button
                        onClick={() => deleteBlock(b.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}