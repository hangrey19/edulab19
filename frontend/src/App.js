import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeTemplate from './containers/HomeTemplate';
import ClassroomTemplate from './containers/ClassroomTemplate';
import PageNotFound from "./containers/PageNotFound.jsx";
import { routeHome, routeClassroom, routeAuthIntro } from "./routes";
import AuthIntroTemplate from './containers/AuthIntroTemplate';

function App() {
  const showLayoutAuthIntro = (routes) => {
    if (routes && routes.length > 0) {
      return routes.map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={<AuthIntroTemplate Component={item.component} />}
        />
      ));
    }
  };

  const showLayoutHome = (routes) => {
    if (routes && routes.length > 0) {
      return routes.map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={<HomeTemplate Component={item.component} />}
        />
      ));
    }
  };

  const showLayoutClassroom = (routes) => {
    if (routes && routes.length > 0) {
      return routes.map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={<ClassroomTemplate Component={item.component} />}
        />
      ));
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {showLayoutAuthIntro(routeAuthIntro)}
        {showLayoutHome(routeHome)}
        {showLayoutClassroom(routeClassroom)}
        {/* Thêm route cho trang không tìm thấy */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
