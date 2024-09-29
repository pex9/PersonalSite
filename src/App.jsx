import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DefaultRoute from './components/DefaultRoute';
import HomeRoute from './components/HomeRoute';
function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/site' element={<HomeRoute />} />
          <Route path='/*' element={<DefaultRoute />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App
