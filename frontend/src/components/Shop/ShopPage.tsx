import React from 'react';
import person from '../../img/IMG_9502_133.png';
import head from '../../img/derevo.png';
import tshort from '../../img/IMG_9502_17.png';
import shoes from '../../img/IMG_9502_50.png';
import bruke from '../../img/IMG_9502_33.png';
import arm from '../../img/IMG_9502_129.png';


interface ShopItems{
    id: number;
    name: string;
    cost: number;
    picture: string;
}
interface Props {
    shopItems: ShopItems[];
    setShopItems: (shopItems: ShopItems[]) => void;
}

const ShopPage: React.FC<Props> = ({setShopItems, shopItems}) => {
    console.log(shopItems);
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
                                <img src={item.picture} alt={item.name} className="image-course--shop"/> 
                            </div>
                            <div className="purchase-info">
                                <span className="price">{item.cost}</span>
                            </div>
                            <div className="purchase-info">
                                <button className="buy-button">Купить</button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <div className="screen__sidebar-new">
                <div className='image-person'>   
                    <img src={shoes} alt="" className='image-shoes'/>
                    <img src={bruke} alt="" className='image-bruke'/>
                    <img src={tshort} alt="" className='image-tshort'/>
                    
                    <img src={person} alt="" className="image-person"/>
                    <img src={head} alt="" className='image-head'/>
                    <img src={arm} alt="" className='image-arm'/>
                </div>
            </div>
        </div>
    </div>
    );
}

export default ShopPage;
