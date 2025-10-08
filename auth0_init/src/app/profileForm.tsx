"use client";

import { useEffect, useState } from "react";

export default function ProfileForm({ user }: { user: any }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(localStorage.getItem("profileCompleted") === "true");
  }, [completed]);

//   if (completed) {
//     localStorage.setItem("profileCompleted", "true");
//     return (
//       <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
//         <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
//           <h1 className="text-3xl font-semibold text-emerald-700 mb-4">Welcome, {user.name}!</h1>
//           <p>Profile submitted! Welcome, {firstName}!</p>;
//           <p className="text-gray-600 mb-6">You're successfully logged in.</p>
//           <a href="/auth/logout">
//             <button className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700 transition-all">
//               Log out
//             </button>
//           </a>
//         </div>
//       </main>
//     );
//   }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-96">
        <h1 className="text-2xl font-semibold text-orange-700 mb-4">Complete Your Profile</h1>
        <p className="text-gray-600 mb-6">We need some more information to continue.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await fetch("http://localhost:8080/api/auth/auth0/callback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                auth0UserId: user.sub,
                email: user.email,
                firstName,
                lastName,
                termsAccepted,
                marketingConsent,
              }),
            });
            localStorage.setItem("profileCompleted", "true");
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          />
          <label className="flex items-center gap-2 text-gray-900">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="accent-orange-600 text-gray-900"
              required
            />
            I accept the terms and conditions
          </label>
          <label className="flex items-center gap-2 text-gray-900">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="accent-orange-600 text-gray-900"
            />
            I agree to receive marketing emails
          </label>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-orange-600 text-white font-medium shadow-md hover:bg-orange-700 transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
