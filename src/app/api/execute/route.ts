import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const languageMap: Record<string, string> = {
    javascript: "18.15.0",
    typescript: "5.0.3",
    python: "3.10.0",
    java: "15.0.2",
    cpp: "10.2.0",
    c: "10.2.0",
    csharp: "6.12.0",
    go: "1.16.2",
    ruby: "3.0.1",
    php: "8.2.3",
    rust: "1.68.2",
    kotlin: "1.8.20",
    swift: "5.3.3",
    r: "4.1.1",
    bash: "5.2.0",
    sql: "3.36.0",           // PostgreSQL
    perl: "5.36.0",
    scala: "3.2.2",
    lua: "5.4.4",
    haskell: "9.0.1",
    nasm: "2.15.5",    // NASM
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code, language, input } = body;

        const version = languageMap[language];
        if (!version) {
            return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
        }

        const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
            language,
            version,
            files: [{ name: "main", content: code }],
            stdin: input,
        });

        return NextResponse.json({ output: response.data.run.output });
    } catch (error: any) {
        console.error(error.response?.data || error.message);
        return NextResponse.json(
            { error: "Failed to execute code." },
            { status: 500 }
        );
    }
}
