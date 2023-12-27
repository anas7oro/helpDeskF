import React from 'react';
import './App.css';
import {BrowserRouter as Router , Routes ,Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header';
import ClientDashboard from './pages/clientDashboard';
import AdminDashboard from './pages/adminDashboard';
import AgentDashboard from './pages/agentDashboard';
import ManagerDashboard from './pages/managerDashboard';
import ViewAnalytics from './pages/ViewAnalytics';
import ManageReports from './pages/manageReports';
import Login from './pages/Login';
import Register from './pages/Register';
import LogsView from './pages/logs';
import Backups from './pages/backups';
import Branding from './pages/branding';
import { useSelector } from 'react-redux'; 
import { useLocation, useNavigate } from 'react-router-dom';

//anas start
import Profile from './pages/Profile';
import UpdateData from './pages/UpdateData';
import UpdatePassword from './pages/UpdatePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CreateUser from './pages/CreateUser';
import AssignRole from './pages/AssignRole';
import Mfa from './pages/Mfa';
//anas end


function App() {
  const user = useSelector((state) => state.auth.user); // access user from state
  return (
    <Router>
      <AppContent user={user} />
      <ToastContainer />
    </Router>
  );
}

function RedirectToRoot() {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
}

function AppContent({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className='container' key={user ? user.id : 'guest'}>
      {location.pathname === '/' && <Header/>}
      <Routes>
        {user && user.role === 'client' && <Route path='/dashboard' element={<ClientDashboard/>}/>}
        {user && user.role === 'admin' && <Route path='/dashboard' element={<AdminDashboard/>}/>}
        {user && user.role === 'admin' && <Route path='/branding' element={<Branding/>}/>}
        {user && user.role === 'admin' && <Route path='/logs' element={<LogsView/>}/>}
        {user && user.role === 'admin' && <Route path='/backups' element={<Backups/>}/>}
        {user && user.role === 'agent' && <Route path='/dashboard' element={<AgentDashboard/>}/>}
        {user && user.role === 'manager' && <Route path='/dashboard' element={<ManagerDashboard/>}/>}
        {user && user.role === 'manager' && <Route path='/viewAnalytics' element={<ViewAnalytics/>}/>}
        {user && user.role === 'manager' && <Route path='/manageReports' element={<ManageReports/>}/>}
        {/*anas start */}
        <Route path='/createUser' element={<CreateUser/>}/>
          <Route path='/assignRole' element={<AssignRole/>}/>
          <Route path='/otpVerification' element={<Mfa/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/UpdateData' element={<UpdateData/>}/>
          <Route path='/updatePassword' element={<UpdatePassword/>}/>
          <Route path='/forgotPassword' element={<ForgotPassword/>}/>
          <Route path='/resetPassword/:id/:token' element={<ResetPassword/>}/>
          {/*anas start */}
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='*' element={<RedirectToRoot />} />

      </Routes>
    </div>
  );
}

export default App;