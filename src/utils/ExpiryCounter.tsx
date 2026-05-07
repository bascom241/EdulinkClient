import { useEffect, useState } from "react";

const ExpiryCounter = ({ expiresAt }: { expiresAt: Date }) => {
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, expiresAt.getTime() - Date.now())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = expiresAt.getTime() - Date.now();
      setTimeLeft(Math.max(0, remaining));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // Convert ms → mm:ss
  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <p className="text-sm text-gray-500 mt-4">
      Code expires in{" "}
      <span className="font-semibold text-black">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </p>
  );
};

export default ExpiryCounter;