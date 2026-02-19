import { NextResponse } from "next/server";
import { fetchAllRepos } from "@/lib/github";

const GITHUB_USERNAME = "BornaBoyafraz";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await fetchAllRepos(GITHUB_USERNAME);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
