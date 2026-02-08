import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const FULL_TEXT = "Transforming Ideas into Digital Solutions";
const HIGHLIGHTED_TEXT = "Digital Solutions";

export default function TypewriterHero() {
	const [displayedText, setDisplayedText] = useState("");

	useEffect(() => {
		if (displayedText.length < FULL_TEXT.length) {
			const timeout = setTimeout(() => {
				setDisplayedText(FULL_TEXT.substring(0, displayedText.length + 1));
			}, 50); // Speed of typing
			return () => clearTimeout(timeout);
		}
	}, [displayedText]);

	// Split text to highlight the last part
	const regularText = displayedText.substring(0, displayedText.length - HIGHLIGHTED_TEXT.length);
	const highlightedPart = displayedText.substring(displayedText.length - HIGHLIGHTED_TEXT.length);

	return (
		<div className="h-24 md:h-32 mb-6">
			<h1 className="text-4xl md:text-5xl font-bold h-full flex items-center">
				<span>
					{regularText}
					{highlightedPart && (
						<span className="text-primary">{highlightedPart}</span>
					)}
					{displayedText.length < FULL_TEXT.length && (
						<motion.span
							animate={{ opacity: [1, 0] }}
							transition={{ duration: 0.8, repeat: Infinity }}
							className="text-primary"
						>
							|
						</motion.span>
					)}
					{displayedText.length === 0 && (
						<span className="invisible">{FULL_TEXT}</span>
					)}
				</span>
			</h1>
		</div>
	);
}
