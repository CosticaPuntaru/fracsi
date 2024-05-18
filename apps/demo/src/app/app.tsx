// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link, Route, Routes } from 'react-router-dom';
import { Index } from './routes';
import { VanillaForm } from './routes/vanilla-form';
import { PolarisPage } from './routes/polaris';

export function App() {
  return (
    <div>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">home</Link>
            <Link to="/vanilla-form">Vanilla form</Link>
            <Link to="/polaris">Polaris form</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          Component={Index}
        />
        <Route
          path="/vanilla-form"
          Component={VanillaForm}
        />
        <Route
          path="/polaris"
          Component={PolarisPage}
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
