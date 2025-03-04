import * as bcrypt from 'bcrypt';

export async function hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10; // Number of salt rounds for bcrypt
    return await bcrypt.hash(plainPassword, saltRounds);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
}