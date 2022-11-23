import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import SimpleStore from "./pages/SimpleStore";
import EditListing from "./pages/EditListing";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Pinata from "./pages/Pinata";


function App() {
  return (
    <>
        <Router>
            <ResponsiveAppBar />
            <Routes>
                <Route path='/' element={<Explore />} />
                <Route path='/pinata' element={<Pinata />} />
                <Route path='/eth' element={<SimpleStore />} />
                <Route path='/offers' element={<Offers />} />
                <Route path='/category/:categoryName' element={<Category />} />
                <Route path='/profile' element={<PrivateRoute />}>
                    <Route path='/profile' element={<Profile />} />
                </Route>
                <Route path='/sign-in' element={<SignIn />} />
                <Route path='/sign-up' element={<SignUp />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/create-listing' element={<CreateListing />} />
                <Route path='/edit-listing/:listingId' element={<EditListing />} />
                <Route path='/category/:categoryName/:listingId' element={<Listing />} />
                <Route path='/contact/:landlordId' element={<Contact />} />
            </Routes>
            {/*<Navbar />*/}
        </Router>
        <ToastContainer />
    </>
  );
}

export default App;
