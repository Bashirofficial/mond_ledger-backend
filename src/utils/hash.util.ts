import bcrypt from "bcrypt"; 

const SALT_ROUNDS = 10;

// Password hashing (bcrypt for slow, secure hashing)
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
 