import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Underline as UnderlineIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sanitizeRichTextHtml } from "@/lib/rich-text";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...",
  disabled = false,
  editorKey,
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  editorKey?: string;
}) {
  const initialContent = sanitizeRichTextHtml(value);

  return (
    <RichTextEditorInner
      key={editorKey}
      initialContent={initialContent}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

function RichTextEditorInner({
  initialContent,
  onChange,
  placeholder,
  disabled,
}: {
  initialContent: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled: boolean;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noreferrer",
          target: "_blank",
        },
      }),
      Underline,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(sanitizeRichTextHtml(editor.getHTML()));
    },
    editorProps: {
      attributes: {
        class: "min-h-56 p-4 outline-none",
      },
    },
  });

  const promptForLink = () => {
    if (!editor || disabled) return;

    const previousUrl = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Enter the link URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const fallbackContent = initialContent.trim();

  return (
    <div className="border">
      <div className="flex flex-wrap gap-2 border-b bg-muted/20 p-2">
        <ToolbarButton
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={disabled || !editor?.can().chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={disabled || !editor?.can().chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("underline")}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          disabled={
            disabled || !editor?.can().chain().focus().toggleUnderline().run()
          }
        >
          <UnderlineIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("paragraph")}
          onClick={() => editor?.chain().focus().setParagraph().run()}
          disabled={disabled}
        >
          <Pilcrow className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("heading", { level: 2 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("heading", { level: 3 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
        >
          <Heading3 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          disabled={disabled}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("blockquote")}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
        >
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("link")}
          onClick={promptForLink}
          disabled={disabled || !editor}
        >
          <LinkIcon className="size-4" />
        </ToolbarButton>
      </div>

      <div className="relative">
        {!editor && !fallbackContent ? (
          <div className="pointer-events-none absolute left-4 top-4 text-sm text-muted-foreground">
            {placeholder}
          </div>
        ) : null}
        {editor?.isEmpty ? (
          <div className="pointer-events-none absolute left-4 top-4 text-sm text-muted-foreground">
            {placeholder}
          </div>
        ) : null}
        {editor ? (
          <EditorContent
            editor={editor}
            className={cn(
              "wysiwyg-editor",
              disabled &&
                "pointer-events-none cursor-not-allowed bg-muted/20 opacity-80",
            )}
          />
        ) : (
          <div
            className={cn(
              "wysiwyg-content min-h-56 p-4",
              disabled && "cursor-not-allowed bg-muted/20 opacity-80",
            )}
            dangerouslySetInnerHTML={{
              __html: fallbackContent || "<p></p>",
            }}
          />
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        "size-8",
        active && "bg-foreground text-background hover:bg-foreground/90 hover:text-background",
      )}
      disabled={disabled}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      {children}
    </Button>
  );
}
