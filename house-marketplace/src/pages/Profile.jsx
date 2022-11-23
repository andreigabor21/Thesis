import {getAuth, updateProfile} from "firebase/auth";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {updateDoc, deleteDoc, doc, collection, query, where, orderBy, getDocs} from 'firebase/firestore'
import {db} from "../firebase.config";
import {toast} from "react-toastify";
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from "../components/ListingItem";

function Profile() {
    const auth = getAuth()

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    });

    const {name, email} = formData

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef,
                where('userRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc')
            )
            const querySnap = await getDocs(q)

            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
        }

        fetchUserListings()
    }, [auth.currentUser.uid])

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                // Update display name in auth
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
                // Update in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {name})
            }
        } catch (error) {
            toast.error('Could not update profile details')
        }
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
            await deleteDoc(doc(db, 'listings', listingId))

            const updatedListings = listings
                .filter(listing => listing.id !== listingId)
            setListings(updatedListings)

            toast.success('Successfully deleted!')
        }
    }

    const onEdit = (id) => {
        navigate(`/edit-listing/${id}`)
    }

    return (
        <div className='profile'>
            <header className='profileHeader'>
                <p className='pageHeader'>
                    My Profile
                </p>
                <button type='button' className='logOut' onClick={onLogout}>
                    Logout
                </button>
            </header>

            <main>
                <div className="profileDetailsHeader">
                    <p className='profileDetailsText'>
                        Personal Details
                    </p>
                    <p className="changePersonalDetails" onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails(prevState => !prevState)
                    }}>
                        {changeDetails ? 'done' : 'change'}
                    </p>
                </div>

                <div className='profileCard'>
                    <form>
                        <input type="text" id='name'
                               className={!changeDetails ? 'profileName' : 'profileNameActive'}
                               disabled={!changeDetails} value={name}
                               onChange={onChange}
                        />
                        <input type="text" id='email'
                               className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                               disabled={!changeDetails} value={email}
                               onChange={onChange}
                        />
                    </form>
                </div>

                <Link to='/create-listing' className='createListing'>
                    <img src={homeIcon} alt="home"/>
                    <p>List a new house / apartment for sale</p>
                    <img src={arrowRight} alt="arrow"/>
                </Link>

                {
                    (!loading && listings?.length > 0) ? (
                            <>
                                <p className='listingText'>Your listings</p>
                                <ul className='listingsList'>
                                    {
                                        listings.map(listing =>
                                            <ListingItem key={listing.id}
                                                         listing={listing.data}
                                                         id={listing.id}
                                                         onEdit={() => onEdit(listing.id)}
                                                         onDelete={() => onDelete(listing.id)}
                                            />)
                                    }
                                </ul>
                            </>
                        ) :
                        <>
                            <p className='listingText'>No listings to show</p>
                        </>
                }
            </main>
        </div>
    )
}

export default Profile;
