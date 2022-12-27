import test from '../../assets/icon.jpg'
import { Link, useNavigate } from 'react-router-dom';

const EditCard = ({data}) => {
    const {blogData="cat",blogTitle="fish",authorId="0483",_id:id,imageUrl}=data;
    
    const navigate=useNavigate();
    return (
        <div className="col-sm col-md-6 col-lg-3 mt-4">
            <div className="card single-card">
                <div className="card-image-container"
                        onClick={()=>navigate(`/article/${id}`)}                
                >
                    <img src={imageUrl} className="card-img-top" alt="..."/>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{blogTitle}</h5>
                    <p className="card-text text-truncate">
                        {blogData}
                        </p>
                        <div className='d-flex justify-content-between'>
                            <button className="btn btn-primary"
                            onClick={()=>navigate(`/edit/${id}`)}
                            >Edit</button>

                            <button className="btn btn-primary"
                            onClick={()=>navigate(`/edit/${id}`)}
                            >Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default EditCard;