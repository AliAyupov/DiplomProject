const SET_COURSES = 'SET_COURSES';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const SET_TOTAL_COURSES_COUNT = 'SET_TOTAL_COURSES_COUNT';
const TOGGLE_PRELOADER = 'TOGGLE_PRELOADER';

interface Action {
    type: string;
    courses: any;
    currentPage: number;
    totalCoursesCount: number;
    isFetching: boolean;
}

interface State {
    courses: any[];
    pageSize: number;
    totalCoursesCount: number;
    currentPage: number;
    isFetching: boolean;
}

const initialState: State = {
    courses: [],
    pageSize: 6,
    totalCoursesCount: 0,
    currentPage: 1,
    isFetching: false
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
        default:
            return state;
    }
}

export const setCourseAC = (courses: any) => ({ type: SET_COURSES, courses });
export const setCurrentPageAC = (currentPage: number) => ({ type: SET_CURRENT_PAGE, currentPage:currentPage });
export const setTotalCoursesAC = (totalCoursesCount: number) => ({ type: SET_TOTAL_COURSES_COUNT, totalCoursesCount:totalCoursesCount });
export const togglePreloaderAC = (isFetching: boolean) => ({type: TOGGLE_PRELOADER, isFetching:isFetching });

export default homeReducer;