import { useAuth } from "../context/AuthContext";

export default function MonComposant() {
  const { email, token } = useAuth();

  return (
    <div>
      <p>Email connecté : {email}</p>
      <p>Token : {token}</p>
      <p>Role : {role}</p>
    </div>
  );
}
