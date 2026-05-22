import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exam = searchParams.get('exam') || '';
    const rankStr = searchParams.get('rank') || '';
    const category = searchParams.get('category') || 'General';
    const quota = searchParams.get('quota') || 'All India';

    if (!exam || !rankStr) {
      return NextResponse.json(
        { error: 'Exam and Rank parameters are required' },
        { status: 400 }
      );
    }

    const rank = parseInt(rankStr);
    if (isNaN(rank) || rank <= 0) {
      return NextResponse.json(
        { error: 'Rank must be a positive integer' },
        { status: 400 }
      );
    }

    // Query matching cutoffs
    // In cutoffs database:
    // Closing rank should be >= user's rank (lower rank number is better)
    const cutoffs = await prisma.cutoff.findMany({
      where: {
        exam: {
          equals: exam,
        },
        category: {
          equals: category,
        },
        // Match either user's quota or All India
        quota: {
          in: [quota, 'All India'],
        },
        closingRank: {
          gte: rank,
        },
      },
      include: {
        college: true,
      },
      orderBy: {
        closingRank: 'asc', // Ambitions targets first
      },
    });

    // Compute simple admission chance probability
    // If user's rank is very close to closing rank (e.g. closingRank - rank < 100), chance is medium/high.
    // If user's rank is much better than closing rank (e.g., closingRank / rank > 1.5), chance is very high.
    const results = cutoffs.map((cutoff) => {
      const difference = cutoff.closingRank - rank;
      let admissionChance: 'High' | 'Medium' | 'Low' = 'Low';
      
      if (difference > rank * 0.5) {
        admissionChance = 'High';
      } else if (difference > rank * 0.1) {
        admissionChance = 'Medium';
      } else {
        admissionChance = 'Low';
      }

      return {
        id: cutoff.id,
        courseName: cutoff.courseName,
        closingRank: cutoff.closingRank,
        quota: cutoff.quota,
        category: cutoff.category,
        exam: cutoff.exam,
        college: cutoff.college,
        admissionChance,
      };
    });

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error running predictor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
