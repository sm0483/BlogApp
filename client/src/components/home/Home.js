import NavBar from "../common/NavBar";
import Main from "../common/Main";
import { getAllBlog } from "../../apis";
import { useEffect, useReducer } from "react";
import {reducer,ACTIONS} from "../../helper/Helper";
import Loading from "../common/Loading";
import Save from "../common/Saved";
import { useAuth } from "../../context/authContext.";



const initState={
    data:[],
    error:null,
    loading:true,
}


const Home = () => {
    const [state,dispatch]=useReducer(reducer,initState);
    const {data,error,loading}=state;
    const {authState,authDispatch}=useAuth();
    console.log(authState);

    useEffect(()=>{
        dispatch({ type: ACTIONS.CALL_API });
        let isActive = true;
            const getData=async()=>{
                try{
                const response=await getAllBlog();
                if (response.status === 200) {
                    dispatch({ type: ACTIONS.SUCCESS, data: response.data });
                    console.log(response)
                    return;
                }
                console.log(response);
            }catch(err){
                console.log(err);
                dispatch({ type: ACTIONS.ERROR, error: err.message});
            }
    
            }
    
            getData();

            // eslint-disable-next-line react-hooks/exhaustive-deps

    
    
       
        return () => {
            isActive = false;
        };
    },[])

    return (
        <>
        <NavBar/>
        {
            loading ? (
                <Loading/>
            ):  error ?
            ( <div className="container pt-5 
                save-message-container d-flex justify-content-center">
                <Save message={error} flag={ACTIONS.ERROR}/>
                </div>
            ) : (
                <Main blogData={data}/>
            )
        }
      
        </>
    );
    
    
}
 
export default Home;