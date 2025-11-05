import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Employees from './pages/Employees';
import EmployeeForm from './pages/EmployeeForm';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeDetails from './pages/EmployeeDetails';

const qc = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={qc}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/employees"
            element={<ProtectedRoute><Employees /></ProtectedRoute>}
          />
          <Route
            path="/employees/new"
            element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>}
          />
          <Route
            path="/employees/:id"
            element={
              <ProtectedRoute>
                <EmployeeDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/:id/edit"
            element={<ProtectedRoute><EmployeeForm edit /></ProtectedRoute>}
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
