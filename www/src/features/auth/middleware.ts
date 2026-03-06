import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "@/features/auth/server-session";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
    const session = await getSession();

    if (!session) {
        throw new Error("Unauthenticated");
    }

    return next({
        context: {
            session,
            user: session.user,
        },
    });
});
