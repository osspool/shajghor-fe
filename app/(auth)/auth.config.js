export const authConfig = {
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/login",
        newUser: "/register",
    },
    providers: [
        // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
        // while this file is also used in non-Node.js environments
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            let isLoggedIn = !!auth?.user;
            let isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            let isAdminPage = nextUrl.pathname.startsWith("/super");
            let isOnLogin = nextUrl.pathname.startsWith("/login");
            let isOnRegister = nextUrl.pathname.startsWith("/register");

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login page
            }

            if (isAdminPage) {
                if (isLoggedIn) return true;
                return false;
            }

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL("/", nextUrl));
      }

            // if (isLoggedIn) {
            //   return Response.redirect(new URL("/dashboard", nextUrl));
            // }

            return true;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 3 * 24 * 60, // 3 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
};
