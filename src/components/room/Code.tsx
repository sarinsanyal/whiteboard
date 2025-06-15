"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { socket } from "@/socket";
import { toast } from "sonner";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";

type Language = {
	label: string;
	value: string;
	defaultCode: string;
};

//languageas to add here
const LANGUAGES: Language[] = [
	{ label: "JavaScript", value: "javascript", defaultCode: 'console.log("Welcome to Whiteboard!"); \n// Start typing from here\n\n' },
	{ label: "TypeScript", value: "typescript", defaultCode: 'console.log("Welcome to Whiteboard!"); \n// Start typing from here\n\n' },
	{ label: "Python", value: "python", defaultCode: 'print("Welcome to Whiteboard!")\n# Start typing from here\n\n' },
	{ label: "Java", value: "java", defaultCode: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Welcome to Whiteboard!");\n\t\t// Start typing from here\n\t}\n}\n' },
	{ label: "C++", value: "cpp", defaultCode: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tcout << "Welcome to Whiteboard!" << endl;\n\t// Start typing from here\n\treturn 0;\n}\n' },
	{ label: "C", value: "c", defaultCode: '#include <stdio.h>\n\nint main() {\n\tprintf("Welcome to Whiteboard!\\n");\n\t// Start typing from here\n\treturn 0;\n}\n' },
	{ label: "C#", value: "csharp", defaultCode: 'using System;\n\nclass Program {\n\tstatic void Main() {\n\t\tConsole.WriteLine("Welcome to Whiteboard!");\n\t\t// Start typing from here\n\t}\n}\n' },
	{ label: "Go", value: "go", defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Welcome to Whiteboard!")\n\t// Start typing from here\n}\n' },
	{ label: "Ruby", value: "ruby", defaultCode: 'puts "Welcome to Whiteboard!"\n# Start typing from here\n\n' },
	{ label: "PHP", value: "php", defaultCode: '<?php\n\necho "Welcome to Whiteboard!\\n";\n// Start typing from here\n\n?>\n' },
	{ label: "Rust", value: "rust", defaultCode: 'fn main() {\n\tprintln!("Welcome to Whiteboard!");\n\t// Start typing from here\n}\n' },
	{ label: "Kotlin", value: "kotlin", defaultCode: 'fun main() {\n\tprintln("Welcome to Whiteboard!")\n\t// Start typing from here\n}\n' },
	{ label: "Swift", value: "swift", defaultCode: 'import Foundation\n\nprint("Welcome to Whiteboard!")\n// Start typing from here\n' },
	{ label: "R", value: "r", defaultCode: 'cat("Welcome to Whiteboard!\\n")\n# Start typing from here\n\n' },
	{ label: "Bash", value: "bash", defaultCode: 'echo "Welcome to Whiteboard!"\n# Start typing from here\n\n' },
	{ label: "SQL", value: "sql", defaultCode: '-- Welcome to Whiteboard!\n-- Start typing from here\n\nSELECT * FROM table_name;\n' },
	{ label: "Perl", value: "perl", defaultCode: 'print "Welcome to Whiteboard!\\n";\n# Start typing from here\n\n' },
	{ label: "Scala", value: "scala", defaultCode: 'object Main extends App {\n\tprintln("Welcome to Whiteboard!")\n\t// Start typing from here\n}\n' },
	{ label: "Lua", value: "lua", defaultCode: 'print("Welcome to Whiteboard!")\n-- Start typing from here\n\n' },
	{ label: "Haskell", value: "haskell", defaultCode: 'main = do\n\tputStrLn "Welcome to Whiteboard!"\n\t-- Start typing from here\n\n' },
	{
		label: "Assembly", value: "nasm",
		defaultCode: `; Welcome to Whiteboard!\n; Start typing from here\n\nsection .data\n\tmsg db "Welcome to Whiteboard!", 0Ah\n\nsection .text\n\tglobal _start\n\n_start:\n\tmov eax, 4\t\t; syscall: write\n\tmov ebx, 1\t\t; file descriptor: stdout\n\tmov ecx, msg\t\t; message to write\n\tmov edx, 24\t\t; message length\n\tint 0x80\t\t; call kernel\n\n\texit:\n\tmov eax, 1\t\t; syscall: exit\n\txor ebx, ebx\t\t; status 0\n\tint 0x80\n\n; If you're still here, you’re either a wizard or a masochist\n`
	}

];


export default function Code({ roomId, nickname, }: { roomId: string; nickname: string; }) {
	const editorRef = useRef<any>(null);
	const { theme } = useTheme();
	const [language, setLanguage] = useState(LANGUAGES[0].value);
	const [code, setCode] = useState(LANGUAGES[0].defaultCode);
	const [userInput, setUserInput] = useState("");
	const [output, setOutput] = useState("");
	const [isRunning, setIsRunning] = useState(false);

	const handleRunCode = async () => {
		setIsRunning(true);
		setOutput("Running...");
		try {

			const response = await fetch("/api/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					language,
					code,
					input: userInput,
				}),
			});

			const result = await response.json();
			setOutput(result.output || "No output received.");
		} catch (err) {
			setOutput("Error running code.");
			console.error(err);
		} finally {
			setIsRunning(false);
		}
	};

	// Emit full code on local change
	const handleCodeChange = (newValue: string | undefined) => {
		const newCode = newValue ?? "";
		setCode(newCode);

		socket.emit("code-update", {
			roomId,
			nickname,
			code: newCode,
		});
	};

	// When new code is received from the server
	useEffect(() => {
		const handleIncomingCode = (incoming: { code: string }) => {
			setCode(incoming.code);
		};
		const handleIncomingLanguage = (incoming: { language: string }) => {
			const selected = LANGUAGES.find((l) => l.value === incoming.language);
			if (selected) {
				setLanguage(incoming.language);
				setCode(selected.defaultCode); // Optional: Reset code with default for new lang
				toast.message(`Code Language changed to: ${selected.label}`);
			}
		};

		socket.on("code-broadcast", handleIncomingCode);
		socket.on("language-broadcast", handleIncomingLanguage);

		return () => {
			socket.off("code-broadcast", handleIncomingCode);
			socket.off("language-broadcast", handleIncomingLanguage);
		};
	}, []);

	// On editor mount
	const handleEditorMount = (editor: any) => {
		editorRef.current = editor;
	};

	// On language change
	const handleLanguageChange = (value: string) => {
		const selected = LANGUAGES.find((l) => l.value === value);
		if (!selected) return;

		setLanguage(value);
		setCode(selected.defaultCode);
		toast.message(`Code Language changed to: ${selected.label}`);

		socket.emit("code-update", {
			roomId,
			nickname,
			code: selected.defaultCode,
		});

		socket.emit("language-change", {
			roomId,
			nickname,
			language: selected.value,
		});
	};

	const selectedLang = LANGUAGES.find((l) => l.value === language);

	return (
		<div className="flex justify-center items-start rounded-md">
			<div className="w-full rounded-lg max-w-4xl p-4 border">
				<form>
					<div className="mb-5">
						<div className="flex justify-between items-center mb-5">
							<div>
								<div className="font-bold">Write code here and collaborate!</div>
								<div>Choose your language</div>
							</div>
							<div className="flex gap-2">
								<Button
									type="button"
									onClick={() => {
										navigator.clipboard.writeText(code);
										toast.success("Code copied");
									}}
									className="cursor-pointer"
								>
									Copy Code
								</Button>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" className="cursor-pointer">{selectedLang?.label}</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-56">
										<DropdownMenuRadioGroup
											value={language}
											onValueChange={handleLanguageChange}
										>
											{LANGUAGES.map((lang) => (
												<DropdownMenuRadioItem key={lang.value} value={lang.value} className="cursor-pointer">
													{lang.label}
												</DropdownMenuRadioItem>
											))}
										</DropdownMenuRadioGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
						<Editor
							height="40vh"
							language={language}
							value={code}
							onChange={handleCodeChange}
							onMount={handleEditorMount}
							theme={theme === "light" ? "light" : "vs-dark"}
							options={{
								fontSize: 14,
								tabSize: 2,
								wordWrap: "on",
							}}
						/>
						<div className="flex justify-end mt-4">
							<Button
								type="button"
								onClick={handleRunCode}
								className="px-6 py-3 cursor-pointer"
								disabled={isRunning}
							>
								{isRunning ? "Running..." : "▶ Run"}
							</Button>
						</div>

						<div className="mt-6 grid md:grid-cols-2 gap-2">
							<div>
								<label className="font-semibold block mb-2">Input</label>
								<textarea
									rows={8}
									placeholder="Enter input here..."
									className="w-full min-h-[8rem] h-full border rounded-md p-3 text-sm resize-none bg-white dark:bg-gray-900"
									onChange={(e) => setUserInput(e.target.value)}
								/>
							</div>
							<div>
								<label className="font-semibold block mb-2">Output</label>
								<pre className="w-full min-h-[8rem] h-full max-h-64 border rounded-md p-3 text-sm bg-gray-100 dark:bg-gray-800 text-black dark:text-white overflow-y-auto overflow-x-auto whitespace-pre-wrap text-left">
									{output || "Output will appear here."}
								</pre>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
