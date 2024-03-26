const SET_COURSES = 'SET_COURSES';

interface Action {
    type: string;
    courses: any;
}

interface State {
    courses: any[];
}

const initialState: State = {
    courses: [
    ]
}

const homeReducer = (state: State = initialState, action: Action): State => {
    switch(action.type) {
        case SET_COURSES:
            return { ...state, courses: [...state.courses, ...action.courses]};
        default:
            return state;
    }
}

export const setCourseAC = (courses: any) => ({ type: SET_COURSES, courses });
export default homeReducer;
      