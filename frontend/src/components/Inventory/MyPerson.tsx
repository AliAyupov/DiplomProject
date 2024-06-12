import React, { useEffect, useState } from 'react';
import person from '../../img/IMG_9502_133.png';
import head from '../../img/empty.png';
import tshort from '../../img/empty.png';
import shoes from '../../img/empty.png';
import bruke from '../../img/empty.png';
import arm from '../../img/empty.png';
import sad from '../../img/sad.png';


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
interface TypeToImageKey {
    [key: number]: string;
}

interface Props {
    shopItems: ShopItems[];
    setShopItems: (shopItems: ShopItems[]) => void;
    handlePurchase: (itemId: number, itemType: number) => void;
    pageSize: number;
    totalCoursesCount: number;
    userInventory: number[];
    currentPage: number;
    personData: PersonData;
    onPageChanged: (pageNumber: number) => void;
}

const typeToImageKey: TypeToImageKey = {
    1: 'head', // Шлемы
    2: 'shoes', // Сапоги
    3: 'bruke', // Штаны
    4: 'tshort', // Броня
    5: 'arm' // Оружие
};
const MyPerson: React.FC<Props> = ({shopItems, handlePurchase,  pageSize, userInventory, totalCoursesCount, currentPage, onPageChanged, personData}) => {
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
        if (currentPage < Math.ceil(userInventory.length / pageSize)) {
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

    let pagesCount = Math.ceil(userInventory.length / pageSize);
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
                        userInventory.includes(item.id) ? (
                        <div key={item.id} className="grid__item">
                        <div className="card"  onClick={() => handleImageClick(item.type, item.picture)}>
                            <div className="card__image card__image--shop" onClick={() => handlePurchase(item.id, item.type)}>
                                <img src={item.picture} alt={item.name} className="image-course--shop"
                                /> 
                            </div>
                            {personData && (personData.head === item.id || personData.shoes === item.id || personData.arm === item.id || personData.bruke === item.id || personData.tshort === item.id) ? (
                                <div className="purchase-info"  onClick={() => handlePurchase(0, item.type)}>
                                <button className="buy-button">Снять</button>
                            </div>
                            ) : (
                                <div className="purchase-info"  onClick={() => handlePurchase(item.id, item.type)}>
                                    <button className="buy-button">Надеть</button>
                                </div>
                            )}
                        </div>
                        </div>
                        ):(
                            null
                        )
                    ))}
                </div>
                
                {userInventory.length > 0 ? (
                <div className="pagination">
                        <span className="pagination__link" onClick={onPreviousPageClicked}>&laquo;</span>
                        {pages.map(p => (
                                <span key={p} className={`pagination__link ${currentPage === p ? 'pagination__link__active' : ''}`}
                                    onClick={() => { onPageChanged(p) }}>{p}</span>
                        ))}
                        <span className="pagination__link" onClick={onNextPageClicked}>&raquo;</span>
                </div>
                ) : (
                    <div className='center'> <div className='dd'>Инвентарь пока что пустой.</div> <img src={sad} className='sad'/> </div>
                )}

            </div>
            <div className="screen__sidebar-new">
                <div className='image-person'>   
                    <img src={images.shoes} alt="" className='image-shoes'/>
                    <img src={images.bruke} alt="" className='image-bruke'/>
                    <img src={images.tshort} alt="" className='image-tshort'/> 
                    <img src={person} alt="" className="image-person persic"/>
                    <img src={images.head} alt="" className='image-head'/>
                    <img src={images.arm} alt="" className='image-arm'/>
                </div>
            </div>
        </div>
    </div>
    );
}

export default MyPerson;
