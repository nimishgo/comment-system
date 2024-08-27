import { useDispatch, useSelector } from "react-redux";
import { Auth } from "./components/Auth";
import { auth } from "./firebase";
import { RootState } from "./store/store";
import { onAuthStateChanged } from "firebase/auth";
import { setUser } from "./store/authSlice";
import { useEffect } from "react";
import Header from "./components/Header";
import CommentList from "./components/CommentList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommentInput from "./components/CommentInput";
import { useComments } from "./hooks/useComments";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { comments, addReply } = useComments("latest");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="px-72">
      {isAuthenticated ? <Header /> : <Auth />}
      <CommentInput />
      <CommentList comments={comments} onSubmit={addReply} sortBy="latest" />
      <ToastContainer />
    </div>
  );
}

export default App;
