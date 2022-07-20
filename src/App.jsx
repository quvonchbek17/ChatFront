import { Route, Routes } from 'react-router';
import Login from './pages/Login/Login';
import './App.css';
import Chat from './pages/Chat/Chat';
import Register from './pages/Register/Register';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/chat' element={<Chat/>} />
      <Route path='/register' element={<Register/>} />
    </Routes>
  )
}

export default App;
