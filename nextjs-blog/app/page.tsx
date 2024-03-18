import Image from "next/image";
import {signOut} from "next-auth/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <button onClick={() => signOut()}>
      <p> log out</p>
      </button> */}
    </main>
  );
}
