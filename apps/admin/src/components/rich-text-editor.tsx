"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BoldIcon,
  Heading2Icon,
  ItalicIcon,
  Link2Icon,
  Link2OffIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  name: string;
  initialHtml: string;
  disabled?: boolean;
  onChange?: (html: string) => void;
}

function Tool({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-[10px] transition-colors disabled:opacity-40 ${active ? "bg-ink text-cream" : "hover:bg-ink/8"}`}
    >
      {children}
    </button>
  );
}

/**
 * Éditeur de texte riche pour les campagnes : gras, italique, souligné, titre, listes, liens, annuler.
 * Le HTML produit est posé dans un champ caché (`name`) ; le serveur le nettoie avant de l'envoyer.
 */
export function RichTextEditor({ name, initialHtml, disabled, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class:
          "prose-email min-h-[220px] rounded-[12px] border border-line bg-white px-4 py-3 text-[15px] leading-relaxed outline-none focus-visible:border-ink",
      },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  const setLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Adresse du lien (https://…)", previous ?? "https://");
    if (url === null) return;
    if (!url.trim() || url === "https://") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const href = /^(https?:\/\/|mailto:)/i.test(url) ? url : `https://${url}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  const html = editor?.getHTML() ?? initialHtml;
  return (
    <div className="grid gap-2">
      <input type="hidden" name={name} value={html} />
      <div
        className="flex flex-wrap items-center gap-1 rounded-[12px] border border-line bg-cream-2/60 p-1"
        role="toolbar"
        aria-label="Mise en forme"
      >
        <Tool
          label="Gras"
          active={editor?.isActive("bold")}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <BoldIcon className="size-4" />
        </Tool>
        <Tool
          label="Italique"
          active={editor?.isActive("italic")}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="size-4" />
        </Tool>
        <Tool
          label="Souligné"
          active={editor?.isActive("underline")}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-4" />
        </Tool>
        <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
        <Tool
          label="Titre"
          active={editor?.isActive("heading", { level: 2 })}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2Icon className="size-4" />
        </Tool>
        <Tool
          label="Liste à puces"
          active={editor?.isActive("bulletList")}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <ListIcon className="size-4" />
        </Tool>
        <Tool
          label="Liste numérotée"
          active={editor?.isActive("orderedList")}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrderedIcon className="size-4" />
        </Tool>
        <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
        <Tool label="Lien" active={editor?.isActive("link")} disabled={disabled} onClick={setLink}>
          <Link2Icon className="size-4" />
        </Tool>
        <Tool
          label="Retirer le lien"
          disabled={disabled || !editor?.isActive("link")}
          onClick={() => editor?.chain().focus().unsetLink().run()}
        >
          <Link2OffIcon className="size-4" />
        </Tool>
        <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
        <Tool
          label="Annuler"
          disabled={disabled || !editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <UndoIcon className="size-4" />
        </Tool>
        <Tool
          label="Rétablir"
          disabled={disabled || !editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <RedoIcon className="size-4" />
        </Tool>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
