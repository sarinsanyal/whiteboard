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

type Language = {
	label: string;
	value: string;
	defaultCode: string;
};

const LANGUAGES: Language[] = [
	{ label: "Javascript", value: "javascript", defaultCode: 'console.log("Hello JS");' },
	{ label: "Typescript", value: "typescript", defaultCode: 'console.log("Hello TS");' },
	{ label: "Python", value: "python", defaultCode: 'print("Hello Python")' },
	{ label: "Java", value: "java", defaultCode: 'System.out.println("Hello Java");' },
	{ label: "C++", value: "cpp", defaultCode: 'cout << "Hello C++";' },
	{ label: "C", value: "c", defaultCode: 'printf("Hello C");' },
];

export default function Code({
	roomId,
	nickname,
}: {
	roomId: string;
	nickname: string;
}) {
	const editorRef = useRef<any>(null);
	const { theme } = useTheme();

	const [language, setLanguage] = useState(LANGUAGES[0].value);
	const [code, setCode] = useState(LANGUAGES[0].defaultCode);

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

		socket.on("code-broadcast", handleIncomingCode);

		return () => {
			socket.off("code-broadcast", handleIncomingCode);
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

		socket.emit("code-update", {
			roomId,
			nickname,
			code: selected.defaultCode,
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
										<Button variant="outline">{selectedLang?.label}</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-56">
										<DropdownMenuRadioGroup
											value={language}
											onValueChange={handleLanguageChange}
										>
											{LANGUAGES.map((lang) => (
												<DropdownMenuRadioItem key={lang.value} value={lang.value}>
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
								minimap: { enabled: false },
								fontSize: 14,
								tabSize: 2,
								wordWrap: "on",
							}}
						/>
					</div>
				</form>
			</div>
		</div>
	);
}
