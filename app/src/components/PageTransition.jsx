import { useLocation } from "react-router-dom";
import "../styles/transitions.css";

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div key={location.key} className="page-enter">
      {children}
    </div>
  );
}
