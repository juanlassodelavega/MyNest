type PostProps = {
  username: string;
  content: string;
  timestamp: string;
};

export default function Post({ username, content, timestamp }: PostProps) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <p style={{ fontWeight: "bold" }}>{username}</p>
      <p>{content}</p>
      <small style={{ color: "#666" }}>{timestamp}</small>
    </div>
  );
}
