const validate = (token: any) => {
	const isValid = true;
	if (!isValid || !token) return false;
	return true;
};

export const authMiddleware = (req: Request) => {
	const token = req.headers.get("Authorization")?.split("Bearer ")[1];
	return { isValid: validate(token) };
};
