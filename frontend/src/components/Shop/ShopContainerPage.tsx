import React, { useEffect, useState } from 'react';
import axiosInstance from '../../http/axios';
import {connect} from 'react-redux';
import Preloader from '../common/preloader/Preloader';
import { setCurrentPage, setTotalCourses} from "../../redux/home-reducer";
import { setShopItems, setUserInventory } from '../../redux/home-reducer';
import ShopPage from './ShopPage';
import { withAuthorization } from '../hoc/AuthRedirect';

interface UserInventory{
    id: number;
    item: number;
    student: number;
}

interface UserData {
    id: string;
}

interface ShopItems{
    id: number;
    name: string;
    cost: number;
    picture: string;
    type: number;
}


interface Props { 
    pageSize: number;
    shopItems: ShopItems[];
    userInventory: number[];
    userData: UserData;
    setShopItems: (shopItems: ShopItems[]) => void;
    setUserInventory: (inventoryIds: number[]) => void;
}

const CoursePageContainer: React.FC<Props> = ({setShopItems, shopItems, userData, pageSize, setUserInventory, userInventory}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [totalCoursesCount, setTotalCoursesCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const userId = userData.id;
                const response = await axiosInstance.get(`/student-inventory/?user_id=${userId}`);
            
                if (response.data && response.data.results) {
                    const inventoryIds = response.data.results.map((item: { item: number; }) => item.item);
                    setUserInventory(inventoryIds);
                    
                } else {
                    setUserInventory([]);
                }
            } catch (error) {
                console.error('Ошибка при загрузке инвентаря:', error);
            }
        };
    
        fetchInventory();
    }, [setUserInventory]);

    useEffect(() => {
        const fetchShopItems = async () => {
            try {
                const response = await axiosInstance.get(`/shop-items/?page=${currentPage}&count=${pageSize}`);
                setShopItems(response.data.results);
                setTotalCoursesCount(response.data.count);
                
            } catch (error) {
                console.error('Ошибка при загрузке магазина:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShopItems();
    }, [currentPage, pageSize, setShopItems]);

    const onPageChanged = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }
    const handlePurchase = async (itemId: number) => {
        try {
            const response = await axiosInstance.post(`/student-inventory/`, {
                item: itemId,
                student: userData.id
            });
            if (response.data && response.data.id) {
                setUserInventory([...userInventory, itemId]);
            }
        } catch (error) {
            console.error('Ошибка при добавлении в инвентарь:', error);
        }
    };

    if (isLoading) {
        return <Preloader/>;
    }
    return (
        <ShopPage 
        pageSize={pageSize}
        totalCoursesCount={totalCoursesCount}
        currentPage={currentPage}
        onPageChanged={onPageChanged}  
        setShopItems={setShopItems} 
        shopItems={shopItems} 
        handlePurchase={handlePurchase}
        userInventory={userInventory}
        />
    );
}

const mapStateToProps = (state: any) => {
    return {
        userData: state.auth.userData,
        isAuthenticated: state.auth.isAuthenticated,
        shopItems: state.homePage.shopItems,
        pageSize : state.homePage.pageSize,
        totalCoursesCount : state.homePage.totalCoursesCount,
        currentPage: state.homePage.currentPage,
        userInventory: state.homePage.userInventory
    };
}


const CoursePageContainerAuth = withAuthorization(CoursePageContainer);

export default connect(mapStateToProps, {setShopItems, setCurrentPage, setTotalCourses, setUserInventory})(CoursePageContainerAuth);

