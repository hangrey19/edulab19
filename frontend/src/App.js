import './App.scss';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import HomeTemplate from './containers/HomeTemplate';
import ClassroomTemplate from './containers/ClassroomTemplate';
import PageNotFound from "./containers/PageNotFound.jsx";
import { routeHome, routeClassroom, routeAuthIntro } from "./routes";
import AuthIntroTemplate from './containers/AuthIntroTemplate';
import Intro from './containers/AuthIntroTemplate/Intro';

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
        {/* Điều hướng mặc định đến trang Intro với hash #about-us */}
        <Route path="/" element={<Navigate to="/intro#about-us" replace />} />
        
        {/* Tạo route rõ ràng cho intro để luôn có thể truy cập */}
        <Route path="/intro" element={<Intro />} />
        
        {/* Các routes khác */}
        {showLayoutAuthIntro(routeAuthIntro)}
        {showLayoutHome(routeHome)}
        {showLayoutClassroom(routeClassroom)}
        
        {/* Trang không tìm thấy */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;