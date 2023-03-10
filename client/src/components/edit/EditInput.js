import { useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editBlog ,getBlogById} from '../../apis';
import { reducer ,ACTIONS, MESSAGE} from '../../helper/Helper';
import Loading from '../common/Loading';
import Save from '../common/Saved';
import { useEffect } from 'react';
import { deleteBlog } from '../../apis';
import { useAuth } from '../../context/authContext.';



const initState={
    data:{},
    error:null,
    loading:false
}



const EditInput=() => {
    const [title,setTitle]=useState("");
    const [blogData,setBlogData]=useState("");
    const [image,setImage]=useState("");
    const navigate=useNavigate();

    const [status,setStatus]=useState(false);
    const [errorButton,setErrorButton]=useState(false);
    const {authState,}=useAuth();

    const handleDelete=async(id)=>{
        try {
            await deleteBlog(id);
            navigate("/my-blog");
        } catch (error) {
            dispatch({ type: ACTIONS.ERROR, error});

        }
    }



    const {id}=useParams();

    const [state,dispatch]=useReducer(reducer,initState);
    const {error,loading}=state;





    useEffect(()=>{
        dispatch({ type: ACTIONS.CALL_API });
        let isActive=true;
        const getBlog=async()=>{
            try {
                const response=await getBlogById(id);
                dispatch({ type: ACTIONS.SUCCESS, data: response.data });
                console.log(response.data);
                setTitle(response.data.blogTitle);
                setBlogData(response.data.blogData);

            } catch (error) {
                dispatch({ type: ACTIONS.ERROR, error});
                setErrorButton(true);
                console.log(error);
            }
         
        }

        isActive && getBlog();



        return ()=>{
            isActive=false;
        }

    },[])


    const editData=async()=>{
        if(!title || !blogData ){
            dispatch({ type: ACTIONS.ERROR, error:MESSAGE.error.fieldEmpty});
            setErrorButton(true);
            return;
        }
        try {
            dispatch({ type: ACTIONS.CALL_API });
            const {name,_id}=authState.data;
            console.log(title);
            const data={
                blogTitle:title,
                blogData,
                authorId:_id,
                authorName:name,
                image
            }

            console.log(data)


            const response=await editBlog(id,data);
            if(response.status === 200){
                setStatus(true);
                setTitle("");
                setBlogData("");
                setImage("");
                console.log(response.data);
                dispatch({ type: ACTIONS.SUCCESS, data: response.data });

            } 
            console.log(response)
        } catch (error) {
            console.log(error);
            dispatch({ type: ACTIONS.ERROR, error});
            setErrorButton(true);


        }
    }


    const saveNavigate=()=>{
        setStatus(false);
        navigate("/my-blog");
    }


    return (
        <>
            { status ? (
            <div className="container pt-5 save-message-container d-flex justify-content-center"
                onMouseDown={saveNavigate}
            >
                <Save message={MESSAGE.success.savedData} flag={ACTIONS.SUCCESS}/>
            </div>)

            
                : errorButton  ? (
                    <div className="container pt-5 save-message-container d-flex 
                    justify-content-center"
                        onMouseDown={()=>setErrorButton(false)}
                    >
                    <Save message={error} flag={ACTIONS.ERROR}/>
                    </div>
                ):
            

            
            loading ? (<Loading/>) :(

            <div className="container pt-5 edit-container">

                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label h4">Title</label>
                    <input type="text" className="form-control title-input"
                    id="exampleFormControlInput1" placeholder="bing bang theory" value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    />
                </div>


                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label h4">Upload image</label>
                    <input type="file" className="form-control title-input"
                    id="exampleFormControlInput1" placeholder="bing bang theory"
                    onChange={(e)=>setImage(e.target.files[0])}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label h4">Article</label>
                    <textarea type="text" className="form-control article-text-area"
                    id="exampleFormControlInput1" placeholder="It is theory written ..."
                    value={blogData}
                    onChange={(e)=>setBlogData(e.target.value)}
                    />
                </div>
                <div className="mb-3 d-flex justify-content-between">
                    <button className="btn btn-primary"
                    onClick={editData}
                    >Edit</button>

                    <button className="btn btn-primary"
                            onClick={()=>handleDelete(id)}
                        >Delete</button>
                </div>

          
            </div>


                )
            }

            
            
    </>


    );
}
 
export default EditInput;