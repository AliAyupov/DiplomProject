import { connect } from "react-redux";
import { setCourseAC, setCurrentPageAC, setTotalCoursesAC, togglePreloaderAC } from "../../redux/home-reducer";
import HomeApiComponent from "./HomeApiComponent";

let mapStateToProps = (state: any) => {
    return {
        courses: state.homePage.courses,
        pageSize : state.homePage.pageSize,
        totalCoursesCount : state.homePage.totalCoursesCount,
        currentPage: state.homePage.currentPage,
        isFetching: state.homePage.isFetching
    }
}
let mapDispatchToProps = (dispatch: (arg0: any) => void) => {
    return {
        setCourses: (courses: any) => {
            dispatch(setCourseAC(courses));
        },
        setCurrentPage: (pageNumber: number) =>{
            dispatch(setCurrentPageAC(pageNumber))
        },
        setTotalCoursesCount: (totalCoursesCount: any) => {
            dispatch(setTotalCoursesAC(totalCoursesCount))
        },
        toogleIsFetching: (isFetching: boolean) => {
            dispatch(togglePreloaderAC(isFetching));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps) (HomeApiComponent);