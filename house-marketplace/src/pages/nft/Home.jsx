// import { useEffect } from "react";
// import { useMoralis } from "react-moralis";
// import {useNavigate} from "react-router-dom";
//
// export default function Home() {
//     const { authenticate, isAuthenticated, logout } = useMoralis();
//
//     // const router = useRouter();
//     const navigate = useNavigate()
//
//     useEffect(() => {
//         if (isAuthenticated) {
//             console.log(authenticate, isAuthenticated)
//             navigate("/dashboard")
//         }
//     }, [isAuthenticated]);
//
//     return (
//         <div className="flex w-screen h-screen items-center justify-center">
//             <button
//                 onClick={authenticate}
//                 className="bg-yellow-300 px-8 py-5 rounded-xl text-lg animate-pulse"
//             >
//                 Login using MetaMask
//             </button>
//         </div>
//     );
// }