import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormField, Input } from "@/components/ui/form-field";

describe("FormField", () => {
  it("connects a visible label and exposes an error message", () => {
    render(
      <FormField
        error="Enter a valid company name"
        htmlFor="company"
        label="Company"
        required
      >
        <Input aria-describedby="company-error" aria-invalid id="company" />
      </FormField>,
    );

    expect(screen.getByLabelText(/company/i)).toBeInvalid();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid company name",
    );
  });
});
