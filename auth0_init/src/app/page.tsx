import { auth0 } from "../lib/auth0";
import ProfileForm from "./profileForm";

export default async function Home() {
  const session = await auth0.getSession();

  if (session) {
    console.log(session);
  }
  // If no session, show login/signup
  if (!session) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <h1 className="text-4xl font-bold mb-8 text-indigo-700">Welcome to Our App</h1>
        <div className="flex space-x-4">
          <a href="/auth/login?screen_hint=signup">
            <button className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition-all">
              Sign up
            </button>
          </a>
          <a href="/auth/login">
            <button className="px-6 py-2 rounded-xl border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 transition-all">
              Log in
            </button>
          </a>
        </div>
      </main>
    );
  }

  // // If session exists but firstName/lastName missing, show client form
  // const user = session.user;
  // if (!user.firstName || !user.lastName) {
  //   return <ProfileForm user={user} />;
  // }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-semibold text-emerald-700 mb-4">Welcome, {session.user.name}!</h1>
        <p>Profile submitted! Welcome, {session.user.family_name}!</p>;
        <p className="text-gray-600 mb-6">You're successfully logged in.</p>
        <a href="/auth/logout">
          <button className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700 transition-all">
            Log out
          </button>
        </a>
      </div>
    </main>
  );
}
