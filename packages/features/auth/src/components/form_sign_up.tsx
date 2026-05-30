"use client";

import { useState } from "react";

export type SignUpPayload = {
  id: string;
  pw: string;
  name: string;
};

type FormSignUpProps = {
  onSubmit?: (payload: SignUpPayload) => void;
};

export const FormSignUp = ({ onSubmit }: FormSignUpProps) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");

  return (
    <form
      className="auth-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.({ id, pw, name });
      }}
    >
      <label>
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="name" />
      </label>
      <label>
        ID
        <input value={id} onChange={(event) => setId(event.target.value)} placeholder="user id" />
      </label>
      <label>
        Password
        <input
          type="password"
          value={pw}
          onChange={(event) => setPw(event.target.value)}
          placeholder="password"
        />
      </label>
      <button type="submit">Sign Up</button>
    </form>
  );
};
