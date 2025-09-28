import React, { useState } from "react";

import type { NewEvent } from "../../types/Event";
import "./EventForm.css"; 

export type EventFormProps = { onCreate: (data: NewEvent) => void };

export const EventForm: React.FC<EventFormProps> = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");           // YYYY-MM-DD
  const [startTime, setStartTime] = useState(""); // HH:MM

  const canSubmit = name.trim() && place.trim() && date && startTime;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onCreate({
      name: name.trim(),
      description: description.trim(),
      place: place.trim(),
      date,
      startTime,
    });
    // reset
    setName(""); setDescription(""); setPlace(""); setDate(""); setStartTime("");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Create Event</h2>

      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Event name" required />
      </label>

      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is it about?" />
      </label>

      <label>
        Place
        <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Where" required />
      </label>

      <div className="row">
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>

        <label>
          Start time
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </label>
      </div>

      <button className="primary" type="submit" disabled={!canSubmit}>Create Event</button>
    </form>
  );
};
