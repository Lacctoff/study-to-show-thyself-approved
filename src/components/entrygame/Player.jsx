import { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Player() {
  const [roomCode, setRoomCode] = useState("");
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);
  const [options] = useState(["Mercury", "Venus", "Earth", "Mars"]);

  const joinRoom = async () => {
    const { data: foundRoom, error } = await supabase
      .from("rooms")
      .select()
      .eq("code", roomCode)
      .single();

    if (error || !foundRoom) return alert("Room not found!");
    setRoom(foundRoom);

    const { data: newPlayer, error: playerErr } = await supabase
      .from("players")
      .insert([{ room_id: foundRoom.id, name: `Player-${Date.now()}` }])
      .select()
      .single();

    if (playerErr) return alert(playerErr.message);
    setPlayer(newPlayer);
  };

  const submitOrder = async () => {
    const answers_order = [...options].sort(() => Math.random() - 0.5); // just random demo order
    const { error } = await supabase.from("fastest_finger_submissions").insert([
      {
        room_id: room.id,
        player_id: player.id,
        answers_order,
        client_time_ms: Date.now(),
      },
    ]);
    if (error) console.error(error);
    else alert("Submitted!");
  };

  if (!room)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white gap-4">
        <h2 className="text-2xl font-bold">Join a Room</h2>
        <input
          className="border rounded px-3 py-2 text-black"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Enter Room Code"
        />
        <button
          onClick={joinRoom}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Join Game
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white gap-4">
      <h2 className="text-xl font-bold">Room: {room.code}</h2>
      <p>Question: Arrange the planets from nearest to the sun</p>
      <ul>
        {options.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <button
        onClick={submitOrder}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Submit Order
      </button>
    </div>
  );
}
