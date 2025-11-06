import { useAppDispatch } from "../redux/hooks";
import { answerMood } from "../redux/slices/AppSlice";
import { DevNavButtons } from "./DevNavButtons";

export default function CuestionarioMood() {
  const dispatch = useAppDispatch();

  function handleAnswer(n: number) {
    dispatch(
      answerMood({
        questionId: "q1",
        answer: n,
      })
    );
  }

  return (
    <section>
      <h1>Cuestionario Mood</h1>
      <p>¿Cómo te sientes hoy (1-5)?</p>
      <div className="btns">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => handleAnswer(n)}>
            {n}
          </button>
        ))}
      </div>
      <DevNavButtons />
    </section>
  );
}
