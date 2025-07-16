import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-08-20T09:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-8 py-16">
      <div className="text-center">
        <h2 className="orbitron text-4xl md:text-5xl font-bold cosmic-gradient mb-4">
          The Future Arrives In
        </h2>
        <p className="text-xl text-gray-300 mb-2">August 20, 2025 | 9:00 AM IST</p>
        <p className="text-lg text-purple-300">PSG College of Technology, Coimbatore</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        <div className="countdown-digit">
          <div className="jetbrains text-3xl md:text-4xl font-bold text-white">
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-300 mt-2">DAYS</div>
        </div>

        <div className="countdown-digit">
          <div className="jetbrains text-3xl md:text-4xl font-bold text-white">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-300 mt-2">HOURS</div>
        </div>

        <div className="countdown-digit">
          <div className="jetbrains text-3xl md:text-4xl font-bold text-white">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-300 mt-2">MINUTES</div>
        </div>

        <div className="countdown-digit">
          <div className="jetbrains text-3xl md:text-4xl font-bold text-white">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-300 mt-2">SECONDS</div>
        </div>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white font-semibold">Early Bird Registration Open</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;