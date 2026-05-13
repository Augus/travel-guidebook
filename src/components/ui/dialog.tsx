import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[min(980px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-[var(--radius-modal)] border border-[var(--border)] bg-[var(--paper)] shadow-[var(--shadow-modal)] focus:outline-none",
          className
        )}
        {...props}
      >
        <DialogPrimitive.Close className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-[var(--paper)]/95 text-[var(--foreground)] shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-[var(--soft)]">
          <X className="h-5 w-5" />
          <span className="sr-only">關閉</span>
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
