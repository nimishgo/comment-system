import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { clearUser } from "../store/authSlice";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex w-full justify-between py-8">
      {isAuthenticated && user && (
        <>
          <div className="flex items-center">
            <img
              src={user.photoURL || ""}
              alt={user.displayName || ""}
              className="w-8 h-8 rounded-full mr-2"
            />
            <p className="text-lg mx-2">{user.displayName}</p>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-block font-bold text-lg mx-2"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Header;
