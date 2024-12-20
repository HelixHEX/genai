'use client'
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import Image from "next/image";
import { useDebounce } from '@uidotdev/usehooks';
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const debouncedPrompt = useDebounce(prompt, 300); // debounce by 300ms
  const [isTyping, setIsTyping] = useState(false);

  const { data } = useQuery({
    queryKey: [debouncedPrompt],
    queryFn: async () => {
      const res = await axios.post('/api/generateImage', {
        prompt: JSON.stringify({ prompt })
      })

      return res.data
    },
    enabled: !!debouncedPrompt.trim(),
    staleTime: Infinity,
    retry: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };


  return (
    <div className="w-full h-[100vh] min-h-[100vh] flex items-center justify-center">
      <motion.div
        className="w-full flex flex-col items-center h-full"
        initial={false}
        animate={{
          y: isTyping ? "50vh" : 0,
          translateY: isTyping ? "-50%" : 0
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {!isTyping && (
            <motion.p
              key="helper-text"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-gray-400 font-light pointer-events-none"
            >
              Describe your image to start generating
            </motion.p>
          )}
          {data && (
            <motion.div
              key="generated-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Image
                alt="Generated image"
                width={800}
                height={800}
                className="rounded-md max-w-[90vw] h-auto"
                src={`data:image/png;base64,${data.image.b64_json}`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="w-[400px] px-4 py-8 mt-auto"
          initial={false}
          animate={{
            width: isTyping ? "100%" : "400px"
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <input
            value={prompt}
            className="w-full p-3 bg-[#ECE8EF] text-gray-800 text-sm rounded-md outline-none"
            onChange={handleInputChange}
            placeholder="Describe your image..."
          />
        </motion.div>
      </motion.div>
    </div>
  );
}