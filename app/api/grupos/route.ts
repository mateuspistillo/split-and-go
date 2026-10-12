import { pool } from "@/lib/db";

export async function GET() {
  const [linhas] = await pool.query("SELECT * FROM grupo");
  return Response.json(linhas);
}