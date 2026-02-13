import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Saved from './pages/Saved'
import Digest from './pages/Digest'
import Settings from './pages/Settings'
import Proof from './pages/Proof'
import JtTest from './pages/JtTest'
import JtShip from './pages/JtShip'
import JtProof from './pages/JtProof'

export default function App() {
  return (
    <>
      <Nav />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/digest" element={<Digest />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/proof" element={<JtProof />} />
          <Route path="/jt/proof" element={<JtProof />} />
          <Route path="/jt/07-test" element={<JtTest />} />
          <Route path="/jt/08-ship" element={<JtShip />} />
        </Routes>
      </main>
    </>
  )
}
