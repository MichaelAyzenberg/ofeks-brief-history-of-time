import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Journey from './pages/Journey';
import ExploreMap from './pages/ExploreMap';
import ConceptWorld from './pages/ConceptWorld';
import ParentMode from './pages/ParentMode';
import Progress from './pages/Progress';
import ScientistPage from './pages/ScientistPage';
import Scientists from './pages/Scientists';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/explore" element={<ExploreMap />} />
          <Route path="/concept/:slug" element={<ConceptWorld />} />
          <Route path="/parent" element={<ParentMode />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/scientists" element={<Scientists />} />
          <Route path="/scientist/:id" element={<ScientistPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
