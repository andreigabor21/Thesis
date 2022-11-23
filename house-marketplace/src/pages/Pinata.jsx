import {useState} from 'react';
import FormData from 'form-data';
import axios from 'axios';


function App() {

    const [file, setFile] = useState()
    const [myipfsHash, setIPFSHASH] = useState('')


    const handleFile = async (fileToHandle) => {

        console.log('starting')

        // initialize the form data
        const formData = new FormData()

        // append the file form data to
        formData.append("file", fileToHandle)

        // call the keys from .env

        const API_KEY = process.env.REACT_APP_PINATA_API_KEY
        const API_SECRET = process.env.REACT_APP_PINATA_API_SECRET

        // the endpoint needed to upload the file
        // const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

        // const response = await axios.post(
        //     url,
        //     formData,
        //     {
        //         maxContentLength: "Infinity",
        //         headers: {
        //             "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
        //             'pinata_api_key': API_KEY,
        //             'pinata_secret_api_key': API_SECRET
        //         }
        //     }
        // )

        const JSONBody = {
            name: "name",
            description: "description",
            image: "https://firebasestorage.googleapis.com/v0/b/house-marketplace-app-610bf.appspot.com/o/images%2F1L321xY4JsOCh4Y259pGhIsyOHO2-Capture2.PNG-62a3f5b8-12ac-4cb3-8ce5-0f7972243e34?alt=media&token=9bafe55b-d4b4-4f95-b605-7e7a049214ca"
        }

        const response = await axios
            .post(url,
                JSONBody,
                {
                headers: {
                    pinata_api_key: API_KEY,
                    pinata_secret_api_key: API_SECRET
                }
            })

        console.log(response)

        // get the hash
        setIPFSHASH(response.data.IpfsHash)
    }


    return (
        <div className="App">
            <input type="file" onChange={(event) => setFile(event.target.files[0])}/>
            <button onClick={() => handleFile(file)}>Pin</button>
            {
                //  render the hash
                myipfsHash.length > 0 &&
                <img height='200' src={`https://gateway.pinata.cloud/ipfs/${myipfsHash}`} alt='not loading'/>
            }


        </div>
    );
}

export default App;