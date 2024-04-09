import { connect } from "react-redux";
import { setCourses, setCurrentPage, setTotalCourses, togglePreloader } from "../../redux/home-reducer";
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

export default connect(mapStateToProps, { setCourses, setCurrentPage, setTotalCourses, toogleIsFetching:togglePreloader
}
) (HomeApiComponent);