import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  return (
    <ul>
      <h1>hdsdghsg</h1>
      {todos?.map((todo) => (
        <li>{todo}</li>
      ))}
    </ul>
  );
}
