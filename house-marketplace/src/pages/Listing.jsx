import {getDoc, doc} from "firebase/firestore";
import {db} from "../firebase.config";
import shareIcon from '../assets/svg/shareIcon.svg';
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {getAuth} from "firebase/auth";
import Spinner from "../components/Spinner";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/swiper-bundle.css';
import {ethers} from "ethers";
import SimpleStore_abi from "../utils/abi.json";
import {contractAddress} from "../utils/ethereum";
import {toast} from "react-toastify";
import axios from "axios";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Listing() {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);

    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [metadataURL, setMetadataURL] = useState('');

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            }
        }

        fetchListing()
    }, [navigate, params.listingId])

    useEffect(() => {
        const mint = async (url) => {
            if (metadataURL !== '') {
                console.log("Minting: ", url)
                await contract.mint(url)
            }
        }
        mint(metadataURL)
    }, [metadataURL])

    if (loading) {
        return <Spinner/>
    }

    const buyListing = () => {
        console.log("Buy with Ethereum")
        connectWalletHandler()
        console.log(account)
        transfer()
    }

    const transfer = async () => {
        const amount = listing.offer ? listing.discountedPrice : listing.regularPrice
        console.log(amount)
        const overrides = {
            value: ethers.utils.parseEther(amount)
        }
        console.log(listing.ethereumAddress, overrides)

        // send ETH
        await contract.sendViaCall(listing.ethereumAddress, overrides)
        console.log('Transfer was successful')

        //put to ipfs
        await handleFile()

        //mint NFT
        // await contract.mint(metadataURL)
    }

    const handleFile = async () => {
        console.log('starting')
        const API_KEY = process.env.REACT_APP_PINATA_API_KEY
        const API_SECRET = process.env.REACT_APP_PINATA_API_SECRET

        // the endpoint needed to upload
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

        const metadata = {
            name: listing.name,
            description: listing.type,
            image: listing.imageUrls[0],
            attributes: [
                {
                    display_type: "number",
                    trait_type: "Bathrooms",
                    value: listing.bathrooms
                },
                {
                    display_type: "number",
                    trait_type: "Bedrooms",
                    value: listing.bedrooms
                },
                {
                    trait_type: "Furnished",
                    value: listing.furnished ? "Yes" : "No"
                },
                {
                    trait_type: "Location",
                    value: listing.location
                },
                {
                    trait_type: "Parking",
                    value: listing.parking ? "Yes" : "No"
                }
            ]
        }

        const response = await axios
            .post(url,
                metadata,
                {
                    headers: {
                        pinata_api_key: API_KEY,
                        pinata_secret_api_key: API_SECRET
                    }
                })

        console.log("response.data.IpfsHash", response.data.IpfsHash)
        setMetadataURL(`https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`)
        console.log(metadataURL)
    }

    const connectWalletHandler = async () => {
        console.log(listing)
        if (window.ethereum) {
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            accountChangedHandler(accounts[0]);
        } else {
            toast.error('Need to install Metamask!')
        }
    }

    const accountChangedHandler = (account) => {
        setAccount(account)
        updateEthers()
    }

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(tempProvider)

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner)

        let tempContract = new ethers.Contract(contractAddress, SimpleStore_abi, tempSigner)
        setContract(tempContract)
    }

    return (
        <main>
            <Swiper slidesPerView={1} pagination={{clickable: true}} navigation>
                {listing.imageUrls.map((url, index) => (
                    <SwiperSlide key={index} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <img src={url} alt={index.toString()} width="100%"/>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {shareLinkCopied &&
                <p className='linkCopied'>Link Copied</p>}

            <div className='listingDetails'>
                <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                    <p className='listingName'>
                        {listing.name} - ${listing.offer ? listing.discountedPrice : listing.regularPrice}
                    </p>

                    <div className='shareIconDiv' onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        setShareLinkCopied(true)
                        setTimeout(() => {
                            setShareLinkCopied(false)
                        }, 2000)
                    }}>
                        <img src={shareIcon} alt="share"/>
                    </div>
                </div>
                <p className='listingLocation'>
                    {listing.location}
                </p>
                <p className='listingType'>
                    For {listing.type === 'house' ? 'House' : 'Apartment'}
                </p>
                {listing.offer && (
                    <p className='discountPrice'>
                        ${listing.regularPrice - listing.discountedPrice} discount
                    </p>
                )}

                <ul className='listingDetailsList'>
                    <li>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                    </li>
                    <li>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
                    </li>
                    <li>
                        {listing.parking && 'Parking spot'}
                    </li>
                    <li>
                        {listing.furnished && 'Furnished'}
                    </li>
                    <br/>
                    <li>
                        {listing.ethereumAddress && `Payment Address: ${listing.ethereumAddress}`}
                    </li>
                </ul>

                <p className='listingLocationTitle'>Location</p>

                <div className='leafletContainer'>
                    <MapContainer style={{height: '75%', width: '70%'}}
                                  center={[listing.geolocation.lat, listing.geolocation.lng]}
                                  zoom={13} scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                        />

                        <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                            <Popup>{listing.location}</Popup>
                        </Marker>
                    </MapContainer>
                </div>

                <button className='connectWalletButton' onClick={connectWalletHandler}>
                    Connect Wallet
                </button>
                <br/>
                {auth.currentUser?.uid !== listing.userRef && account !== null && (
                    <button className='primaryButton' onClick={buyListing}>
                        Buy with Ethereum
                    </button>
                )}
                <br/>
                {auth.currentUser?.uid !== listing.userRef && (
                    <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                          className='primaryButton'>
                        Contact Landlord
                    </Link>
                )}
            </div>

        </main>
    );
}

export default Listing;