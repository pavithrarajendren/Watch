import { useEffect, useState } from "react";
import "./OfferTimer.css";

const OFFER_DURATION = 24 * 60 * 60 * 1000;

function OfferTimer() {
  const [endTime] = useState(() => {
    const saved = localStorage.getItem("watch_offer_end");

    if (saved && Number(saved) > Date.now()) {
      return Number(saved);
    }

    const newEnd = Date.now() + OFFER_DURATION;
    localStorage.setItem("watch_offer_end", newEnd);
    return newEnd;
  });

  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, endTime - Date.now())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());

      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const totalSeconds = Math.floor(timeLeft / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const format = (value) => String(value).padStart(2, "0");

  if (timeLeft <= 0) {
    return (
      <section className="offer-timer expired">
        <div>
          <span>LIMITED TIME OFFER</span>
          <h2>Offer Expired</h2>
          <p>Stay tuned for our next exclusive offer.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="offer-timer">
      <div className="offer-content">
        <span className="offer-label">LIMITED TIME OFFER</span>

        <h2>Exclusive Watch Sale</h2>

        <p>
          Special prices on selected watches. Grab your favorite before time
          runs out!
        </p>

        <div className="countdown">
          <div className="time-box">
            <strong>{format(days)}</strong>
            <small>Days</small>
          </div>

          <b>:</b>

          <div className="time-box">
            <strong>{format(hours)}</strong>
            <small>Hours</small>
          </div>

          <b>:</b>

          <div className="time-box">
            <strong>{format(minutes)}</strong>
            <small>Minutes</small>
          </div>

          <b>:</b>

          <div className="time-box">
            <strong>{format(seconds)}</strong>
            <small>Seconds</small>
          </div>
        </div>

        <button
          onClick={() => {
            document
              .getElementById("watches")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          SHOP NOW
        </button>
      </div>
    </section>
  );
}

export default OfferTimer;