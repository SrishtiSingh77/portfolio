"use client";
import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [scope, animate] = useAnimate();
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  // default rotating roles; can be overridden by providing them via words containing the marker
  // We'll detect the token "AI Developer" in the sentence and replace it with these rotating phrases.
  const rotatingRoles = [
    "AI Developer",
    "ML Enthusiast",
    "Full Stack Developer",
    "Passionate Coder",
  ];
  // keep the rotating role container a fixed width so swapping phrases doesn't shift layout
  const maxRoleChars = Math.max(...rotatingRoles.map((r) => r.length));
  let wordsArray = words.split(" ");
  useEffect(() => {
    console.log(wordsArray);
    animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: 2,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);

  const renderWords = () => {
    const spans: any[] = [];
    for (let i = 0; i < wordsArray.length; i++) {
      const word = wordsArray[i];
      const clean = word.replace(/[^\w]/g, "").toLowerCase();
      const next = wordsArray[i + 1];
      const nextClean = next ? next.replace(/[^\w]/g, "").toLowerCase() : "";

      // Detect the sequence "AI Developer" and replace it with a single rotating span
      if (clean === "ai" && nextClean === "developer") {
        const currentRole = rotatingRoles[currentRoleIndex] || "AI Developer";
        spans.push(
          <motion.span
            key={`role-${currentRoleIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`text-[#CBACF9] opacity-0`}
            style={{ display: "inline-block", minWidth: `${maxRoleChars}ch` }}
          >
            {currentRole} {" "}
          </motion.span>
        );
        i++; // skip the next word (Developer)
        continue;
      }

      const isAiOrDev = clean === "ai" || clean === "developer";
      const colorClass = isAiOrDev ? "text-[#CBACF9]" : "dark:text-white text-black";

      spans.push(
        <motion.span key={word + i} className={`${colorClass} opacity-0`}>
          {word} {" "}
        </motion.span>
      );
    }

    return (
      <motion.div ref={scope}>
        {spans}
      </motion.div>
    );
  };

  // Cycle the rotating role index
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((s) => (s + 1) % rotatingRoles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("font-bold", className)}>
      {/* mt-4 to my-4 */}
      <div className="my-4">
        {/* remove  text-2xl from the original */}
        <div className=" dark:text-white text-black leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
