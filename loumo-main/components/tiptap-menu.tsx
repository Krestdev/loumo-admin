'use client'
//import InsertImage from '@/components/insert-image';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
//import { SetImageUrl } from '@/lib/utils';
import { Editor } from '@tiptap/react';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, List, ListOrdered, Quote, Redo, SeparatorHorizontal, Strikethrough, Undo, WrapText } from 'lucide-react';
import React from 'react';
//import AddYoutubeVideo from './youtube';

function TiptapMenu({editor}:{editor: Editor|null}) {
    //Logic for a select, it's flashy and thats what I proposed on the design :/
    const [currentStyle, setCurrentStyle] = React.useState('paragraph');
    React.useEffect(()=>{
      if(!!editor){
        if (editor.isActive('paragraph')) {
            setCurrentStyle('paragraph')
          } else if (editor.isActive('heading', { level: 1 })) {
            setCurrentStyle('h1')
          } else if (editor.isActive('heading', { level: 2 })) {
            setCurrentStyle('h2')
          } else if (editor.isActive('heading', { level: 3 })) {
            setCurrentStyle('h3')
          } else if (editor.isActive('heading', { level: 4 })) {
            setCurrentStyle('h4')
          }
      }
    },[editor, editor?.state.selection]);

    if(!editor){
        return null;
    }

    //Select handler
    const handleValueChange = (value: string) => {
        switch (value) {
          case 'paragraph':
            editor.chain().focus().setParagraph().run()
            break
          case 'h1':
            editor.chain().focus().toggleHeading({ level: 1 }).run()
            break
          case 'h2':
            editor.chain().focus().toggleHeading({ level: 2 }).run()
            break
          case 'h3':
            editor.chain().focus().toggleHeading({ level: 3 }).run()
            break
          case 'h4':
            editor.chain().focus().toggleHeading({ level: 4 }).run()
            break
        }
      }

      /* const addImage = (image:string, caption?:string) => {
        if(caption){
          editor.chain().focus().setFigure({ src: SetImageUrl(image), caption }).run()
        } else {
          editor.chain().focus().setImage({ src: SetImageUrl(image) }).run()
        }
      } */

    /* const addYoutubeVideo = (url:string) => {
      editor.commands.setYoutubeVideo({
        src: url
      })
    } */


    return (
          <div className="flex flex-wrap items-center divide-x divide-y divide-input border border-input border-b-0">
            {/* <Button variant={editor.isActive('paragraph') ? "default" : "ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().setParagraph().run()}}
            >
              {"Paragraph"}
            </Button> */}
            <Select defaultValue={currentStyle} onValueChange={handleValueChange}>
                <SelectTrigger className='w-40 border-none focus:ring-0'>
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='paragraph'>{"Paragraphe"}</SelectItem>
                    <SelectItem value='h1'>{"Titre 1"}</SelectItem>
                    <SelectItem value='h2'>{"Titre 2"}</SelectItem>
                    <SelectItem value='h3'>{"Titre 3"}</SelectItem>
                    <SelectItem value='h4' >{"Titre 4"}</SelectItem>
                </SelectContent>
            </Select>
            <Button size={"icon"} variant={editor.isActive('bold') ? "default" : "ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleBold().run()}}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .toggleBold()
                  .run()
              }
            >
              <Bold/>
            </Button>
            <Button size={"icon"} variant={editor.isActive('italic') ? "default" : "ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleItalic().run()}}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .toggleItalic()
                  .run()
              }
            >
              <Italic/>
            </Button>
            <Button size={"icon"} variant={editor.isActive('strike') ? "default" : "ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleStrike().run()}}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .toggleStrike()
                  .run()
              }
            >
              <Strikethrough/>
            </Button>
            <Button size={"icon"} variant={editor.isActive({textAlign: 'left'}) ? "default" : "ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().setTextAlign('left').run()}}
              disabled={
                !editor.can().chain().focus().setTextAlign('left').run()
              }
            >
              <AlignLeft/>
            </Button>
            <Button size={"icon"} variant={editor.isActive({textAlign: 'center'}) ? "default" : "ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().setTextAlign('center').run()}}
              disabled={
                !editor.can().chain().focus().setTextAlign('center').run()
              }
            >
              <AlignCenter/>
            </Button>
            <Button size={"icon"} variant={editor.isActive({textAlign: 'right'}) ? "default" : "ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().setTextAlign('right').run()}}
              disabled={
                !editor.can().chain().focus().setTextAlign('right').run()
              }
            >
              <AlignRight/>
            </Button>
            <Button size={"icon"} variant={editor.isActive({textAlign: 'justify'}) ? "default" : "ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().setTextAlign('justify').run()}}
              disabled={
                !editor.can().chain().focus().setTextAlign('justify').run()
              }
            >
              <AlignJustify/>
            </Button>
            {/* <InsertImage image={undefined} onChange={addImage}/> */}
            {/* <AddYoutubeVideo addVideo={addYoutubeVideo}/> */}

            <Button size={"icon"} variant={editor.isActive('bulletList') ? "default" : "ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleBulletList().run()}}
            >
              <List/>
            </Button>
            <Button size={"icon"} variant={editor.isActive('orderedList') ? "default" : "ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleOrderedList().run()}}
            >
              <ListOrdered/>
            </Button>

            <Button size={"icon"} variant={editor.isActive('blockquote') ? "default" : "ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleBlockquote().run()}}
            >
              <Quote/>
            </Button>
            <Button size={"icon"} variant={"ghost"}
             onClick={(e) =>{e.preventDefault(); editor.chain().focus().setHorizontalRule().run()}}>
              <SeparatorHorizontal/>
            </Button>
            <Button size={"icon"} variant={"ghost"}
             onClick={(e) =>{e.preventDefault(); editor.chain().focus().setHardBreak().run()}}>
              <WrapText/>
            </Button>
            <Button size={"icon"} variant={"ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().undo().run()}}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .undo()
                  .run()
              }
            >
              <Undo/>
            </Button>
            <Button size={"icon"} variant={"ghost"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().redo().run()}}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .redo()
                  .run()
              }
            >
              <Redo/>
            </Button>
          </div>
      )
}

export default TiptapMenu