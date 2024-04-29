const SET_COURSES = 'SET_COURSES';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const SET_TOTAL_COURSES_COUNT = 'SET_TOTAL_COURSES_COUNT';
const TOGGLE_PRELOADER = 'TOGGLE_PRELOADER';
const SET_COURSE = 'SET_COURSE';
const SET_MODULES = 'SET_MODULES';
const SET_MODULES_COUNT = 'SET_MODULES_COUNT';
const SET_LESSONS_COUNT = 'SET_LESSONS_COUNT';
const SET_LESSONS = 'SET_LESSONS';
const SET_COURSE_NAME = 'SET_COURSE_NAME';
const SET_COURSE_DESCRIPTION = 'SET_COURSE_DESCRIPTION';
const SET_IMAGES = 'SET_IMAGES';
const SET_MODULE = 'SET_MODULE';
const SET_ENROLL = 'SET_ENROLL';
const SET_PROGRESS = 'SET_PROGRESS';
const SET_SHOP_ITEMS = 'SET_SHOP_ITEMS';

interface Lesson {
    id: string;
    image: string;
    lesson_name:string;
}
interface Action {
    courseName: string;
    description: string;
    picture: string;
    type: string;
    courses: any;
    usersData: any;
    currentPage: number;
    totalCoursesCount: number;
    isFetching: boolean;
    course: any;
    module:any;
    modules: any;
    modulesCount: number;
    lessonsCount: number;
    lessons: Lesson[];
    shopItems: any;
    enrollments: any;
}

interface State {
    courses: any[];
    modules: any[]; 
    shopItems: any[];
    pageSize: number;
    totalCoursesCount: number;
    currentPage: number;
    isFetching: boolean;
    course: any;
    module: any;
    modulesCount: number;
    lessonsCount: number;
    lessons: Lesson[]; 
    courseName: string; 
    description: string;
    picture: string;
    usersData:any[];
    enrollments: any[]; 
}

const initialState: State = {
    courses: [],
    modules: [],
    usersData: [],
    enrollments: [],
    shopItems: [],
    pageSize: 18,
    totalCoursesCount: 0,
    modulesCount: 0, 
    currentPage: 1,
    isFetching: false,
    course: null,
    module:null,
    lessonsCount: 0,
    lessons: [],
    courseName: '', 
    description: '',
    picture: '',
}

const homeReducer = (state: State = initialState, action: Action): State => {
    switch(action.type) {
        case SET_COURSES:
            return { ...state, courses: action.courses};
        case SET_CURRENT_PAGE:
            return { ...state, currentPage: action.currentPage};
        case SET_TOTAL_COURSES_COUNT:
            return {...state, totalCoursesCount: action.totalCoursesCount};
        case TOGGLE_PRELOADER:
            return {...state, isFetching: action.isFetching};
        case SET_COURSE:
            return {...state, course: [action.course]};
        case SET_MODULES:
            return {...state, modules: action.modules};
        case SET_MODULES_COUNT:
            return {...state, modulesCount: action.modulesCount}; 
        case SET_LESSONS_COUNT:
            return { ...state, lessonsCount: action.lessonsCount }; 
        case SET_LESSONS:
            return { ...state, lessons: action.lessons }; 
        case SET_COURSE_NAME:
            return {...state, courseName: action.courseName }; 
        case SET_COURSE_DESCRIPTION:
            return {...state, description: action.description };   
        case SET_IMAGES:
            return {...state, picture: action.picture};
        case SET_MODULE:
            return {...state, modules: [...state.modules, action.module]};
        case SET_ENROLL:
            return { ...state, enrollments: action.enrollments };
        case SET_PROGRESS:
            return { ...state, usersData: action.usersData};
        case SET_SHOP_ITEMS:
            return { ...state, shopItems: action.shopItems};
        default:
            return state;
    }
}

export const setCourses = (courses: any) => ({ type: SET_COURSES, courses });
export const setProgress = (usersData: any) => ({ type: SET_PROGRESS, usersData });
export const setCurrentPage = (currentPage: number) => ({ type: SET_CURRENT_PAGE, currentPage:currentPage });
export const setTotalCourses = (totalCoursesCount: number) => ({ type: SET_TOTAL_COURSES_COUNT, totalCoursesCount:totalCoursesCount });
export const togglePreloader = (isFetching: boolean) => ({type: TOGGLE_PRELOADER, isFetching:isFetching });
export const setCourse = (course:any) => ({type: SET_COURSE, course});
export const setModules = (modules: any) => ({ type: SET_MODULES, modules });
export const setModulesCount = (modulesCount: number) => ({ type: SET_MODULES_COUNT, modulesCount });
export const setLessonsCount = (lessonsCount: number) => ({ type: SET_LESSONS_COUNT, lessonsCount });
export const setLessons = (lessons: Lesson[]) => ({ type: SET_LESSONS, lessons });
export const setCourseName = (courseName: string) => ({ type: SET_COURSE_NAME, courseName });
export const setCourseDescription = (description: string) => ({ type: SET_COURSE_DESCRIPTION, description });
export const setImages = (picture: string) => ({ type: SET_IMAGES, picture: picture });
export const setModule = (module: any) => ({ type: SET_MODULE, module });
export const setEnroll = (enrollments: any[]) => ({
    type: SET_ENROLL,
    enrollments
});
export const setShopItems = (shopItems: any) => ({ type: SET_SHOP_ITEMS, shopItems });

export default homeReducer;