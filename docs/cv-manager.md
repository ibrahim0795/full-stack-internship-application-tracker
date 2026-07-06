# CV manager

CareerOrbit stores named CV versions so users can target different roles and see which applications use each version.

## Storage boundary

Phase 11 records an HTTPS file URL and optional file metadata. It does not upload or claim to permanently host CV files. `ResumeStorageProvider` defines the future managed-storage boundary for upload creation, owner-scoped download URLs, and deletion. The interface can later be backed by an S3-compatible provider without changing the CV manager UI.

Records without a URL remain useful as metadata-only versions. A managed storage key takes precedence over an external URL when resolving a reference.

## Defaults and ownership

- The first CV becomes the user's default automatically.
- Setting another default clears the previous one in the same transaction.
- All list, detail, update, default, and deletion operations include the authenticated user ID.
- Deleting the default assigns the most recently updated remaining version as the replacement in the same transaction.

## Application usage

The manager displays real owner-scoped application assignments and links to those application records. A CV assigned to any application cannot be deleted until those applications are reassigned. This preserves history and matches the database's restrictive relation.

## Validation

Names and role labels have bounded lengths, URLs must use HTTP or HTTPS, supported metadata formats are PDF and DOCX, and declared file size cannot exceed 20 MB. These checks are enforced by Zod on both client and server; database constraints remain the final persistence boundary.
