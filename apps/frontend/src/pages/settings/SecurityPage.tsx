import { useState } from "react";
import { useChangePasswordMutation } from "@/hooks/useAuthMutations";
import { useDeleteAccountMutation } from "@/hooks/useAuthMutations";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { Alert } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export function SecurityPage() {
  return (
    <PageContainer narrow>
      <div className="space-y-8">
        <PageHeader
          title="Security"
          description="Manage your password and security settings"
        />

        <ChangePasswordCard />

        <Separator />

        <DeleteAccountCard />
      </div>
    </PageContainer>
  );
}

function ChangePasswordCard() {
  const changePassword = useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validate = (): boolean => {
    const next: typeof errors = {};

    if (!currentPassword) {
      next.currentPassword = "Current password is required.";
    }
    if (!newPassword) {
      next.newPassword = "New password is required.";
    } else if (newPassword.length < 8) {
      next.newPassword = "Password must be at least 8 characters.";
    }
    if (newPassword !== confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    changePassword.mutate(
      {
        current_password: currentPassword,
        new_password: newPassword,
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setErrors({});
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Field
            label="Current password"
            htmlFor="current_password"
            error={errors.currentPassword}
          >
            <PasswordInput
              id="current_password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          </Field>

          <Field
            label="New password"
            htmlFor="new_password"
            error={errors.newPassword}
          >
            <PasswordInput
              id="new_password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </Field>

          <Field
            label="Confirm new password"
            htmlFor="confirm_password"
            error={errors.confirmPassword}
          >
            <PasswordInput
              id="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </Field>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            variant="primary"
            loading={changePassword.isPending}
            disabled={changePassword.isPending}
          >
            Update password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function DeleteAccountCard() {
  const deleteAccount = useDeleteAccountMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!password) return;
    deleteAccount.mutate(
      {
        password,
        reason: reason || undefined,
      },
      {
        onSettled: () => {
          setConfirmOpen(false);
          setPassword("");
          setReason("");
        },
      },
    );
  };

  return (
    <>
      <Card className="border-danger-200">
        <CardHeader>
          <CardTitle className="text-danger-700">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert
            variant="danger"
            title="This action is irreversible"
            description="All your data will be permanently deleted. This cannot be undone."
          />

          <div className="space-y-3">
            <Field label="Confirm your password" htmlFor="delete_password">
              <PasswordInput
                id="delete_password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Field>

            <Field label="Reason for leaving (optional)" htmlFor="delete_reason">
              <textarea
                id="delete_reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Help us improve by sharing why you're leaving"
                rows={3}
                className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </Field>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            disabled={!password}
          >
            Delete account
          </Button>
        </CardFooter>
      </Card>

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete your account?"
        description="This action is permanent and cannot be undone. All your data will be erased."
        confirmLabel="Delete account"
        variant="danger"
        loading={deleteAccount.isPending}
        onConfirm={handleConfirm}
      />
    </>
  );
}
