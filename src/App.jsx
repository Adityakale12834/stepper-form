import './App.css'
import HomePage from './components/HomePage';
import SingIn from './components/SingIn'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout';

function App() {

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<HomePage />} />
        </Route>
        <Route path='/signin' element={<SingIn />} />
      </Routes>
    </>
  )
}

export default App
