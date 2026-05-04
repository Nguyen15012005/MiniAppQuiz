import { useEffect, useState } from "react";

function App() {
  const [question, setQuestion] = useState(null);
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const TOTAL = 100; // 👈 sửa nếu số câu khác

  useEffect(() => {
    fetch(`http://localhost:3001/${current}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data);
        setSelected("");
        setShowAnswer(false);
      })
      .catch(() => setFinished(true));
  }, [current]);

  const handleSelect = (key) => {
    if (showAnswer) return;

    setSelected(key);
    setShowAnswer(true);

    if (key === question.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setCurrent((prev) => prev + 1);
  };

  const finalScore = ((score / (current - 1)) * 10).toFixed(2);
  const progress = ((current - 1) / TOTAL) * 100;

  // ===== FINISH =====
  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white px-4">
        <div className="bg-white text-black p-6 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">🎉 Hoàn thành</h1>
          <p className="text-lg">
            {score} / {current - 1} câu đúng
          </p>
          <p className="text-3xl font-bold mt-2 text-indigo-600">
            {finalScore} / 10
          </p>
        </div>
      </div>
    );
  }

  if (!question)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center px-3">
      {/* CARD */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
        {/* HEADER */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Câu {current}</span>
            <span>{Math.round(progress)}%</span>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* QUESTION */}
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          {question.question}
        </h2>

        {/* OPTIONS */}
        <div className="space-y-2">
          {Object.entries(question.options).map(([key, value]) => {
            let style = "bg-white";

            if (showAnswer) {
              if (key === question.answer) {
                style = "bg-green-500 text-white";
              } else if (key === selected) {
                style = "bg-red-500 text-white";
              }
            } else if (selected === key) {
              style = "bg-indigo-100";
            }

            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 
                hover:scale-[1.02] active:scale-[0.98] ${style}`}
              >
                <span className="font-semibold">{key}.</span> {value}
              </button>
            );
          })}
        </div>

        {/* RESULT */}
        {showAnswer && (
          <div className="mt-4 text-sm">
            {selected === question.answer ? (
              <p className="text-green-600 font-semibold">✅ Chính xác</p>
            ) : (
              <p className="text-red-600 font-semibold">
                ❌ Sai — Đáp án: {question.answer}
              </p>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">Điểm: {score}</div>

          <button
            onClick={handleNext}
            disabled={!showAnswer}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 transition"
          >
            Tiếp →
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
