import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";

export const Auth: React.FC = () => {
  const dispatch = useDispatch();

  const signInwithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      dispatch(setUser(result.user));
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="flex w-full justify-end py-8">
      <button
        onClick={signInwithGoogle}
        className="flex items-center mx-8 border-2 p-2 border-zinc-600 border-solid rounded-lg hover:bg-zinc-100"
      >
        <FcGoogle className="inline-block" size={32} />
        <p className="inline-block font-bold text-lg mx-2">
          Sign with the Google
        </p>
      </button>
    </div>
  );
};
