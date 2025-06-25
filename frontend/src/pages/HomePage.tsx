import { useState } from 'react';
import reactLogo from '@/assets/react.svg'; // Adjusted path if assets is in src
import viteLogo from '/vite.svg'; // viteLogo is typically in public
// import './App.css'; // If App.css contains styles specific to this, otherwise use a more generic css or Tailwind

export function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 text-center">
      <div className="flex justify-center items-center space-x-4 mb-8">
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo h-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react h-24" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-4">Vite + React To-Do App</h1>
      <div className="card bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <button
          onClick={() => setCount((currentCount) => currentCount + 1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          count is {count}
        </button>
        <p className="mb-2">
          Edit <code>src/App.tsx</code> or <code>src/pages/HomePage.tsx</code> and save to test HMR.
        </p>
      </div>
      <p className="read-the-docs mt-4 text-gray-500">
        Click on the Vite and React logos to learn more.
      </p>
    </div>
  );
}
