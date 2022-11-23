import React from 'react';
import apartmentImage from '../assets/jpg/rentCategoryImage.jpg'
import houseImage from '../assets/jpg/sellCategoryImage.jpg'
import {Link} from "react-router-dom";
import Slider from "../components/Slider";

function Explore() {
    return (
        <div className='explore'>
            <header>
                <p className='pageHeader'>
                    Explore
                </p>
            </header>

            <main>
                <Slider />

                <p className='exploreCategoryHeading'>
                    Categories
                </p>
                <div className='exploreCategories'>
                    <Link to='/category/apartment'>
                        <img src={apartmentImage} alt="apartment" className='exploreCategoryImg'/>
                        <p className='exploreCategoryName'>Apartments</p>
                    </Link>
                    <Link to='/category/house'>
                        <img src={houseImage} alt="house" className='exploreCategoryImg'/>
                        <p className='exploreCategoryName'>Houses</p>
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default Explore;