import { Navigate, Route, Routes } from 'react-router-dom';
import Splash from './ui/screens/Splash';
import Login from './ui/screens/Login';
import Home from './ui/screens/Home';
import CharacterList from './ui/screens/CharacterList';
import VersionBadge from './ui/components/VersionBadge';
import WizardShell from './ui/wizard/WizardShell';
import FichaShell from './ui/ficha/FichaShell';
import PrototipoShell from './ui/prototipo/PrototipoShell';
import PrototipoCenaShell from './ui/prototipo/PrototipoCenaShell';
import { RollProvider } from './ui/roll/RollContext';
import RollOverlay from './ui/roll/RollOverlay';

export default function App() {
  return (
    <RollProvider>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/lista" element={<CharacterList />} />
        <Route path="/wizard" element={<WizardShell />} />
        <Route path="/ficha/:id" element={<FichaShell />} />
        <Route path="/prototipo" element={<PrototipoShell />} />
        <Route path="/prototipo/:cenaId" element={<PrototipoCenaShell />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <VersionBadge />
      <RollOverlay />
    </RollProvider>
  );
}
