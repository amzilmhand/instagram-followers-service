// app/api/instagram/profile/route.ts  (or wherever your route lives)
import { type NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

function getPythonCandidates() {
  // allow override from env
  if (process.env.PYTHON_PATH && process.env.PYTHON_PATH.trim()) {
    return [process.env.PYTHON_PATH];
  }

  // typical candidates (Windows usually 'python', Linux/Mac often 'python3')
  if (process.platform === "win32") {
    return ["python", "py", "python3"];
  }
  return ["python3", "python"];
}

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    if (!username) return NextResponse.json({ error: "Username is required" }, { status: 400 });

    const cleanUsername = username.replace("@", "").trim();
    if (!cleanUsername) return NextResponse.json({ error: "Invalid username" }, { status: 400 });

    const scriptPath = path.resolve(process.cwd(), "scripts", "instagram_profile.py");

    return new Promise<NextResponse>((resolve) => {
      const candidates = getPythonCandidates();
      let tried = 0;
      let lastError: any = null;

      const trySpawn = (cmd: string) => {
        tried++;
        console.log(`Trying to spawn Python with: ${cmd}`);

        const python = spawn(cmd, [scriptPath, cleanUsername], {
          env: process.env,
          stdio: ["ignore", "pipe", "pipe"],
        });

        let stdout = "";
        let stderr = "";

        python.stdout.on("data", (d) => (stdout += d.toString()));
        python.stderr.on("data", (d) => (stderr += d.toString()));

        python.on("error", (err) => {
          // usually ENOENT when executable not found
          console.error(`Spawn error for '${cmd}':`, err && err.message);
          lastError = err;
          // if there are more candidates, try next
          if (tried < candidates.length) {
            trySpawn(candidates[tried]);
            return;
          }
          // all candidates exhausted -> return meaningful error
          resolve(
            NextResponse.json(
              { error: "Python not found or failed to start", details: err && err.message },
              { status: 500 }
            )
          );
        });

        python.on("close", (code) => {
          if (code !== 0) {
            console.error(`Python exited with code ${code}`);
            console.error("stderr:", stderr);
            // if there are more candidates, maybe try next (in case alternate py installer available)
            if (tried < candidates.length) {
              trySpawn(candidates[tried]);
              return;
            }
            resolve(NextResponse.json({ error: "Failed to fetch Instagram profile", details: stderr || `exit code ${code}` }, { status: 500 }));
            return;
          }

          try {
            const parsed = JSON.parse(stdout.trim());
            if (parsed.success) {
              resolve(NextResponse.json({ profile: parsed.profile }));
            } else {
              resolve(NextResponse.json({ error: parsed.error || "Profile not found" }, { status: 404 }));
            }
          } catch (parseErr) {
            console.error("Failed to parse Python output:", parseErr);
            console.error("raw stdout:", stdout);
            resolve(NextResponse.json({ error: "Invalid response from profile service", details: stdout || parseErr.message }, { status: 500 }));
          }
        });

        // safety timeout per spawn (in case script hangs)
        const timeout = setTimeout(() => {
          try {
            python.kill();
          } catch {}
          resolve(NextResponse.json({ error: "Python script timeout" }, { status: 408 }));
        }, 30000);
        python.on("close", () => clearTimeout(timeout));
      }; // trySpawn

      trySpawn(candidates[0]);
    });
  } catch (err) {
    console.error("Instagram profile API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
