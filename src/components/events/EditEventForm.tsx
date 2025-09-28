export function EditEventForm({handleEditEvent, setEditingEventId, e, duration, startDateTime}: any) {
    return (
        <form
            onSubmit={(formEvent) => handleEditEvent(formEvent, e.id)}
            style={{
                marginTop: '15px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '2px solid #007bff'
            }}
        >
            <h4 style={{ marginTop: '0', color: '#007bff' }}>✏️ Editando: {e.name}</h4>

            {/* Información básica */}
            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    name="name"
                    defaultValue={e.name}
                    placeholder="Nombre del evento"
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '8px', fontSize: '16px' }}
                />

                <textarea
                    name="description"
                    defaultValue={e.description}
                    placeholder="Descripción del evento"
                    rows={2}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '8px', fontSize: '16px', resize: 'vertical' }}
                />

                <input
                    type="text"
                    name="ubication"
                    defaultValue={e.ubication}
                    placeholder="Lugar del evento"
                    required
                    style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                />
            </div>

            {/* Fecha y hora */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha:</label>
                    <input
                        type="date"
                        name="date"
                        defaultValue={startDateTime.date}
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hora inicio:</label>
                    <input
                        type="time"
                        name="startTime"
                        defaultValue={startDateTime.time}
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Duración:</label>
                    <select
                        name="duration"
                        defaultValue={duration.toString()}
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    >
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

            {/* Botones */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    type="button"
                    onClick={() => setEditingEventId(null)}
                    style={{
                        flex: '1',
                        padding: '10px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px'
                    }}
                >
                    ❌ Cancelar
                </button>
                <button
                    type="submit"
                    style={{
                        flex: '1',
                        padding: '10px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    ✅ Guardar Cambios
                </button>
            </div>
        </form>
    )
}