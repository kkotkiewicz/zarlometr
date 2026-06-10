import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import "../styles/notfound.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="notfound-root">
      <div className="notfound-code">404</div>
      <h1 className="notfound-title">Nie znaleziono strony</h1>
      <p className="notfound-subtitle">
        Ta strona nie istnieje albo została przeniesiona.
      </p>
      <Button onClick={() => navigate("/")}>Wróć na stronę główną</Button>
    </div>
  );
}
