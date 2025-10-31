import { useState } from "react";
import Host from "./components/entrygame/Host";
import Player from "./components/entrygame/Player";


export default function App() {
  const [role, setRole] = useState(null);

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-slate-900 text-white">
        <h1 className="text-3xl font-bold">Who Wants To Be A Millionaire</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setRole("host")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Host Game
          </button>
          <button
            onClick={() => setRole("player")}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Join as Player
          </button>
        </div>
      </div>
    );
  }

  return role === "host" ? <Host /> : <Player />;
}
