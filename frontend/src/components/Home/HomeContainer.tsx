import { connect } from "react-redux";
import Home from "./Home";
import { setCourseAC } from "../../redux/home-reducer";

let mapStateToProps = (state: any) => {
    return {
        courses: state.homePage.courses
    }
}
let mapDispatchToProps = (dispatch: (arg0: any) => void) => {
    return {
        setCourses: (courses: any) => {
            dispatch(setCourseAC(courses));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps) (Home);