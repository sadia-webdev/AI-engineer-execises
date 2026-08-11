import {  createAuthClient} from "better-auth/react";

export const authClient = createAuthClient({
    baseUrl: "http://localhost:300"
})


export const {signUp, signIn, useSession, signOut} = authClient