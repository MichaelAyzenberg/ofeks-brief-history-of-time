import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import BookSelect from './pages/BookSelect';
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
      <ThemeProvider>
      <BookProvider>
        <Routes>
          {/* Book selection — no layout/nav */}
          <Route path="/" element={<BookSelect />} />

          {/* Main app with layout */}
          <Route
            path="/home"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/journey"
            element={
              <Layout>
                <Journey />
              </Layout>
            }
          />
          <Route
            path="/explore"
            element={
              <Layout>
                <ExploreMap />
              </Layout>
            }
          />
          <Route
            path="/concept/:slug"
            element={
              <Layout>
                <ConceptWorld />
              </Layout>
            }
          />
          <Route
            path="/parent"
            element={
              <Layout>
                <ParentMode />
              </Layout>
            }
          />
          <Route
            path="/progress"
            element={
              <Layout>
                <Progress />
              </Layout>
            }
          />
          <Route
            path="/scientists"
            element={
              <Layout>
                <Scientists />
              </Layout>
            }
          />
          <Route
            path="/scientist/:id"
            element={
              <Layout>
                <ScientistPage />
              </Layout>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BookProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
