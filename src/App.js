import React, { useState } from "react";
import Calendar from "react-calendar";
import { IoAddCircleOutline } from "react-icons/io5";
import "react-calendar/dist/Calendar.css";
import "./App.css";

const App = () => {
  const [date, setDate] = useState(new Date()); // Selected date
  const [events, setEvents] = useState([
    {
      date: "2024-12-31",
      startTime: "19:00",
      endTime: "20:00",
      title: "Trivia Night",
    },
    {
      date: "2024-12-31",
      startTime: "19:00",
      endTime: "20:00",
      title: "Tacos and Trivia",
    },
  ]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startDate: null,
    endDate: null,
    startTime: "",
    endTime: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEventList, setShowEventList] = useState(false); // Track event list visibility

  // Format date to string
  const formatDate = (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().split("T")[0];
  };

  // Get events for the selected date
  const getEventsForDate = (currentDate) =>
    events.filter((event) => event.date === formatDate(currentDate));

  // Calculate remaining time
  const calculateRemainingTime = (event) => {
    const currentTime = new Date();
    const eventStart = new Date(`${event.date}T${event.startTime}:00`);
    const diff = (eventStart - currentTime) / (1000 * 60 * 60); // Convert to hours
    if (diff > 24) {
      return `${Math.ceil(diff / 24)} days`;
    } else if (diff > 0) {
      return `${Math.ceil(diff)} hours`;
    } else {
      return "Past Event";
    }
  };

  // Add a new event
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (
      newEvent.title &&
      newEvent.startDate &&
      newEvent.endDate &&
      newEvent.startTime &&
      newEvent.endTime
    ) {
      const formattedStartDate = formatDate(newEvent.startDate);
      setEvents([
        ...events,
        {
          date: formattedStartDate,
          title: newEvent.title,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
        },
      ]);
      setNewEvent({
        title: "",
        startDate: null,
        endDate: null,
        startTime: "",
        endTime: "",
      });
      setShowAddForm(false);
      alert("Event added successfully!");
    } else {
      alert("Please fill out all fields.");
    }
  };

  // Generate a random background color
  const getRandomColor = () => {
    const colors = ["#74b9ff", "#55efc4", "#a29bfe", "#fdcb6e", "#ff7675"];
    return colors[Math.floor(Math.random() * colors.length)];
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
        <button
          className="button today-button"
          onClick={() => setDate(new Date())}
        >
          Today
        </button>
        <button
          className="button list-button"
          onClick={() => setShowEventList(!showEventList)}
        >
          {showEventList ? "Hide Event List" : "Show Event List"}
        </button>
      </div>

      {/* Calendar */}
      {!showEventList && (
        <Calendar
          value={date}
          onChange={setDate}
          tileContent={({ date, view }) => {
            if (view === "month" && getEventsForDate(date).length > 0) {
              return <div className="event-marker"></div>;
            }
          }}
        />
      )}

      {/* Event Details */}
      {!showEventList && (
        <div className="event-details">
          <h2>Events on {date.toDateString()}</h2>
          {getEventsForDate(date).length > 0 ? (
            getEventsForDate(date).map((event, index) => (
              <div
                className="event-card"
                key={index}
                style={{ backgroundColor: getRandomColor() }}
              >
                <h3>{event.title}</h3>
                <p>
                  {event.startTime} to {event.endTime}
                </p>
                <p>{calculateRemainingTime(event)} left</p>
              </div>
            ))
          ) : (
            <p>No events for this day.</p>
          )}
        </div>
      )}

      {/* Event List */}
      {showEventList && (
        <div className="event-list">
          <h2>All Events</h2>
          {events.length > 0 ? (
            events.map((event, index) => (
              <div
                className="event-card"
                key={index}
                style={{ backgroundColor: getRandomColor() }}
              >
                <h3>{event.title}</h3>
                <p>
                  {event.date} | {event.startTime} to {event.endTime}
                </p>
                <p>{calculateRemainingTime(event)} left</p>
              </div>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      )}

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
              Start Date:
              <input
                type="date"
                value={
                  newEvent.startDate ? formatDate(new Date(newEvent.startDate)) : ""
                }
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    startDate: new Date(e.target.value + "T00:00:00"),
                  })
                }
                required
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={
                  newEvent.endDate ? formatDate(new Date(newEvent.endDate)) : ""
                }
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    endDate: new Date(e.target.value + "T00:00:00"),
                  })
                }
                required
              />
            </label>
            <label>
              Start Time:
              <input
                type="time"
                value={newEvent.startTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, startTime: e.target.value })
                }
                required
              />
            </label>
            <label>
              End Time:
              <input
                type="time"
                value={newEvent.endTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, endTime: e.target.value })
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
    </div>
  );
};

export default App;
