import React, { useEffect, useState } from 'react';
import person from '../../img/IMG_9502_133.png';
import head from '../../img/empty.png';
import tshort from '../../img/empty.png';
import shoes from '../../img/empty.png';
import bruke from '../../img/empty.png';
import arm from '../../img/empty.png';
import money from '../../img/money.png';
import { ToastContainer } from 'react-toastify';

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
interface PersonData {
    head: number;
    shoes: number;
    bruke: number;
    tshort: number;
    arm: number;
}

interface UserData {
    id: string;
    balance: string;
}


interface TypeToImageKey {
    [key: number]: string;
}

interface Props {
    shopItems: ShopItems[];
    setShopItems: (shopItems: ShopItems[]) => void;
    handlePurchase: (itemId: number, itemCost: number) => void;
    pageSize: number;
    totalCoursesCount: number;
    userInventory: number[];
    currentPage: number;
    personData: PersonData;
    onPageChanged: (pageNumber: number) => void;
    userData: UserData;
}

const typeToImageKey: TypeToImageKey = {
    1: 'head', // Шлемы
    2: 'shoes', // Сапоги
    3: 'bruke', // Штаны
    4: 'tshort', // Броня
    5: 'arm' // Оружие
};
const ShopPage: React.FC<Props> = ({shopItems, handlePurchase,  pageSize, userInventory, totalCoursesCount, currentPage, onPageChanged, personData, userData}) => {
    const [images, setImages] = useState({
        head: head,
        shoes: shoes,
        tshort: tshort,
        bruke: bruke,
        arm: arm,
    });
    const getImageById = (id: number): string => {
        const item = shopItems.find(item => item.id === id);
        return item ? item.picture : ''; 
    };

    useEffect(() => {
        if (personData) {
            const updatedImages = {
                head: getImageById(personData.head),
                shoes: getImageById(personData.shoes),
                tshort: getImageById(personData.tshort),
                bruke: getImageById(personData.bruke),
                arm: getImageById(personData.arm),
            };
            setImages(updatedImages);
        }
    }, [personData, shopItems]);

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
                                <img src={money} alt="" className='money'/><span className="price money-txt">{item.cost}</span>
                            </div>
                            <div className="purchase-info">
                                {userInventory.includes(item.id) ? (
                                    <div className="buy-button btn-request">Куплено</div>
                                ) : (
                                    (parseInt(userData.balance) >= item.cost) ? (
                                    <button className="buy-button" onClick={() => handlePurchase(item.id, item.cost)}>Купить</button>
                                    ) : (
                                        <div>Не хватает монет</div>
                                    )
                                )}
                            </div>
                            <ToastContainer />
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
                <div className='money'><div className="money-div">Баланс: <img src={money} alt="" className='money'/><div className='price money-txt'>{userData.balance}</div></div></div>
                <div className='image-person'>   
                    <img src={images.shoes} alt="" className='image-shoes'/>
                    <img src={images.bruke} alt="" className='image-bruke'/>
                    <img src={images.tshort} alt="" className='image-tshort'/> 
                    <img src={person} alt="" className="image-person"/>
                    <img src={images.head} alt="" className='image-head-s'/>
                    <img src={images.arm} alt="" className='image-arm-s'/>
                </div>
            </div>
        </div>
    </div>
    );
}

export default ShopPage;
