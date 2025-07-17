"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("waiting_list").insert({ email, phone });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setEmail("");
      setPhone("");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h1>Join the Waiting List</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <label>
          Email <span style={{ color: "red" }}>*</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Mobile Number (optional)
          <PhoneInput
            country={'sa'}
            value={phone}
            onChange={setPhone}
            inputStyle={{ width: "100%" }}
            inputProps={{ name: "phone", autoComplete: "tel" }}
            enableSearch
          />
        </label>
        <button type="submit" disabled={loading} style={{ padding: 10, fontWeight: 600 }}>
          {loading ? "Joining..." : "Join Waiting List"}
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>Thank you for joining! We'll notify you when we launch.</div>}
      </form>
    </div>
  );
}
