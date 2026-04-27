"use client";

import { useEffect } from "react";
import { setupFormHandlers } from "@/lib/form-submit-handler";

/**
 * Client component that initializes form submission handlers
 * Adds loading states and error display to quote and booking forms
 */
export function FormSubmitInitializer() {
  useEffect(() => {
    // Initialize form handlers after DOM is ready
    setupFormHandlers();
  }, []);

  // This component doesn't render anything
  return null;
}
