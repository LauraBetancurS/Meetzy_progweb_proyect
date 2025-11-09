// src/components/polls/CreatePoll.tsx
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { NewPollInput } from "../../types/Poll";
import PrimaryButton from "../UI/PrimaryButton";
import "./CreatePoll.css";
import { createPollThunk, fetchPollsThunk } from "../../redux/slices/PollsSlice";

interface CreatePollProps {
  communityId: string;
  onClose: () => void;
}

export default function CreatePoll({ communityId, onClose }: CreatePollProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleAddOption() {
    setOptions([...options, ""]);
  }

  function handleRemoveOption(index: number) {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  }

  function handleOptionChange(index: number, value: string) {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!question.trim()) {
      alert("Por favor ingresa una pregunta");
      return;
    }

    const validOptions = options.filter((opt) => opt.trim());
    if (validOptions.length < 2) {
      alert("Por favor ingresa al menos 2 opciones");
      return;
    }

    if (!user?.id) {
      alert("Debes estar autenticado para crear una encuesta");
      return;
    }

    setIsSubmitting(true);

    const input: NewPollInput = {
      communityId,
      question: question.trim(),
      options: validOptions.map((opt) => opt.trim()),
      expiresAt: expiresAt || undefined,
    };

    try {
      const result = await dispatch(createPollThunk(input));
      if (createPollThunk.fulfilled.match(result)) {
        // Reload polls for the community
        await dispatch(fetchPollsThunk(communityId));
        setQuestion("");
        setOptions(["", ""]);
        setExpiresAt("");
        onClose();
      } else {
        alert(result.payload || "Error al crear la encuesta");
      }
    } catch (error) {
      alert("Error al crear la encuesta");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="createPoll">
      <form onSubmit={handleSubmit} className="createPoll__form">
        <h3>Crear nueva encuesta</h3>

        <div className="createPoll__field">
          <label htmlFor="question">Pregunta</label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="¿Cuál es tu pregunta?"
            required
          />
        </div>

        <div className="createPoll__field">
          <label>Opciones</label>
          {options.map((option, index) => (
            <div key={index} className="createPoll__optionRow">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Opción ${index + 1}`}
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="createPoll__removeBtn"
                  aria-label="Eliminar opción"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="createPoll__addOptionBtn"
          >
            + Agregar opción
          </button>
        </div>

        <div className="createPoll__field">
          <label htmlFor="expiresAt">Fecha de expiración (opcional)</label>
          <input
            id="expiresAt"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        <div >
          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear encuesta"}
          </PrimaryButton>
          <button type="button" onClick={onClose} className="createPoll__cancelBtn">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

