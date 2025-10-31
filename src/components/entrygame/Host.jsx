import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient';

const Host = () => {
  const [room, setRoom] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  //create a new game room
  const createRoom = async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const {data, error} = await supabase
      .from('rooms')
      .insert([{ code, host_name: 'Host' }])
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
      return alert('Error creating room');
    }

    setRoom(data);
  };

  //Let's Listen for submissions in this room
  useEffect(() => {
    if (!room) return;

    const channel = supabase
      .channel(`fastest-finger-${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "fastest_finger_submissions",
          filter: `room_id=eq.${room.id}`,
        },
        payload => {
          setSubmissions((prev) => [...prev, payload.new])
        }
      )
      .subscribe();

      return () => {
        supabase.removeChannel(channel);
      }
  }, [room]);

  return (
    <div className='p-8 text-white bg-slate-900 min-h-screen'>
      {!room ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">Host Panel</h2>
          <button
            onClick={createRoom}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Create Game Room
          </button>
        </div>
      ) : (
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Room Code: {room.code}</h2>
          <h3 className="text-xl font-semibold mb-2">Submissions</h3>
          {submissions.length === 0 ? (
            <p>No submissions yet...</p>
          ) : (
            <ul className="space-y-2">
              {submissions.map((sub) => (
                <li
                  key={sub.id}
                  className="bg-slate-800 p-3 rounded text-sm flex justify-between"
                >
                  <span>{sub.player_id}</span>
                  <span>{JSON.stringify(sub.order)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
      );
};

export default Host