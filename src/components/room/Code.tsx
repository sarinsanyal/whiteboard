"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
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

export default function Code({ roomId, nickname }: { roomId: string, nickname: string }) {
	const editorRef = useRef<any>(null);

	const handleEditorDidMount = (editor: any) => {
		editorRef.current = editor;
	};
	const { theme } = useTheme();
	const languageArray = [
		{
			label: "Javascript",
			value: "javascript",
			defaultCode: `
// Welcome to Whiteboard code-sharing 
console.log("Say hello to Whiteboard Code Sharing!");
console.log("This is Javascript");

// Start writing code from here
`
		},
		{
			label: "Typescript",
			value: "typescript",
			defaultCode: `
// Welcome to Whiteboard code-sharing 
console.log("Say hello to Whiteboard Code Sharing!");
console.log("This is Typescript");

// Start writing code from here
`
		},
		{
			label: "Python",
			value: "python",
			defaultCode: `
# Welcome to Whiteboard code-sharing
print("Say hello to Whiteboard Code Sharing!")
print("This is Python")

#Start writing code from here
`
		},
		{
			label: "Java",
			value: "java",
			defaultCode: `
// Welcome to Whiteboard code-sharing
public class Main {
	public static void main(String[] args) {
		System.out.println("Say hello to Whiteboard Code Sharing!");
		System.out.println("This is Java");
	}
}
//Start writing code from here
`
		},
		{
			label: "C++",
			value: "cpp",
			defaultCode: `
//Welcome to Whiteboard code-sharing

#include <bits/stdc++.h>
using namespace std;

int main() {
	cout << "Say hello to Whiteboard code-sharing!" << endl;
	cout << "This is C++" << endl;
	
	return 0;
}
//Start writing code from here
`
		},
		{
			label: "C",
			value: "c",
			defaultCode: `
//Welcome to Whiteboard code-sharing

#include <stdio.h>

int main(){
	printf("Say hello to Whiteboard code-sharing!");
	printf("This is C");
	
	return 0;
}
//Start writing code from here
`
		}
	]

	const [language, setLanguage] = useState(languageArray[0].value);
	const selectedLang = languageArray.find(l => l.value === language);
	const [code, setCode] = useState(languageArray[0].defaultCode);

	const handleSubmit = async () => { };
	const handleLanguageChange = (value: string) => {
		setLanguage(value);
		const selected = languageArray.find(l => l.value === value);
		setCode(selected?.defaultCode || '');
	};
	const handleCodeChange = (value: string | undefined) => {
		const safeCode = value || '';
		setCode(safeCode);
		socket.emit("code-change", { roomId, nickname, code: safeCode });
	};
	// Move handleCursorChange to outer scope so it can be used in both effects
	// const handleCursorChange = () => {
	// 	if (!editorRef.current) return;

	// 	const position = editorRef.current.getPosition(); // Get current cursor position
	// 	console.log(position);
	// 	socket.emit("cursor-change", {
	// 		roomId,
	// 		nickname,
	// 		cursor: position, // { lineNumber: number, column: number }
	// 	});
	// };


	useEffect(() => {
		if (!socket) {
			console.log("no socket present")
			return;
		}

		const handleCodeUpdate = ({ code }: { code: string }) => {
			if (!editorRef.current) return;

			const currentValue = editorRef.current.getValue();
			if (currentValue !== code) {
				editorRef.current.setValue(code);
				setCode(code);
			}
		};

		socket.on("code-update", handleCodeUpdate);
		socket.on("cursor-update", ({ cursor }: { cursor: { lineNumber: number; column: number } }) => {
			if (!editorRef.current || !cursor) return;
			editorRef.current.setPosition(cursor); // Update local editor with new cursor position
		});

		// Cleanup listener on unmount
		return () => {
			socket.off("code-update", handleCodeUpdate);
			socket.off("cursor-update");
		};
	}, []);

	// useEffect(() => {
	// 	if (!editorRef.current) return;

	// 	const editor = editorRef.current;

	// 	// Listen to cursor movements
	// 	const disposable = editor.onDidChangeCursorPosition(handleCursorChange);

	// 	// Cleanup on unmount
	// 	return () => {
	// 		disposable.dispose();
	// 	};
	// }, []);


	return (
		<div className="flex justify-center items-start rounded-md">
			<div className="w-full rounded-lg max-w-4xl p-4 border">
				<form action="#" onSubmit={handleSubmit}>
					<div className="">
						<label htmlFor="comment" className="sr-only">
							Add your code
						</label>
						<div className="rounded-lg">
							<div className="flex justify-between items-center mb-5">
								<div>
									<div className="font-bold">
										Write code here and colab with room members!
									</div>
									<div>
										Choose your language for auto-completion
									</div>
								</div>
								<div>
									<Button
										type="button"
										variant="default"
										className="mb-2 md:mr-2 cursor-pointer"
										onClick={() => {
											navigator.clipboard.writeText(code).then(() => {
												console.log("Code copied to clipboard");
												toast.message("Code copied to clipboard")
											}).catch(err => {
												console.error("Failed to copy code: ", err);
												toast.error("Error in copying code");
											});
										}}
									>
										Copy Code
									</Button>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" className="cursor-pointer">{selectedLang?.label}</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="w-56">
											<DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
												{languageArray.map((lang) => (
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
								className="z-2"
								language={language}
								value={code}
								onChange={handleCodeChange}
								theme={theme === "light" ? "light" : "vs-dark"}
								onMount={handleEditorDidMount}
							/>
						</div>

					</div>
					<div className="flex justify-between pt-2">
						<div className="flex items-center space-x-5"></div>
						<div className="flex-shrink-0">
							<button
								type="submit"
								className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
							>
								Run
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}