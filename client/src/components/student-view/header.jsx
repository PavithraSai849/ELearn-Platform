import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { color } from "framer-motion";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <header className="flex items-center justify-between p-4 border-b relative">
      {/* Left Section: Logo and Navigation */}
      <div className="flex items-center space-x-4">
        {/* Logo Link */}
        <Link
          to="/home"
          className="flex items-center hover:text-black focus:outline-none"
          aria-label="Navigate to home"
        >
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-[14px] md:text-xl">
            EdAccessible
          </span>
        </Link>
        {/* Explore Courses Button */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            onClick={() => {
              if (!location.pathname.includes("/courses")) {
                navigate("/courses");
              }
            }}
            className="text-[14px] md:text-[16px] font-medium dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
            aria-label="Explore Courses"
          >
            Explore Courses
          </Button>
        </div>
      </div>

      {/* Right Section: User Actions */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-4">
          {/* My Courses Link */}
          <div
            onClick={() => navigate("/student-courses")}
            className="flex items-center gap-3 cursor-pointer hover:text-gray-700 focus:outline-none"
            aria-label="Navigate to My Courses"
          >
            <span className="font-extrabold text-[14px] md:text-xl">
              My Courses
            </span>
            <TvMinimalPlay className="w-8 h-8" />
          </div>
          {/* Sign Out Button */}
          <Button
            style={{ backgroundColor: "#E86391" }}
            onClick={handleLogout}
            className="focus:ring-2 focus:ring-pink-500 text-black"
            aria-label="Sign Out"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
