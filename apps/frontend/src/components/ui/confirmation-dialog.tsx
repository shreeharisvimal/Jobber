import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type ConfirmVariant = "danger" | "warning" | "info";

const variantButtonClass: Record<ConfirmVariant, string> = {
  danger: "bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500",
  warning: "bg-warning-500 text-white hover:bg-warning-600 focus-visible:ring-warning-400",
  info: "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500",
};

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: ConfirmVariant;
  loading?: boolean;
}

function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "danger",
  loading = false,
}: ConfirmationDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            className={variantButtonClass[variant]}
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-fg-secondary">{description}</p>
    </Modal>
  );
}

export { ConfirmationDialog };
