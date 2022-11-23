import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {db} from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {toast} from "react-toastify";
import OAuth from "../components/OAuth";

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const {name, email, password} = formData;

    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
        console.log(name)
        console.log(formData)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            console.log(auth)

            const userCredential = await createUserWithEmailAndPassword(auth, email, password)

            const user = userCredential.user

            await updateProfile(auth.currentUser, {
                displayName: name
            })

            const formDataCopy = {...formData}
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp()

            // Add a new document in collection "users"
            await setDoc(doc(db, "users", user.uid), formDataCopy);

            navigate('/')
        } catch (error) {
            toast.error('Something went wrong with registration')
        }
    }

    return (
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>Welcome Back!</p>
            </header>

            <form onSubmit={onSubmit}>
                <input
                    type='text'
                    className='nameInput'
                    placeholder='   Name'
                    id='name'
                    value={name}
                    onChange={onChange}
                />
                <input
                    type='email'
                    className='emailInput'
                    placeholder='   Email'
                    id='email'
                    value={email}
                    onChange={onChange}
                />

                <div className='passwordInputDiv'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className='passwordInput'
                        placeholder='   Password'
                        id='password'
                        value={password}
                        onChange={onChange}
                    />

                    <img
                        src={visibilityIcon}
                        alt='show password'
                        className='showPassword'
                        onClick={() => setShowPassword((prevState) => !prevState)}
                    />
                </div>

                <Link to='/forgot-password' className='forgotPasswordLink'>
                    Forgot Password
                </Link>

                <div className='signUpBar'>
                    <p className='signUpText'>
                        Sign Up
                    </p>
                    <button className='signUpButton'>
                        <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
                    </button>
                </div>
            </form>

            <OAuth />

            <Link to='/sign-in' className='registerLink signUp'>
                Sign In Instead
            </Link>
        </div>
    );
}

export default SignUp;