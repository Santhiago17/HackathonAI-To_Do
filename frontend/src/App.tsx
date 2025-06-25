// import { useState } from 'react'; // No longer needed here
// import reactLogo from './assets/react.svg'; // No longer needed here
// import viteLogo from '/vite.svg'; // No longer needed here
import './App.css'; // Keep if it contains global styles or layout styles for App
import { Link, Outlet } from 'react-router-dom';

function App() {
  // const [count, setCount] = useState(0); // No longer needed here

  return (
    <>
      <nav className="p-4 bg-gray-100 mb-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link>
          </li>
          <li>
            <Link to="/users" className="text-blue-500 hover:text-blue-700">Gerenciar Usuários</Link>
          </li>
          {/* Add other main navigation links here */}
        </ul>
      </nav>

      {/* Render current page content or default content if on "/" */}
      {/* If this App component is meant to be a layout for all pages, 
          the Outlet should be here. If it's just the home page content,
          the content below might be specific to the home page.
          For now, assuming it might act as a basic layout or home page.
      */}
      
      {/* If App.tsx is the main layout, an <Outlet /> from react-router-dom should render child routes */}
      <main className="p-4">
        <Outlet /> {/* This will render the matched child route's component */}
      </main>
      
      {/* The following content can be moved to a dedicated HomePage component if needed,
          or removed if App.tsx is purely a layout component. 
          For now, it will only be visible if no child route matches, 
          but since "/" in AppRoutes.tsx points to App, and App now has Outlet,
          we need a default child for "/" or adjust routing.
          Let's assume for now that when on "/", we want to show the Vite + React info.
          A better approach would be to have a dedicated <HomePage /> component for the "/" path.
      */}
      {/* 
        Consider creating a HomePage.tsx and routing "/" to it.
        For example, in AppRoutes.tsx:
        <Route path="/" element={<App />}> // App becomes the layout
          <Route index element={<HomePage />} /> // Default page for "/"
          <Route path="users" element={<UsersPage />} />
          ...
        </Route>

        And App.tsx would just be:
        <>
          <nav>...</nav>
          <main><Outlet /></main>
        </>
      */}

      {/* Fallback content if no child route is matched under App.tsx, or if on "/" path directly */}
      {/* This section might be better in a dedicated HomePage component for clarity */}
      {/* <div className="p-4">
        <div className="flex justify-center items-center space-x-4 mb-8">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="logo h-24" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="logo react h-24" alt="React logo" />
          </a>
        </div>
        <h1 className="text-4xl font-bold text-center mb-4">Vite + React To-Do App</h1>
        <div className="card bg-white shadow-md rounded-lg p-6 max-w-md mx-auto text-center">
          <button 
            onClick={() => setCount((currentCount) => currentCount + 1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            count is {count}
          </button>
          <p className="mb-2">
            Edit <code>src/App.tsx</code> and save to test HMR.
          </p>
        </div>
        <p className="read-the-docs text-center mt-4 text-gray-500">
          Click on the Vite and React logos to learn more.
        </p>
      </div> 
      */}
    </>
  );
}

export default App;
