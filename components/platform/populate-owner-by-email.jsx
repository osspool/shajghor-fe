"use client";

import { useEffect, useMemo, useState } from "react";
import { useUserSearch } from "@/hooks/query/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle2, AlertCircle, Wand2 } from "lucide-react";

export function PopulateOwnerByEmail({ token, onPopulate, onPopulateUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { searchUser, user, notFound, isSearching, error, reset } = useUserSearch({ token });

  useEffect(() => {
    if (user?._id) {
      if (onPopulateUser) {
        onPopulateUser(user);
      } else {
        onPopulate?.(user._id);
      }
      setIsOpen(false);
      setEmail("");
      // keep result reset so subsequent searches start clean
      setTimeout(() => reset(), 0);
    }
  }, [user, onPopulate, onPopulateUser, reset]);

  const canSubmit = useMemo(() => {
    return !!email && /.+@.+\..+/.test(email);
  }, [email]);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
    reset();
  };

  const handlePopulate = () => {
    if (!canSubmit) return;
    searchUser(email, "email");
  };

  const handleCancel = () => {
    setIsOpen(false);
    setEmail("");
    reset();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={handleOpen} disabled={isSearching}>
          <Wand2 className="h-4 w-4 mr-2" />
          {isOpen ? "Hide email populate" : "Populate owner by email"}
        </Button>
        {isSearching && (
          <span className="inline-flex items-center text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Searching…
          </span>
        )}
      </div>

      {isOpen && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter owner email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSearching}
                />
              </div>
            </div>
            <Button type="button" onClick={handlePopulate} disabled={!canSubmit || isSearching}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Populate"}
            </Button>
            <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSearching}>
              Cancel
            </Button>
          </div>

          {notFound && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No user found with this email.</AlertDescription>
            </Alert>
          )}

          {error && !notFound && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message || "Failed to search user"}</AlertDescription>
            </Alert>
          )}

          {user && (
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Found {user.name || user.email}. Owner ID set to {user._id}
                {user.organization ? `, organization set to ${user.organization}` : ""}.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}


