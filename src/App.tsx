import { useDispatch, useSelector } from "react-redux";
import { Auth } from "./components/Auth";
import { auth } from "./firebase";
import { RootState } from "./store/store";
import { onAuthStateChanged } from "firebase/auth";
import { setUser } from "./store/authSlice";
import { useEffect } from "react";
import Header from "./components/Header";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, [dispatch]);
  return <div className="px-72">{isAuthenticated ? <Header /> : <Auth />}</div>;
}

export default App;
