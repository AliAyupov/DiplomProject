import React, { useEffect, useState } from 'react';
import axiosInstance from '../../http/axios';
import {connect} from 'react-redux';
import Preloader from '../common/preloader/Preloader';
import { useParams } from 'react-router-dom';
import { setCourse, setShopItems } from '../../redux/home-reducer';
import ShopPage from './ShopPage';
import { withAuthorization } from '../hoc/AuthRedirect';


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

const CoursePageContainer: React.FC<Props> = ({setShopItems, shopItems}) => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchShopItems = async () => {
            try {
                const response = await axiosInstance.get(`/shop-items/`);
                setShopItems(response.data.results);
            } catch (error) {
                console.error('Ошибка при загрузке магазина:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShopItems();
    }, [setShopItems]);

    if (isLoading) {
        return <Preloader/>;
    }
    return (
        <ShopPage setShopItems={setShopItems} shopItems={shopItems}/>
    );
}

const mapStateToProps = (state: any) => {
    return {
        userData: state.auth.userData,
        isAuthenticated: state.auth.isAuthenticated,
        shopItems: state.homePage.shopItems,
    };
}


const CoursePageContainerAuth = withAuthorization(CoursePageContainer);

export default connect(mapStateToProps, {setShopItems})(CoursePageContainer);

