// src/utils/user.ts

/**
 * Derive a stable numeric-looking ID from a Firebase UID.
 * Result: XXX-XXX-XXX (9 digits).
 */
export const formatUserIdFromUid = (uid: string): string => {
    if (!uid) return '000-000-000';

    let digits = '';

    for (let i = 0; i < uid.length; i += 1) {
        const code = uid.charCodeAt(i);
        digits += (code % 10).toString();
    }

    if (digits.length < 9) {
        digits = digits.padEnd(9, '0');
    }

    const slice = digits.slice(0, 9);
    return `${slice.slice(0, 3)}-${slice.slice(3, 6)}-${slice.slice(6, 9)}`;
};

/**
 * Fallback nickname derived from email when displayName is missing.
 */
export const fallbackUsernameFromEmail = (
    email: string | null | undefined,
): string => {
    if (!email) return 'New user';
    const [namePart] = email.split('@');
    if (!namePart) return email;
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
};
