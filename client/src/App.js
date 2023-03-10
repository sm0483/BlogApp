import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import CreateBlog from './components/createBlog/Create';
import Home from './components/home/Home';
import MyBlog from './components/myBlog/MyBlog';
import Article from './components/article/Article'
import EditBlog from './components/edit/EditBlog';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { AuthProvider } from './context/authContext.';
import RequireAuth from './helper/RequireAuth';

function App() {
  return (
      <div className="main">
        <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path='/article/:id' element={<Article/>}/>
            <Route path="/create" element={
            <RequireAuth>
              <CreateBlog/>
            </RequireAuth>
            }/>
            <Route path="/my-blog" element={
            <RequireAuth>
              <MyBlog/>
            </RequireAuth>
            }/>
            <Route path="/my-article/:id" element={
            <RequireAuth>
                <Article/>
            </RequireAuth>
            }/>
            <Route path="/edit/:id" element={
              <RequireAuth>
              <EditBlog/>
              </RequireAuth>
            }/>
          </Routes>
        </Router>
        </AuthProvider>
      </div>
  );
}

export default App;
