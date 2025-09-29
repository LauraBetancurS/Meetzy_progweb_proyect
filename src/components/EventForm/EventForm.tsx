import { useState } from "react";
import type { NewEvent } from "../../types/Event";
import "./EventForm.css";

export type EventFormProps = {
  onCreate: (data: NewEvent) => void;
};

export function EventForm({ onCreate }: EventFormProps) {
  const [form, setForm] = useState<NewEvent>({
    name: "",
    description: "",
    place: "",
    date: "",
    startTime: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.place.trim() || !form.date || !form.startTime) return;

    onCreate({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      place: form.place.trim(),
    });

    // reset
    setForm({ name: "", description: "", place: "", date: "", startTime: "" });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Nombre
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre del evento"
          required
        />
      </label>

      <label>
        Descripción
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="¿De qué se trata?"
        />
      </label>

      <label>
        Lugar
        <input
          name="place"
          value={form.place}
          onChange={handleChange}
          placeholder="Dónde será"
          required
        />
      </label>

      <div className="row">
        <label>
          Fecha
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>

        <label>
          Hora
          <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
        </label>
      </div>

      <button className="primary" type="submit">
        Crear evento
      </button>
    </form>
  );
}
