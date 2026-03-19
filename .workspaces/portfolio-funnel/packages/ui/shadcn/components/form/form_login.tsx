"use client";

import { useState } from "react";

type FormLoginProps = {
  onSubmit?: (payload: { id: string; pw: string }) => void;
};

export const FormLogin = ({ onSubmit }: FormLoginProps) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  return (
    <form
      className="grid gap-3 rounded-lg border p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.({ id, pw });
      }}
    >
      <label className="grid gap-1">
        <span className="text-sm font-medium">ID</span>
        <input
          value={id}
          onChange={(event) => setId(event.target.value)}
          className="h-10 rounded-md border px-3"
          placeholder="user id"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Password</span>
        <input
          type="password"
          value={pw}
          onChange={(event) => setPw(event.target.value)}
          className="h-10 rounded-md border px-3"
          placeholder="password"
        />
      </label>

      <button type="submit" className="h-10 rounded-md bg-black text-white">
        Login
      </button>
    </form>
  );
};
