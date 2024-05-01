import React, { useState } from 'react';
import person from '../../img/IMG_9502_133.png';
import head from '../../img/derevo.png';
import tshort from '../../img/IMG_9502_17.png';
import shoes from '../../img/IMG_9502_50.png';
import bruke from '../../img/IMG_9502_33.png';
import arm from '../../img/IMG_9502_129.png';
import { debugProxyErrorsPlugin } from 'http-proxy-middleware';

interface UserInventory{
    id: number;
    item: number;
    student: number;
}
interface ShopItems{
    id: number;
    name: string;
    cost: number;
    picture: string;
    type: number;
}
interface TypeToImageKey {
    [key: number]: string;
}

interface Props {
    shopItems: ShopItems[];
    setShopItems: (shopItems: ShopItems[]) => void;
    handlePurchase: (itemId: number) => void;
    pageSize: number;
    totalCoursesCount: number;
    userInventory: number[];
    currentPage: number;
    onPageChanged: (pageNumber: number) => void;
}

const typeToImageKey: TypeToImageKey = {
    1: 'head', // Шлемы
    2: 'shoes', // Сапоги
    3: 'bruke', // Штаны
    4: 'tshort', // Броня
    5: 'arm' // Оружие
};
const ShopPage: React.FC<Props> = ({shopItems, handlePurchase,  pageSize, userInventory, totalCoursesCount, currentPage, onPageChanged}) => {
    
    const [images, setImages] = useState({
        head: head,
        shoes: shoes,
        tshort: tshort,
        bruke: bruke,
        arm: arm,
    });
    const handleImageClick = (type: number, newImage: string) => {
        const imageKey = typeToImageKey[type];
        if (imageKey) {
            setImages(prev => ({ ...prev, [imageKey]: newImage }));
        }
    };
    const onNextPageClicked = () => {
        if (currentPage < Math.ceil(totalCoursesCount / pageSize)) {
            const nextPage = currentPage + 1;
            onPageChanged(nextPage);
        }
    }

    const onPreviousPageClicked = () => {
        if (currentPage > 1) {
            const previousPage = currentPage - 1;
            onPageChanged(previousPage);
        }
    }

    let pagesCount = Math.ceil(totalCoursesCount / pageSize);
    let pages = [];

    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }
    const baseUrl = 'http://localhost:8000';
    return (
    <div className='wrapper'>
        <div className="screen card-flex">
            <div className="screen__content-new">
                <div className="grid card__grid">
                    {shopItems && shopItems.map((item) => (
                    <div key={item.id} className="grid__item">
                        <div className="card ">
                            <div className="card__image card__image--shop">
                                <img src={item.picture} alt={item.name} className="image-course--shop"
                                onClick={() => handleImageClick(item.type, item.picture)} /> 
                            </div>
                            <div className="purchase-info">
                                <span className="price">{item.cost}</span>
                            </div>
                            <div className="purchase-info">
                                {userInventory.includes(item.id) ? (
                                    <div>Куплено!</div>
                                ) : (
                                    <button className="buy-button" onClick={() => handlePurchase(item.id)}>Купить</button>
                                )}
                            </div>

                        </div>
                    </div>
                    ))}
                </div>
                <div className="pagination">
                        <span className="pagination__link" onClick={onPreviousPageClicked}>&laquo;</span>
                        {pages.map(p => (
                                <span key={p} className={`pagination__link ${currentPage === p ? 'pagination__link__active' : ''}`}
                                    onClick={() => { onPageChanged(p) }}>{p}</span>
                        ))}
                        <span className="pagination__link" onClick={onNextPageClicked}>&raquo;</span>
                    </div>
            </div>
            <div className="screen__sidebar-new">
                <div className='image-person'>   
                    <img src={images.shoes} alt="" className='image-shoes'/>
                    <img src={images.bruke} alt="" className='image-bruke'/>
                    <img src={images.tshort} alt="" className='image-tshort'/> 
                    <img src={person} alt="" className="image-person"/>
                    <img src={images.head} alt="" className='image-head'/>
                    <img src={images.arm} alt="" className='image-arm'/>
                </div>
            </div>
        </div>
    </div>
    );
}

export default ShopPage;
