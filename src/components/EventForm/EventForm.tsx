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

