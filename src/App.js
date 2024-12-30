import React, { useState } from "react";
import Calendar from "react-calendar";
import { IoAddCircleOutline } from "react-icons/io5";
import "react-calendar/dist/Calendar.css";
import "./App.css";

const App = () => {
  const [date, setDate] = useState(new Date()); // Selected date
  const [events, setEvents] = useState([
    { date: "2024-12-29", title: "Team Meeting" },
    { date: "2024-12-31", title: "New Year's Eve Party" },
  ]);
  const [newEvent, setNewEvent] = useState({ title: "", date: null });
  const [showEventList, setShowEventList] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Format date to a string
  const formatDate = (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().split("T")[0];
  };

  // Get events for the selected date
  const getEventsForDate = (currentDate) =>
    events.filter((event) => event.date === formatDate(currentDate));

  // Add a new event
  const handleAddEvent = (e) => {
    e.preventDefault();

    if (newEvent.title && newEvent.date) {
      const formattedDate = formatDate(newEvent.date);
      setEvents([...events, { date: formattedDate, title: newEvent.title }]);
      setNewEvent({ title: "", date: null });
      setShowAddForm(false);
      alert("Event added successfully!");
    } else {
      alert("Please enter a valid title and date.");
    }
  };

  return (
    <div className="app-container">
      <div className="calendar-header">
        <h1>{date.toDateString()}</h1>
        <IoAddCircleOutline
          size={28}
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-form"
        />

        <div>
          <button
            className="button"
            onClick={() => setShowEventList(!showEventList)}
          >
            {showEventList ? "Back to Calendar" : "Event List"}
          </button>
          <button
            className="button today-button"
            onClick={() => setDate(new Date())}
          >
            Today
          </button>
        </div>
      </div>

      {showEventList ? (
        <div className="event-list">
          <h2>All Events</h2>
          {events.length > 0 ? (
            <div>
              {events.map((event, index) => (
                <div className="event-card" key={index}>
                  <h3>{event.title}</h3>
                  <p>Date: {event.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-events">No events available.</p>
          )}
        </div>
      ) : (
        <>
          {/* Calendar */}
          <Calendar
            value={date}
            onChange={setDate}
            tileContent={({ date, view }) => {
              if (view === "month" && getEventsForDate(date).length > 0) {
                return <div className="event-marker"></div>;
              }
            }}
          />

          {/* Event Details */}
          <div className="event-details">
            <h2>Events on {date.toDateString()}</h2>
            {getEventsForDate(date).length > 0 ? (
              <ul>
                {getEventsForDate(date).map((event, index) => (
                  <li key={index}>{event.title}</li>
                ))}
              </ul>
            ) : (
              <p>No events for this day.</p>
            )}
          </div>

          {/* Add Event Form */}
          {showAddForm && (
            <div className="add-event-form">
              <h3>Add New Event</h3>
              <form onSubmit={handleAddEvent}>
                <label>
                  Event Title:
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Event Date:
                  <input
                    type="date"
                    value={
                      newEvent.date ? formatDate(new Date(newEvent.date)) : ""
                    }
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        date: new Date(e.target.value + "T00:00:00"),
                      })
                    }
                    required
                  />
                </label>
                <button type="submit" className="button">
                  Add Event
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
