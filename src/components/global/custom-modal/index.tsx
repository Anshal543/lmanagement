// "use client"
// import { ReactNode, useState, useEffect, useRef } from 'react';

// type CustomModalProps = {
//   trigger: ReactNode;
//   children: ReactNode;
//   className?: string;
//   maxWidth?: string;
// };

// export const CustomModal = ({
//   trigger,
//   children,
//   className = '',
//   maxWidth = 'max-w-2xl'
// }: CustomModalProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const modalRef = useRef<HTMLDivElement>(null);

//   // Close modal when clicking outside or pressing Escape
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         setIsOpen(false);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden'; // Prevent scrolling
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = '';
//     };
//   }, [isOpen]);

//   return (
//     <>
//       {/* Trigger - mimics DialogTrigger */}
//       <div onClick={() => setIsOpen(true)}>
//         {trigger}
//       </div>

//       {/* Modal Overlay */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//           {/* Modal Content - mimics DialogContent */}
//           <div
//             ref={modalRef}
//             className={`bg-[#1C1C1E] border border-themeGray rounded-lg overflow-visible ${maxWidth} w-full ${className}`}
//           >
//             {children}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

"use client"
import { ReactNode, useEffect, useRef, useState } from "react"

type CustomModalProps = {
  trigger: ReactNode
  children: ReactNode
  className?: string
  maxWidth?: string
  onOpenChange?: (open: boolean) => void
}

export const CustomModal = ({
  trigger,
  children,
  className = "",
  maxWidth = "max-w-2xl",
  onOpenChange,
}: CustomModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  // Handle open state changes
  const setOpen = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      // Check if click is from editor dropdown
      const isEditorDropdown =
        target.closest(".tippy-box") || target.closest(".novel-editor-command")

      if (isEditorDropdown) {
        return // Ignore clicks from editor dropdown
      }

      if (modalRef.current && !modalRef.current.contains(target)) {
        if (!triggerRef.current?.contains(target)) {
          setOpen(false)
        }
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusableElements.length > 0) {
        ;(focusableElements[0] as HTMLElement).focus()
      }
    }
  }, [isOpen])

  return (
    <>
      {/* Trigger - mimics DialogTrigger */}
      <div
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {/* Modal Overlay - using portal for better z-index management */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          {/* Modal Content */}
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            className={`bg-[#1C1C1E] border border-themeGray p-4 rounded-lg overflow-visible ${maxWidth} w-full ${className}`}
            style={{
              // Ensure dropdowns can escape
              position: "relative",
              isolation: "auto", // Reset stacking context
            }}
          >
            {children}
          </div>
        </div>
      )}
    </>
  )
}
