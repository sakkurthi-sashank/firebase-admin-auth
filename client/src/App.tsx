import { useState } from 'react';
import { auth } from './libs/firebase';
import { useSignInWithGoogle, useAuthState } from 'react-firebase-hooks/auth';
import { FcGoogle } from 'react-icons/fc';

export function App() {
  const [signInWithGoogle, _user, _loading, error] = useSignInWithGoogle(auth);
  const [user] = useAuthState(auth);
  const [publicApiData, setPublicApiData] = useState<any>(null);
  const [protectedApiData, setProtectedApiData] = useState<any>(null);

  const fetchPublicApiData = async () => {
    setPublicApiData(null);
    const response = await fetch('http://localhost:8080/public');
    const data = await response.json();
    setPublicApiData(data);
  };

  const fetchProtectedApiData = async () => {
    setProtectedApiData(null);
    const token = await user?.getIdToken();
    const response = await fetch('http://localhost:8080/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setProtectedApiData(data);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div>
          <button onClick={() => signInWithGoogle()} className="flex items-center space-x-2 bg-white font-medium px-8 py-2 h-fit w-fit rounded-md shadow-md border border-gray-100">
            <div className="flex items-center space-x-2">
              <FcGoogle className="text-2xl" />
              <span className="text-lg text-gray-800">Sign in with Google</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col py-10 space-y-10 font-roboto antialiased items-center justify-center">
      <div className="flex w-full max-w-2xl justify-between items-center shadow-xl border border-gray-100 rounded-3xl px-8 py-4">
        <div className="flex items-center space-x-2">
          <img src={user?.photoURL!} className="rounded-full w-16 h-16" alt={user?.displayName!} />
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-xl font-semibold text-gray-800">{user?.displayName}</h1>
            <p className="text-lg font-normal text-gray-700">{user?.email}</p>
          </div>
        </div>
        <button onClick={() => auth.signOut()} className="text-sm bg-red-600 font-medium px-3 py-2 h-fit w-fit rounded-3xl text-white">
          Sign out
        </button>
      </div>

      <div className="max-w-5xl border border-gray-200 rounded-2xl w-full py-3 space-x-3 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Public API</h1>
          <button onClick={() => fetchPublicApiData()} className="text-sm bg-blue-600 font-medium px-3 py-2 h-fit w-fit rounded-3xl text-white">
            Fetch Data
          </button>
        </div>
        <div className="flex items-center rounded-xl justify-between bg-gray-100 p-3 m-3">
          <pre className="text-sm font-normal text-gray-700">{JSON.stringify(publicApiData, null, 2)}</pre>
        </div>
      </div>

      <div className="max-w-5xl border border-gray-200 rounded-2xl w-full py-3 space-x-3 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Protected API</h1>
          <button onClick={() => fetchProtectedApiData()} className="text-sm bg-blue-600 font-medium px-3 py-2 h-fit w-fit rounded-3xl text-white">
            Fetch Data
          </button>
        </div>
        <div className="flex items-center rounded-xl justify-between bg-gray-100 p-3 m-3">
          <pre className="text-sm font-normal text-gray-700">{JSON.stringify(protectedApiData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
