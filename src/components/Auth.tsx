import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { FcGoogle } from "react-icons/fc";

export const Auth: React.FC = () => {
  const signInwithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      console.log(res.user.displayName);
    } catch (error) {
      alert("Login failed : " + error);
    }
  };
  return (
    <div className="flex w-full justify-end p-4">
      <button onClick={signInwithGoogle} className="flex items-center mx-8">
        <FcGoogle className="inline-block" size={32} />
        <p className="inline-block font-bold text-lg mx-2">
          Sign with the Google
        </p>
      </button>
    </div>
  );
};
