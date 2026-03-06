import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "@/features/auth/server-session";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
    const session = await getSession();

    if (!session) {
        return new Response(JSON.stringify({ success: false, error: "Unauthenticated" }), { status: 401 });
    }

    return next({
        context: {
            session,
            user: session.user,
        },
    });
});
