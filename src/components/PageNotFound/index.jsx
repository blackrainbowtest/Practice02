import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  const homeHandleClick = () => {
    navigate("/");
  };
  return (
    <>
      <h1>Error 404 Page not found</h1>
      <button onClick={homeHandleClick}>Go Home</button>
    </>
  );
}
