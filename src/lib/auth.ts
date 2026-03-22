import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					const res = await fetch(`${API_URL}/auth/login`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: credentials.email,
							password: credentials.password,
						}),
					});

					if (!res.ok) return null;

					const data = await res.json();

					return {
						id: data.user.id,
						email: data.user.email,
						name: data.user.name,
						accessToken: data.access_token,
					};
				} catch {
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = user.accessToken;
			}
			return token;
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken as string;
			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
});
