import { useEffect, useState } from "react";

function App() {
  const [allowed, setAllowed] = useState(false); // 👈 chặn vào app

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // load data
  useEffect(() => {
    fetch("/data/quiz.json")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch(() => setFinished(true));
  }, []);

  const question = questions.find((q) => q.id === current);

  const handleSelect = (key) => {
    if (showAnswer) return;

    setSelected(key);
    setShowAnswer(true);

    if (key === question.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (current >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((prev) => prev + 1);
      setSelected("");
      setShowAnswer(false);
    }
  };

  const finalScore =
    questions.length > 0 ? ((score / questions.length) * 10).toFixed(2) : 0;

  const progress =
    questions.length > 0 ? ((current - 1) / questions.length) * 100 : 0;

  // ===== MÀN HÌNH CHẶN =====
  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white px-4">
        <div className="bg-white text-black p-6 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">
            Nguyễn Nam Trung Nguyên có đẹp trai không? 😎
          </h1>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setAllowed(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
            >
              Có 👍
            </button>

            <button
              onClick={() => alert("Sai rồi 😏, chọn lại đi!")}
              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
            >
              Không ❌
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== FINISH =====
  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white px-4">
        <div className="bg-white text-black p-6 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">🎉 Hoàn thành</h1>
          <p>
            {score} / {questions.length}
          </p>
          <p className="text-3xl font-bold mt-2 text-indigo-600">
            {finalScore} / 10
          </p>
        </div>
      </div>
    );
  }

  // ===== LOADING =====
  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center px-3">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
        {/* HEADER */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Câu {current}</span>
            <span>{Math.round(progress)}%</span>
          </div>

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
              className={`w-full text-left p-3 rounded-xl border mb-2 transition ${style}`}
            >
              <span className="font-semibold">{key}.</span> {value}
            </button>
          );
        })}

        {showAnswer && (
          <div className="mt-4 text-sm space-y-2">
            {selected === question.answer ? (
              <p className="text-green-600 font-semibold">✅ Chính xác</p>
            ) : (
              <p className="text-red-600 font-semibold">
                ❌ Sai — Đáp án: {question.answer}
              </p>
            )}

            {/* 👇 GIẢI THÍCH */}
            <div className="bg-gray-100 p-3 rounded-xl">
              <p className="font-semibold text-indigo-600">💡 Giải thích:</p>
              <p className="text-gray-700">{question.explanation}</p>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <button
          onClick={handleNext}
          disabled={!showAnswer}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 disabled:bg-gray-400"
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
}

export default App;
