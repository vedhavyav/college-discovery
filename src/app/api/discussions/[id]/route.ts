import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const question = await prisma.discussionQuestion.findUnique({
      where: { id },
      include: {
        answers: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error: any) {
    console.error('Error fetching discussion details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;
    const body = await request.json();
    const { userName, content } = body;

    if (!userName || typeof userName !== 'string' || userName.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Verify question exists
    const questionExists = await prisma.discussionQuestion.findUnique({
      where: { id: questionId },
    });

    if (!questionExists) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    const answer = await prisma.discussionAnswer.create({
      data: {
        questionId,
        userName,
        content,
      },
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error: any) {
    console.error('Error creating answer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
