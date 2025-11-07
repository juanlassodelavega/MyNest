import Post from "./Post";

export default function Feed() {
  const posts = [
    { username: "Juan", content: "Mi perro aprendió a traer la pelota 🎾", timestamp: "Hace 5 min" },
    { username: "Ana", content: "Adopté un gatito adorable 🐱", timestamp: "Hace 10 min" },
  ];

  return (
    <main style={{ padding: "80px 32px 32px 32px" }}>
      <h1>Feed de MyNest 🐾</h1>
      {posts.map((p, i) => (
        <Post key={i} {...p} />
      ))}
    </main>
  );
}
