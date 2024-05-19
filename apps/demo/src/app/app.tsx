// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link, Route, Routes } from 'react-router-dom';
import { Index } from './routes';
import { VanillaForm } from './routes/vanilla-form';
import { PolarisPage } from './routes/polaris';

export function App() {
  return (
    <div>
      <div role="navigation">
        <ul className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto p-4">
          <li>
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">Home</Link>
          </li>
          <li><Link to="/vanilla-form"  className="flex items-center space-x-3 rtl:space-x-reverse">Custom form</Link></li>
          <li><Link to="/polaris"  className="flex items-center space-x-3 rtl:space-x-reverse">Polaris form</Link></li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/fracsi"
          Component={Index}
        />
        <Route
          path="/fracsi/vanilla-form"
          Component={VanillaForm}
        />
        <Route
          path="/fracsi/polaris"
          Component={PolarisPage}
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
