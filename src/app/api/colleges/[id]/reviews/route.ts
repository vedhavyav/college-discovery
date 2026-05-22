import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collegeId } = await params;
    const body = await request.json();
    const { userName, rating, comment } = body;

    // Validation
    if (!userName || typeof userName !== 'string' || userName.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 });
    }
    if (!comment || typeof comment !== 'string' || comment.trim() === '') {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
    }

    // Verify college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        collegeId,
        userName,
        rating: parsedRating,
        comment,
      },
    });

    // Recalculate college average rating
    const reviews = await prisma.review.findMany({
      where: { collegeId },
      select: { rating: true },
    });

    const averageRating =
      reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    // Update college average rating in database
    await prisma.college.update({
      where: { id: collegeId },
      data: {
        rating: Math.round(averageRating * 10) / 10,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error('Error posting review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
