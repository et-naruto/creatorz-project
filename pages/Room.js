import { useState, useEffect } from "react";
import Data from "/pages/Room";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import supabase from "../utils/supabase";
import 'bootstrap/dist/css/bootstrap.css';

export default function Room({ session }) {
  const supabase = useSupabaseClient();
  const channel = supabase.channel("room1");
  const [loading, setLoading] = useState(true);
  const [fetchData, setFetchData] = useState("");

  useEffect(() => {
    supabase
      .channel("room2")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "request" },
        (payload) => {
          console.log("Change received!", payload);
          const selected = ["new"];
          const filteredUsers = Object.keys(payload)
            .filter((key) => selected.includes(key))
            .reduce((obj, key) => {
              obj[key] = payload[key];
              return obj;
            }, {});
          let filteredValue = Object.values(filteredUsers)
          filteredValue = Object.values(filteredValue[0])
          const fish_fed = filteredValue[0]
          const id = filteredValue[1]
          const time_fed = filteredValue[2]          
          document.getElementById("fish_fed").innerHTML = `fish_fed : ${fish_fed}`;
          document.getElementById("id").innerHTML = `id : ${id}`;
          document.getElementById("time_fed").innerHTML = `time_fed : ${time_fed}`;
        }
      )
      .subscribe();
  });

  const handleSubmit = async (e) => {
    const updates = {
      time_fed: new Date().toISOString(),
      fish_fed: true,
    };

    e.preventDefault();
    // supabase
    //     .channel("room2")
    //     .on(
    //       "postgres_changes",
    //       { event: "UPDATE", schema: "public", table: "request" },
    //       (payload) => {
    //         console.log("Change received!", payload);
    //       }
    //     ).upsert(updates).subscribe()

    // channel.subscribe(async (status) => {
    //   if (status === "SUBSCRIBED") {
    //     const res = await supabase.from("request").upsert(updates);
    //     console.log(res);
    //   }
    // });
    const res = await supabase.from("request").upsert(updates);
    console.log(res);
  };

  return (
    <>
      <div class="container mt-5">
        <div class="row">
        <div class="col-4" />
        <div class=" col-4">
          <button class="btn btn-outline-success btn-lg --bs-success" onClick={handleSubmit}>Feed</button>
          <br></br>
          <br></br>
            <p class="font-family-roboto" id="id"></p>
            <p id="time_fed"></p>
            <p id="fish_fed"></p>
        </div>
        <div class="col-4" />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { data } = await supabase.auth.getSession();

  console.log(data);
  if (!data) {
    console.log(data);
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  if (data) {
    return {
      props: {
        request: data,
      },
    };
  }
}

async function getData() {}

// async function getProfile() {

// async function updateProfile({ username, website, avatar_url }) {
//   try {
//     setLoading(true)

//     const updates = {
//       id: user.id,
//       username,
//       website,
//       avatar_url,
//       updated_at: new Date().toISOString(),
//     }

//     let { error } = await supabase.from('profiles').upsert(updates)
//     if (error) throw error
//     alert('Profile updated!')
//   } catch (error) {
//     alert('Error updating the data!')
//     console.log(error)
//   } finally {
//     setLoading(false)
//   }
// }

// return (
//   <div className="form-widget">
//     <div>
//       <label htmlFor="email">Email</label>
//       {/* <input id="email" type="text" value={session.user.email} disabled /> */}
//     </div>
//     <div>
//       <label htmlFor="username">Username</label>
//       <input
//         id="username"
//         type="text"
//         value={username || ''}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//     </div>
//     <div>
//       <label htmlFor="website">Website</label>
//       <input
//         id="website"
//         type="website"
//         value={website || ''}
//         onChange={(e) => setWebsite(e.target.value)}
//       />
//     </div>

//     <div>
//       <button
//         className="button primary block"
//         onClick={() => updateProfile({ username, website, avatar_url })}
//         disabled={loading}
//       >
//         {loading ? 'Loading ...' : 'Update'}
//       </button>
//     </div>

//     <div>
//       <button className="button block" onClick={() => supabase.auth.signOut()}>
//         Sign Out
//       </button>
//     </div>
//   </div>
// )
