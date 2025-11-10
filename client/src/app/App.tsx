import '@/app/styles/main.scss';
import { BrowserRouter } from 'react-router-dom';
import { GlobalContextProvider } from './context/GlobalContext';

function App() {
  return (
    <BrowserRouter>
      <GlobalContextProvider>
        <s-section heading="Greetings!">
          <s-heading>Hello!</s-heading>
        </s-section>
      </GlobalContextProvider>
    </BrowserRouter>
  );
}

export default App;
