import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/DashBoard';
import About from './components/About';
import Discounts from './components/Discounts';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ParentAccount from './components/ParentAccount';
import AppBarAuthParent from './components/AppBarAuthParent';
import AppBarAuthEmployee from './components/AppBarAuthEmployee';
import AppBar from './components/AppBar';
import { AuthProvider, useAuth } from './components/AuthContext';
import CourseDetails from './components/CourseDetails';
import CoursePricing from './components/CoursePricing';
import ReviewsPage from './components/ReviewsPage';
import ParentReviewsPage from './components/ParentReviewsPage';
import EmployeeAccount from './components/EmployeeAccount';
import ManageSignUps from './components/ManageSignUps';
import Notifications from './components/Notifications';
import ParentSignUps from './components/ParentSignUps';
import ManageCoursesList from './components/ManageCoursesList';
import AddCourse from './components/AddCourse';
import ManageReviews from './components/ManageReviews';
import EditCourse from './components/EditCourse';

function App() {

  return (
    <AuthProvider>
      <Router>
        <AppBarWrapper />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/course-pricing" element={<CoursePricing />} />
          <Route path="/parent-account" element={<ParentAccount />} />
          <Route path="/employee-account" element={<EmployeeAccount />} />
          <Route path="/discounts" element={<Discounts />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/manage-course-signups" element={<ManageSignUps />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/parent-reviews" element={<ParentReviewsPage />} />
          <Route path="/manage-course-info" element={<ManageCoursesList />} />
          <Route path="/manage-course-info/add" element={<AddCourse />} />
          <Route path="/manage-course-info/edit/:id" element={<EditCourse />} />
          <Route path="/parent-sign-ups" element={<ParentSignUps />} />
          <Route path="/manage-reviews" element={<ManageReviews />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const AppBarWrapper = () => {
  const { isAuthenticated, userInfo } = useAuth();

  if (isAuthenticated) {
    return userInfo?.userType === 'employee' ? <AppBarAuthEmployee /> : <AppBarAuthParent />;
  }

  return <AppBar />;
};

export default App;
