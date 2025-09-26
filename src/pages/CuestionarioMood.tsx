import { useApp } from '../context/AppContext'
import { DevNavButtons } from './DevNavButtons'

export default function CuestionarioMood() {
  const { answerMood } = useApp()
  return (
    <section>
      <h1>Cuestionario Mood</h1>
      <p>¿Cómo te sientes hoy (1-5)?</p>
      <div className="btns">
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={()=>answerMood({questionId:'q1', answer:n})}>{n}</button>
        ))}
      </div>
      <DevNavButtons />
    </section>
  )
}
