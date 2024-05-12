import React, { useEffect, useState } from 'react';
import axiosInstance from '../../http/axios';
import {connect} from 'react-redux';
import Preloader from '../common/preloader/Preloader';
import { setCurrentPage, setTotalCourses} from "../../redux/home-reducer";
import { setShopItems, setUserInventory, setPerson, setPersonId } from '../../redux/home-reducer';
import ShopPage from './MyPerson';
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
    setPersonId: (personId: number[]) => void;
}

const MyPersonPageContainer: React.FC<Props> = ({setShopItems, shopItems, userData, pageSize, setUserInventory, userInventory,setPerson, personData, setPersonId}) => {
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
    const handlePurchase = async (itemId: number, itemType: number) => {
        
        try {
            const data: Partial<PersonData>  = {};
    
            switch (itemType) {
                case 1:
                    data.head = itemId;
                    break;
                case 2:
                    data.shoes = itemId;
                    break;
                case 3:
                    data.bruke = itemId;
                    break;
                case 4:
                    data.tshort = itemId;
                    break;
                case 5:
                    data.arm = itemId;
                    break;
                default:
                    break;
            }
            console.log(data);
            const response = await axiosInstance.put(`/persons/${userData.id}/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.data && response.data.id) {
                setUserInventory([...userInventory, itemId]);
                const updatedPersonDataResponse = await axiosInstance.get(`/persons/${userData.id}`);
                const { head, shoes, bruke, tshort, arm } = updatedPersonDataResponse.data;
                setPerson(head, shoes, bruke, tshort, arm);
            }
        } catch (error) {
            debugger
            console.error('Ошибка при обговлении персонажа:', error);
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
        
    };
}


const MyPersonPageContainerAuth = withAuthorization(MyPersonPageContainer);

export default connect(mapStateToProps, {setShopItems, setCurrentPage, setTotalCourses, setUserInventory, setPerson, setPersonId})(MyPersonPageContainerAuth);

