export default function OrderHistoryComponent() {
  const handleClick = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    return data;
  };

  return <button onClick={handleClick}></button>;
}
