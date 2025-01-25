import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>Welcome to the Next JS and ChatGPT Starter</p>
      
      <Link href="/api/auth/login" className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600">Login</Link>
    </div>
  );
}
