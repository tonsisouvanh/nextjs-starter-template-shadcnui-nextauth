import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  phoneNumber: z.string().min(10).max(10),
  dob: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = userSchema.safeParse(body);
    if (!validationResult.success) {
      const error = validationResult.error.errors[0];
      return NextResponse.json({ status: 'error', message: `${error.path}: ${error.message}` }, { status: 400 });
    }

    const { email, password, fullName, phoneNumber, dob } = validationResult.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json({ status: 'error', message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phoneNumber,
        dob,
        status: 'INACTIVE',
      },
    });

    return NextResponse.json({ message: 'Sign up successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error signing up:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to sign up' }, { status: 500 });
  }
}
