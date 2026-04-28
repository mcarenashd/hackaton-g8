import { useState } from 'react';
import ScreenSplash from './screens/ScreenSplash';
import ScreenSituacion from './screens/ScreenSituacion';
import ScreenRecursos from './screens/ScreenRecursos';
import ScreenPlan from './screens/ScreenPlan';
import ScreenValidacion from './screens/ScreenValidacion';
import ScreenKit from './screens/ScreenKit';

export default function App() {
  const [screen, setScreen] = useState(0);
  const [situacion, setSituacion] = useState({
    agua: '',
    customAgua: '',
    urgencia: '',
    personas: '',
  });
  const [recursos, setRecursos] = useState([]);
  const [customRecursos, setCustomRecursos] = useState('');
  const [plan, setPlan] = useState(null);

  const screens = [
    <ScreenSplash onNext={() => setScreen(1)} />,
    <ScreenSituacion
      value={situacion}
      onChange={setSituacion}
      onNext={() => setScreen(2)}
      onBack={() => setScreen(0)}
    />,
    <ScreenRecursos
      value={recursos}
      onChange={setRecursos}
      customRecursos={customRecursos}
      onChangeCustom={setCustomRecursos}
      situacion={situacion}
      onNext={(planData) => {
        setPlan(planData);
        setScreen(3);
      }}
      onBack={() => setScreen(1)}
    />,
    <ScreenPlan
      plan={plan}
      situacion={situacion}
      recursos={recursos}
      onValidar={() => setScreen(4)}
      onKit={() => setScreen(5)}
      onBack={() => setScreen(2)}
    />,
    <ScreenValidacion onNext={() => setScreen(5)} onBack={() => setScreen(3)} />,
    <ScreenKit
      plan={plan}
      recursos={recursos}
      onReset={() => setScreen(0)}
      onBack={() => setScreen(3)}
    />,
  ];

  return (
    <div className="phone-wrap">
      <div className="phone">{screens[screen]}</div>
    </div>
  );
}
