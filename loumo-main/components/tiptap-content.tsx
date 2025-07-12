'use client'
import { EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import TextAlign from '@tiptap/extension-text-align'
//import Youtube from '@tiptap/extension-youtube'

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import TiptapMenu from "./tiptap-menu"
//import { Figure } from "@/extensions/imageWithCaption"

interface TiptapProps{
    value:string;
    onValueChange: (content:string)=>void;
}

function TiptapEditor({value, onValueChange}:TiptapProps) {
    const [mounted, setMounted] = useState(false)
    const editor = useEditor({
        extensions: [StarterKit, 
          Image.configure({
            HTMLAttributes: {
              inline: true,
              class: "mx-auto max-w-[66vw] min-[750px]:max-w-[700px] w-full h-auto mt-2"
            }
          }), 
          TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right', 'justify'],
          defaultAlignment: 'left',
        }),
      /* Youtube.configure({
        controls: false,
        nocookie: true
      }), */
    /* Figure.configure({
      HTMLAttributes: {
        class: "mx-auto max-w-[66vw] min-[750px]:max-w-[700px] w-full h-auto mt-2 flex flex-col justify-center items-center",

      }
    }) */
   ],
        content: value,
        onUpdate: ({editor}) => {
            const currentValue = editor.getHTML();
            onValueChange(currentValue);
        },
        editorProps: {
            attributes: {
                class: "tiptap min-h-[300px] border rounded-none p-4 prose prose-sm max-w-none my-0"
            }
        }
    })

    // Hydratation différée
  useEffect(() => {
    setMounted(true)
    return () => {
      if (editor) editor.destroy()
    }
  }, [editor]);

  if (!mounted) {
    return (
      <div className="min-h-[150px] border rounded-md p-4 flex items-center justify-center gap-2">
        <span>{"chargement"}</span><Loader className="animate-spin"/>
      </div>
    )
  }

  return (
    <div>
    <TiptapMenu editor={editor}/>
    <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor