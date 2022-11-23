import {ReactComponent as OfferIcon} from "../assets/svg/localOfferIcon.svg";
import {ReactComponent as ExploreIcon} from "../assets/svg/exploreIcon.svg";
import {ReactComponent as PersoneOutlineIcon} from "../assets/svg/personOutlineIcon.svg";
import Explore from "../pages/Explore";
import {useLocation, useNavigate} from "react-router-dom";

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()

    const pathMatchRoute = (route) => {
        if (route === location.pathname) {
            return true
        }
    }

    return (
        <footer className='navbar'>
            <nav className='navbarNav'>
                <ul className='navbarListItems'>
                    <li className='navbarListItem'
                        onClick={() => navigate('/')}>
                        <ExploreIcon
                            fill={pathMatchRoute('/') ? '#8f8f8f' : '#2c2c2c'}
                            width='36px'
                            height='36px'/>
                        <p className={pathMatchRoute('/') ?
                            'navbarListItemNameActive' : 'navbarListItemName'}>
                            Explore
                        </p>
                    </li>
                    <li className='navbarListItem' onClick={() => navigate('/offers')}>
                        <OfferIcon
                            fill={pathMatchRoute('/offers') ? '#8f8f8f' : '#2c2c2c'}
                            width='36px'
                            height='36px'/>
                        <p className={pathMatchRoute('/offers') ?
                            'navbarListItemNameActive' : 'navbarListItemName'}>
                            Offers
                        </p>
                    </li>
                    <li className='navbarListItem' onClick={() => navigate('/profile')}>
                        <PersoneOutlineIcon
                            fill={pathMatchRoute('/profile') ? '#8f8f8f' : '#2c2c2c'}
                            width='36px'
                            height='36px'/>
                        <p className={pathMatchRoute('/profile') ?
                            'navbarListItemNameActive' : 'navbarListItemName'}>
                            Profile
                        </p>
                    </li>
                </ul>
            </nav>
        </footer>
    );
}

export default Navbar;