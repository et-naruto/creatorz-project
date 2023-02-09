import {
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Room from "../pages/Room"


export default function Account({ session }) {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  const channel = supabase.channel("room2");
  const roomId = "room1";
  const userId = "user1";
  const [password, setPassword] = useState("");

  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `room_id=eq.${roomId}`,
    },
    (payload) => console.log(payload)
  );

  //   const { error } = await supabase
  //   .from('countries')
  //   .insert({ id: 1, name: 'Denmark' }).select()

  const handleSubmit = (event, subscribe) => {
    console.log("Clicked event successful")
    event.preventDefault();
    if (password == "room2") {
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          <Room />
          
          
          router.push("/Room")
          console.log("Test")
        }
        
      });
    }
  };


  return (
    <>
      
        <form onSubmit={handleSubmit}>
        <label>
          {" "}
          Enter the password for room2:
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" />
        </label>
      </form>
    </>
  );
}

export async function getServerSideProps() {
  let { data } = await supabase.from("messages").select();

  return {
    props: {
      messages: data,
    },
  };
}
