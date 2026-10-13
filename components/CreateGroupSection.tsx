"use client";

import { useState } from "react";
import GroupForm from "./GroupForm";
import CreateGroupButton from "./CreateGroupButton";

export default function CreateGroupSection() {
  const [aberto, setAberto] = useState(false);

  if (aberto) {
    return <GroupForm />;
  }

  return <CreateGroupButton onClick={() => setAberto(true)} />;
}