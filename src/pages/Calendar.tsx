import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr"; // locale française
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import { getAllFormations, Formation } from "../api/formationService";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    formationId?: number;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("Primary");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  // Charger les formations depuis l'API
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const formations: Formation[] = await getAllFormations();
        const mappedEvents: CalendarEvent[] = formations.map((f) => ({
          id: f.id.toString(),
          title: f.theme,
          start: f.dateDebut,
          end: f.dateFin,
          allDay: true,
          extendedProps: { calendar: "Primary", formationId: f.id },
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error("Erreur lors du chargement des formations:", error);
      }
    };
    fetchFormations();
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { calendar: eventLevel, formationId: event.extendedProps.formationId },
              }
            : event
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        allDay: true,
        extendedProps: { calendar: eventLevel },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("Primary");
    setSelectedEvent(null);
  };

  return (
    <>
      <PageMeta title="Calendrier" description="Page du calendrier" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={frLocale} // appliquer la langue française
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={false}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
           // customButtons={{
             // addEventButton: { text: "Ajouter un événement +", click: openModal },
           // }}
          />
        </div>

        {/* Modal pour ajouter/modifier l'événement */}
        {isOpen && (
          <Modal isOpen={isOpen} onClose={closeModal}>
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2">{selectedEvent ? "Modifier l'événement" : "Ajouter un événement"}</h2>
              <input
                type="text"
                placeholder="Titre de l'événement"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="border p-2 mb-2 w-full"
              />
              <input
                type="date"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
                className="border p-2 mb-2 w-full"
              />
              <input
                type="date"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
                className="border p-2 mb-2 w-full"
              />
              <select value={eventLevel} onChange={(e) => setEventLevel(e.target.value)} className="border p-2 mb-2 w-full">
                <option value="Primary">Primaire</option>
                <option value="Success">Succès</option>
                <option value="Danger">Danger</option>
                <option value="Warning">Avertissement</option>
              </select>
              <button onClick={handleAddOrUpdateEvent} className="bg-blue-500 text-white p-2 rounded">
                {selectedEvent ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
