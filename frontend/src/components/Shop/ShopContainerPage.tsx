import React, { useEffect, useState } from 'react';
import axiosInstance from '../../http/axios';
import {connect} from 'react-redux';
import Preloader from '../common/preloader/Preloader';
import { setCurrentPage, setTotalCourses} from "../../redux/home-reducer";
import { setShopItems, setUserInventory, setPerson } from '../../redux/home-reducer';
import { setUserData } from '../../redux/auth-reducer';
import ShopPage from './ShopPage';
import { withAuthorization } from '../hoc/AuthRedirect';


interface UserData {
    id: string;
    balance: string;
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

interface Props { 
    pageSize: number;
    shopItems: ShopItems[];
    userInventory: number[];
    userData: UserData;
    personData: PersonData;
    setShopItems: (shopItems: ShopItems[]) => void;
    setUserInventory: (inventoryIds: number[]) => void;
    setPerson: (head: string, shoes: string, bruke: string, tshort: string, arm: string) => void;
    setUserData: (email: string, id: string, login: string, picture: string, role:string, isAuthenticated: boolean, userData:any) => void;
}

const ShopPageContainer: React.FC<Props> = ({setShopItems, shopItems, userData, pageSize, setUserInventory, setUserData, userInventory,setPerson, personData}) => {
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
        const fetchPersonData = async () => {
            try {
                const response = await axiosInstance.get(`/persons/${userData.id}`);
                const { head, shoes, bruke, tshort, arm } = response.data;
                setPerson(head, shoes, bruke, tshort, arm);
        
            } catch (error) {
                console.error('Ошибка при загрузке данных пользователя:', error);
            }
        };
    
        fetchPersonData();
    }, [userData.id, setPerson]);

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
    const handlePurchase = async (itemId: number, itemCost: number) => {
        try {
            const response = await axiosInstance.post(`/student-inventory/`, {
                item: itemId,
                student: userData.id
            });
            if (response.data && response.data.id) {
                const currentBalance = userData.balance;
                const newBalance = parseInt(currentBalance) - itemCost;

                const userUpdateResponse = await axiosInstance.put(`/custom-users/${userData.id}/`, {
                    balance: newBalance
                });
                setUserData(userUpdateResponse.data.email, userUpdateResponse.data.id, userUpdateResponse.data.username, userUpdateResponse.data.picture, userUpdateResponse.data.role, true, userUpdateResponse.data);
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
        personData={personData}
        userData={userData}
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
        userInventory: state.homePage.userInventory,
        personData: state.homePage.personData,
	    setUserData: state.auth.setUserData,
    };
}


const ShopPageContainerContainerAuth = withAuthorization(ShopPageContainer);

export default connect(mapStateToProps, {setShopItems, setCurrentPage, setTotalCourses, setUserInventory, setPerson, setUserData})(ShopPageContainerContainerAuth);

