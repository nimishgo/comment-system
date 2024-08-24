import { Auth } from "./components/Auth";
import { auth } from "./firebase";

function App() {
  const user = auth.currentUser;
  console.log(user);
  return (
    <div className="p-16">
      <Auth />
      <h1 className="text-3xl font-bold underline text-rose-700">
        Hello world!
      </h1>
    </div>
  );
}

export default App;
