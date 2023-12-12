import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      console.log(import.meta.env.VITE_API_URL);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}contests`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log(result);

        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleClick = () => {navigate("/create-contest");};

  return (
    <>
    <ul>
        {data.map((item) => (
        <li key={item.id}>
            <p>{item.title}</p>
            <p>{item.description}</p>
            <p>Zgłoszenia zbierane od {item.date_start} do {item.date_end}</p>
            <p>Typ konkursu: {item.type}</p>
        </li>
        ))}
    </ul>
    <button onClick={handleClick}>Utwórz konkurs</button>
    </>
  );
}

export default HomePage;
