import './App.scss';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useCallback } from 'react';
import HomeTemplate from './containers/HomeTemplate';
import ClassroomTemplate from './containers/ClassroomTemplate';
import PageNotFound from "./containers/PageNotFound.jsx";
import { routeHome, routeClassroom, routeAuthIntro } from "./routes";
import AuthIntroTemplate from './containers/AuthIntroTemplate';
import Intro from './containers/AuthIntroTemplate/Intro';

// Tạo một hàm chung để render routes, tránh code trùng lặp
const renderRoutes = (routes, LayoutComponent) => {
  if (!routes?.length) return null;
  
  return routes.map((item, index) => (
    <Route
      key={`${item.path}-${index}`}
      path={item.path}
      element={<LayoutComponent Component={item.component} />}
    />
  ));
};

function App() {
  // Sử dụng useCallback để tối ưu performance
  const showLayoutAuthIntro = useCallback((routes) => {
    return renderRoutes(routes, AuthIntroTemplate);
  }, []);

  const showLayoutHome = useCallback((routes) => {
    return renderRoutes(routes, HomeTemplate);
  }, []);

  const showLayoutClassroom = useCallback((routes) => {
    return renderRoutes(routes, ClassroomTemplate);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Điều hướng mặc định đến trang Intro với hash #about-us */}
        <Route 
          path="/" 
          element={<Navigate to="/intro#about-us" replace />} 
        />
        
        {/* Tạo route rõ ràng cho intro để luôn có thể truy cập */}
        <Route 
          path="/intro" 
          element={<Intro />} 
        />
        
        {/* Các routes khác */}
        {showLayoutAuthIntro(routeAuthIntro)}
        {showLayoutHome(routeHome)}
        {showLayoutClassroom(routeClassroom)}
        
        {/* Trang không tìm thấy */}
        <Route 
          path="*" 
          element={<PageNotFound />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;