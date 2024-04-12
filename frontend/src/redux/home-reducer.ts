const SET_COURSES = 'SET_COURSES';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const SET_TOTAL_COURSES_COUNT = 'SET_TOTAL_COURSES_COUNT';
const TOGGLE_PRELOADER = 'TOGGLE_PRELOADER';
const SET_COURSE = 'SET_COURSE';
const SET_MODULES = 'SET_MODULES';
const SET_MODULES_COUNT = 'SET_MODULES_COUNT';
const SET_LESSONS_COUNT = 'SET_LESSONS_COUNT';

interface Action {
    type: string;
    courses: any;
    currentPage: number;
    totalCoursesCount: number;
    isFetching: boolean;
    course: any;
    modules: any;
    modulesCount: number;
    lessonsCount: number;
}

interface State {
    courses: any[];
    modules: any[]; 
    pageSize: number;
    totalCoursesCount: number;
    currentPage: number;
    isFetching: boolean;
    course: any;
    modulesCount: number;
    lessonsCount: number;
}

const initialState: State = {
    courses: [],
    modules: [],
    pageSize: 6,
    totalCoursesCount: 0,
    modulesCount: 0, 
    currentPage: 1,
    isFetching: false,
    course: null,
    lessonsCount: 0
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
        default:
            return state;
    }
}

export const setCourses = (courses: any) => ({ type: SET_COURSES, courses });
export const setCurrentPage = (currentPage: number) => ({ type: SET_CURRENT_PAGE, currentPage:currentPage });
export const setTotalCourses = (totalCoursesCount: number) => ({ type: SET_TOTAL_COURSES_COUNT, totalCoursesCount:totalCoursesCount });
export const togglePreloader = (isFetching: boolean) => ({type: TOGGLE_PRELOADER, isFetching:isFetching });
export const setCourse = (course:any) => ({type: SET_COURSE, course});
export const setModules = (modules: any) => ({ type: SET_MODULES, modules });
export const setModulesCount = (modulesCount: number) => ({ type: SET_MODULES_COUNT, modulesCount });
export const setLessonsCount = (lessonsCount: number) => ({ type: SET_LESSONS_COUNT, lessonsCount });

export default homeReducer;