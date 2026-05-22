import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const questions = await prisma.discussionQuestion.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { answers: true },
        },
      },
    });

    return NextResponse.json(questions);
  } catch (error: any) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, title, content } = body;

    if (!userName || typeof userName !== 'string' || userName.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const question = await prisma.discussionQuestion.create({
      data: {
        userName,
        title,
        content,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error: any) {
    console.error('Error creating discussion:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
