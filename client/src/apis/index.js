import axios from "axios";

export const api = axios.create({
    baseURL: '/api/v1',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8 multipart/form-data" 
    },

  });



export const editBlog=(id,data)=> api.patch(`/blog/edit/${id}`,data);
export const createBlog=(data)=>api.post("/blog/create",data);

export const setHead=(token)=>{
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('accessToken',token);
}


export  const getAllBlog=()=>api.get("/blog/all");
export const getBlogById=(id)=>api.get(`/blog/${id}`);
export const deleteBlog=(id)=>api.delete(`/blog/${id}`);
export const getBlogByAuthorId=(data)=> api.post("/blog/user-article",data);
export const registerUser=(data)=> api.post("/user/auth/register",data);
export const loginUser=(data)=> api.post("/user/auth/login",data,{withCredentials:true});
export const getUser=()=>api.get("/user");
export const verifyToken=()=>api.get("/user/auth/get-accessToken",{withCredentials:true});
export const logoutUser=()=>api.get("/user/auth/logout",{withCredentials:true});



let refresh=false;

api.interceptors.response.use(res=>res,async error=>{
  if(error.response.status===401 && !refresh){
    refresh=true;
    const response=await verifyToken();
    if(response.status===200){
      setHead(response.data.accessToken);
      return api(error.config);
    }
  }

  refresh=false;
  return error;
})





