export function NewEventForm({handleNewEvent, setIsCreating}: any) {

    return (
        <form onSubmit={handleNewEvent} style={{ maxWidth: '500px', padding: '20px' }}>
            <h2>Crear Nuevo Evento</h2>

            {/* Información básica */}
            <div style={{ marginBottom: '20px' }}>
                <h3>📋 Información del Evento</h3>

                <input
                    type="text"
                    placeholder="Nombre del evento"
                    name="name"
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px' }}
                />

                <textarea
                    placeholder="Descripción del evento"
                    name="description"
                    rows={3}
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px', resize: 'vertical' }}
                />
                
                <input
                    type="text"
                    placeholder="Lugar del evento"
                    name="ubication"
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px' }}
                />
            </div>

            {/* Fechas y horarios */}
            <div style={{ marginBottom: '20px' }}>
                <h3>📅 Fecha y Hora</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha:</label>
                        <input
                            type="date"
                            name="date"
                            required
                            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hora de inicio:</label>
                        <input
                            type="time"
                            name="startTime"
                            required
                            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Duración (horas):</label>
                        <select
                            name="duration"
                            required
                            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                        >
                            <option value="">Seleccionar</option>
                            <option value="0.5">30 minutos</option>
                            <option value="1">1 hora</option>
                            <option value="1.5">1.5 horas</option>
                            <option value="2">2 horas</option>
                            <option value="3">3 horas</option>
                            <option value="4">4 horas</option>
                            <option value="5">5 horas</option>
                            <option value="6">6 horas</option>
                            <option value="8">8 horas</option>
                            <option value="12">12 horas</option>
                        </select>
                    </div>
                </div>
            </div>

            <span style={{ display: "flex", alignItems: "cemter", gap: "1rem" }}>
                <button
                    onClick={() => setIsCreating(false)}
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '18px',
                        backgroundColor: 'gray',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '18px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    🎉 Crear Evento
                </button>
            </span>
        </form>
    )
}