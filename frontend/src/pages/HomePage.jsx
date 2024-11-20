import { useEffect } from "react";
import { Header } from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useMatchStore } from "../store/useMatchStore";

const HomePage = () => {
  const { isLoadingUserProfiles, getUserProfiles, userProfiles } =
    useMatchStore();

  useEffect(() => {
    getUserProfiles();
  }, [getUserProfiles]);

  console.log("User Profiles:", userProfiles);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 lg:flex-row">
      <Sidebar />
      <div className="flex flex-grow flex-col overflow-hidden">
        <Header />
      </div>
    </div>
  );
};

export default HomePage;

const NoMoreProfiles = () => (
  <div className="flex h-full flex-col items-center justify-center p-8 text-center">
    <Frown className="mb-6 text-pink-400" size={80} />
    <h2 className="mb-4 text-3xl font-bold text-gray-800">
      Woah there, speedy fingers!
    </h2>
    <p className="mb-6 text-xl text-gray-600">
      Bro are you OK? Maybe it&apos;s time to touch some grass.
    </p>
  </div>
);

const LoadingUI = () => {
  return (
    <div className="relative h-[28rem] w-full max-w-sm">
      <div className="card h-[28rem] w-96 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="h-3/4 px-4 pt-4">
          <div className="h-full w-full rounded-lg bg-gray-200" />
        </div>
        <div className="card-body bg-gradient-to-b from-white to-pink-50 p-4">
          <div className="space-y-2">
            <div className="h-6 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
