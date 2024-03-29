import React from 'react';
import loader from "../../../img/loader.svg";

const Preloader = () => {
    return (
    <div className="fetching">
        <img src ={loader} className="fetching__img"/>
    </div>
    );
}

export default Preloader;