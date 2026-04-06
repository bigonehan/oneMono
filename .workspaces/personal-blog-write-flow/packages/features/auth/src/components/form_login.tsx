"use client";

import { useState } from "react";

export type LoginPayload = {
  id: string;
  pw: string;
};

type FormLoginProps = {
  onSubmit?: (payload: LoginPayload) => void;
};

export const FormLogin = ({ onSubmit }: FormLoginProps) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  return (
    <form
      className="auth-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.({ id, pw });
      }}
    >
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
      <button type="submit">Login</button>
    </form>
  );
};
