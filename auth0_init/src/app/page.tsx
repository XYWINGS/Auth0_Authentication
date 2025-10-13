import { decodeJWT } from "@/lib/jwt-utils";
import { auth0 } from "../lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();
  const namespace = process.env.BACKEND_WEBHOOK_URL;

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

  // Decode ID token to get claims
  const idToken = session.tokenSet.idToken ?? "";
  const decodedIdToken = decodeJWT(idToken) || {};

  // Extract custom claims from ID token using the specific URL keys
  const phoneNumber = decodedIdToken[`${namespace}/phone-number-verified/phone_number`];
  const phoneVerified = decodedIdToken[`${namespace}/phone-number-verified/phone_verified`];
  const phoneNotifiedAt = decodedIdToken[`${namespace}/phone-number-verified/phone_number_verification_notified_at`];
  const phoneNotifyStatus =
    decodedIdToken[`${namespace}/phone-number-verified/phone_number_verification_notify_status`];

  const emailVerified = decodedIdToken[`${namespace}/api/auth/verify-email/email_verified`];
  const emailNotifyStatus = decodedIdToken[`${namespace}/api/auth/verify-email/email_verification_notify_status`];
  const emailNotifiedAt = decodedIdToken[`${namespace}api/auth/verify-email/email_verification_notified_at`];

  // Extract standard claims
  const givenName = decodedIdToken.given_name;
  const familyName = decodedIdToken.family_name;
  const nickname = decodedIdToken.nickname;
  const name = decodedIdToken.name;
  const picture = decodedIdToken.picture;
  const email = decodedIdToken.email;
  const updatedAt = decodedIdToken.updated_at;

  // Helper function to display status with badges
  const StatusBadge = ({
    status = false,
    trueText = "Verified",
    falseText = "Not Verified",
  }: {
    status?: boolean;
    trueText?: string;
    falseText?: string;
  }) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        status ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status ? trueText : falseText}
    </span>
  );

  const BooleanBadge = ({
    value = false,
    trueText = "Yes",
    falseText = "No",
  }: {
    value?: boolean;
    trueText?: string;
    falseText?: string;
  }) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        value ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
      }`}
    >
      {value ? trueText : falseText}
    </span>
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        {/* Header with user info */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {picture && (
              <img src={picture} alt="Profile" className="w-20 h-20 rounded-full border-4 border-emerald-200" />
            )}
          </div>
          <h1 className="text-3xl font-semibold text-emerald-700 mb-2">Welcome, {name}!</h1>
          <p className="text-gray-600">You're successfully logged in.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Full Name:</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Given Name:</span>
                <span className="font-medium">{givenName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Family Name:</span>
                <span className="font-medium">{familyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nickname:</span>
                <span className="font-medium">{nickname}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium text-sm">{formatDate(updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Verification Status</h2>

            {/* Email Verification */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Email Verification</h3>
              <div className="space-y-2 pl-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Verified:</span>
                  <StatusBadge status={emailVerified} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Backend Notified:</span>
                  <BooleanBadge value={emailNotifyStatus} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Notified At:</span>
                  <span className="font-medium text-sm">{formatDate(emailNotifiedAt)}</span>
                </div>
              </div>
            </div>

            {/* Phone Verification */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Phone Verification</h3>
              <div className="space-y-2 pl-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone Number:</span>
                  <span className="font-medium">{phoneNumber || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verified:</span>
                  <StatusBadge status={phoneVerified} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Backend Notified:</span>
                  <BooleanBadge value={phoneNotifyStatus} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Notified At:</span>
                  <span className="font-medium text-sm">{formatDate(phoneNotifiedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4 pt-6 border-t">
          <button className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700 transition-all">
            Update Profile
          </button>
          <button className="px-6 py-2 rounded-xl border border-emerald-600 text-emerald-600 font-medium hover:bg-emerald-50 transition-all">
            Verify Phone
          </button>
          <a href="/auth/logout">
            <button className="px-6 py-2 rounded-xl bg-red-600 text-white font-medium shadow-md hover:bg-red-700 transition-all">
              Log out
            </button>
          </a>
        </div>

        {/* Debug Information */}
        <div className="mt-8 space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-gray-700">Raw ID Token Claims</summary>
            <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-auto max-h-40">
              {JSON.stringify(decodedIdToken, null, 2)}
            </pre>
          </details>

          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-gray-700">Session Information</summary>
            <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-auto max-h-40">
              {JSON.stringify(
                {
                  hasIdToken: !!idToken,
                  namespace: process.env.BACKEND_WEBHOOK_URL,
                  sessionKeys: Object.keys(session),
                },
                null,
                2
              )}
            </pre>
          </details>
        </div>
      </div>
    </main>
  );
}
