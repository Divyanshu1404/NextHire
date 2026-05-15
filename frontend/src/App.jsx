import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useAuthBootstrap } from './hooks/useAuthBootstrap';
import Loader from './components/ui/Loader';

function App() {
  const isInitializing = useAuthBootstrap();

  if (isInitializing) {
    return <Loader fullScreen />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
